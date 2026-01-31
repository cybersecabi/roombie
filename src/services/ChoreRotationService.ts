import { collection, getDocs, query, where, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { startOfWeek, endOfWeek, addWeeks } from 'date-fns';
import { db } from '../firebase';
import type { Chore, Assignment, User } from '../types';

export class ChoreRotationService {
  static async generateWeeklyAssignments(houseId: string): Promise<void> {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

    // Check if assignments already exist for this week
    const existingQuery = query(
      collection(db, 'assignments'),
      where('houseId', '==', houseId),
      where('weekStart', '<=', weekStart),
      where('weekEnd', '>=', weekEnd)
    );
    const existingDocs = await getDocs(existingQuery);
    
    if (!existingDocs.empty) {
      console.log('Assignments already exist for this week');
      return;
    }

    // Verify house exists
    const houseDoc = await getDoc(doc(db, 'houses', houseId));
    if (!houseDoc.exists()) return;

    // Get roommates
    const roommatesQuery = query(
      collection(db, 'users'),
      where('houseId', '==', houseId)
    );
    const roommatesDocs = await getDocs(roommatesQuery);
    const roommates = roommatesDocs.docs.map(d => ({ id: d.id, ...d.data() } as User));

    if (roommates.length === 0) return;

    // Get chores
    const choresQuery = query(
      collection(db, 'chores'),
      where('houseId', '==', houseId)
    );
    const choresDocs = await getDocs(choresQuery);
    const chores = choresDocs.docs.map(d => ({ id: d.id, ...d.data() } as Chore));

    if (chores.length === 0) return;

    // Get last 4 weeks of assignments to calculate rotation
    const fourWeeksAgo = addWeeks(weekStart, -4);
    const historyQuery = query(
      collection(db, 'assignments'),
      where('houseId', '==', houseId),
      where('weekStart', '>=', fourWeeksAgo)
    );
    const historyDocs = await getDocs(historyQuery);
    const history = historyDocs.docs.map(d => ({ 
      id: d.id, 
      ...d.data(),
      weekStart: d.data().weekStart?.toDate(),
    } as Assignment));

    // Calculate assignment counts for each roommate
    const assignmentCounts: Record<string, number> = {};
    roommates.forEach(r => assignmentCounts[r.id] = 0);
    history.forEach(a => {
      if (assignmentCounts[a.userId] !== undefined) {
        assignmentCounts[a.userId]++;
      }
    });

    // Sort roommates by assignment count (ascending) to balance workload
    const sortedRoommates = [...roommates].sort((a, b) => 
      assignmentCounts[a.id] - assignmentCounts[b.id]
    );

    // Assign chores using round-robin with balancing
    const assignments: Omit<Assignment, 'id'>[] = [];
    
    chores.forEach((chore, index) => {
      // Use round-robin starting from the person with least assignments
      const roommateIndex = index % sortedRoommates.length;
      const assignedRoommate = sortedRoommates[roommateIndex];

      assignments.push({
        choreId: chore.id,
        choreName: chore.name,
        userId: assignedRoommate.id,
        userName: assignedRoommate.name,
        houseId,
        weekStart,
        weekEnd,
        status: 'pending',
        createdAt: now,
      });
    });

    // Save assignments to Firestore
    for (const assignment of assignments) {
      await addDoc(collection(db, 'assignments'), {
        ...assignment,
        weekStart: serverTimestamp(),
        weekEnd: serverTimestamp(),
        createdAt: serverTimestamp(),
      });
    }

    console.log(`Created ${assignments.length} assignments for house ${houseId}`);
  }

  static async checkAndRotateChores(): Promise<void> {
    // Get all houses
    const housesQuery = query(collection(db, 'houses'));
    const housesDocs = await getDocs(housesQuery);
    
    for (const houseDoc of housesDocs.docs) {
      const houseId = houseDoc.id;
      await this.generateWeeklyAssignments(houseId);
    }
  }

  static async updateStreaks(): Promise<void> {
    const now = new Date();
    const lastWeekStart = addWeeks(startOfWeek(now, { weekStartsOn: 1 }), -1);
    const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 1 });

    // Get all assignments from last week
    const lastWeekQuery = query(
      collection(db, 'assignments'),
      where('weekStart', '<=', lastWeekStart),
      where('weekEnd', '>=', lastWeekEnd)
    );
    const lastWeekDocs = await getDocs(lastWeekQuery);
    
    const userCompletions: Record<string, boolean> = {};
    
    lastWeekDocs.forEach(doc => {
      const data = doc.data();
      if (data.status === 'completed') {
        userCompletions[data.userId] = true;
      }
    });

    // Update streaks for users who completed all their chores
    for (const [userId, completed] of Object.entries(userCompletions)) {
      if (completed) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const currentStreak = userDoc.data().streak || 0;
          await updateDoc(userRef, {
            streak: currentStreak + 1,
          });
        }
      }
    }
  }
}

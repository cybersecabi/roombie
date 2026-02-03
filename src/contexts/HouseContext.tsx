import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  runTransaction
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import type { House, User, Chore, Assignment, ShoppingItem } from '../types';

interface HouseContextType {
  house: House | null;
  roommates: User[];
  chores: Chore[];
  assignments: Assignment[];
  shoppingList: ShoppingItem[];
  loading: boolean;
  createHouse: (name: string) => Promise<string>;
  joinHouse: (inviteCode: string) => Promise<void>;
  leaveHouse: () => Promise<void>;
  addChore: (chore: Omit<Chore, 'id' | 'createdAt' | 'houseId'>) => Promise<void>;
  deleteChore: (choreId: string) => Promise<void>;
  addShoppingItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'houseId' | 'status'>) => Promise<void>;
  purchaseItem: (itemId: string) => Promise<void>;
  completeAssignment: (assignmentId: string) => Promise<void>;
  refreshHouseData: () => Promise<void>;
}

const HouseContext = createContext<HouseContextType | undefined>(undefined);

export const useHouse = () => {
  const context = useContext(HouseContext);
  if (!context) {
    throw new Error('useHouse must be used within a HouseProvider');
  }
  return context;
};

const redactId = (id?: string) => {
  if (!id) return undefined;
  return `${id.substring(0, 4)}...${id.substring(id.length - 4)}`;
};

const generateInviteCode = () => {
  const array = new Uint8Array(3);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
};

export const HouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userData, currentUser, refreshUserData, updateUserData } = useAuth();
  const [house, setHouse] = useState<House | null>(null);
  const [roommates, setRoommates] = useState<User[]>([]);
  const [chores, setChores] = useState<Chore[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.houseId) {
      setHouse(null);
      setRoommates([]);
      setChores([]);
      setAssignments([]);
      setShoppingList([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const houseUnsubscribe = onSnapshot(
      doc(db, 'houses', userData.houseId),
      (doc) => {
        if (doc.exists()) {
          setHouse({ id: doc.id, ...doc.data() } as House);
        }
      }
    );

    const fetchRoommates = async () => {
      if (!userData.houseId) return;
      const q = query(collection(db, 'users'), where('houseId', '==', userData.houseId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const roommatesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setRoommates(roommatesData);
      });
      return unsubscribe;
    };

    const fetchChores = async () => {
      if (!userData.houseId) return;
      const q = query(collection(db, 'chores'), where('houseId', '==', userData.houseId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const choresData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          startDate: doc.data().startDate?.toDate(),
          endDate: doc.data().endDate?.toDate(),
        } as Chore));
        setChores(choresData);
      });
      return unsubscribe;
    };

    const fetchAssignments = async () => {
      if (!userData.houseId) return;
      const q = query(collection(db, 'assignments'), where('houseId', '==', userData.houseId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const assignmentsData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          weekStart: doc.data().weekStart?.toDate(),
          weekEnd: doc.data().weekEnd?.toDate(),
          completedAt: doc.data().completedAt?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
        } as Assignment));
        setAssignments(assignmentsData);
      });
      return unsubscribe;
    };

    const fetchShoppingList = async () => {
      if (!userData.houseId) return;
      const q = query(collection(db, 'shoppingItems'), where('houseId', '==', userData.houseId));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const itemsData = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          purchasedAt: doc.data().purchasedAt?.toDate(),
        } as ShoppingItem));
        setShoppingList(itemsData);
      });
      return unsubscribe;
    };

    let roommatesUnsubscribe: (() => void) | undefined;
    let choresUnsubscribe: (() => void) | undefined;
    let assignmentsUnsubscribe: (() => void) | undefined;
    let shoppingUnsubscribe: (() => void) | undefined;

    Promise.all([
      fetchRoommates().then(fn => { roommatesUnsubscribe = fn; }),
      fetchChores().then(fn => { choresUnsubscribe = fn; }),
      fetchAssignments().then(fn => { assignmentsUnsubscribe = fn; }),
      fetchShoppingList().then(fn => { shoppingUnsubscribe = fn; }),
    ]).then(() => setLoading(false));

    return () => {
      houseUnsubscribe();
      roommatesUnsubscribe?.();
      choresUnsubscribe?.();
      assignmentsUnsubscribe?.();
      shoppingUnsubscribe?.();
    };
  }, [userData?.houseId]);

  const createHouse = async (name: string) => {
    const userId = userData?.id || currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    if (!name || typeof name !== 'string') {
      throw new Error('House name is required');
    }
    
    const trimmedName = name.trim();
    if (trimmedName.length < 3 || trimmedName.length > 100) {
      throw new Error('House name must be between 3 and 100 characters');
    }
    
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmedName)) {
      throw new Error('House name contains invalid characters. Only letters, numbers, spaces, hyphens, and underscores are allowed');
    }
    
    const previousHouseId = userData?.houseId;
    const houseId = doc(collection(db, 'houses')).id;
    const inviteCode = generateInviteCode();
    
    const houseData: Omit<House, 'id'> = {
      name: trimmedName,
      inviteCode,
      createdBy: userId,
      createdAt: new Date(),
      roommates: [userId],
    };
    
    console.log('[HouseContext] Creating house:', redactId(houseId));
    
    try {
      await setDoc(doc(db, 'houses', houseId), {
        ...houseData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('[HouseContext] Failed to create house:', error);
      throw new Error('Failed to create house. Please try again.');
    }
    
    console.log('[HouseContext] Updating user houseId:', redactId(userId), redactId(houseId));
    
    try {
      await updateDoc(doc(db, 'users', userId), { houseId });
    } catch (error) {
      console.error('[HouseContext] Failed to update user houseId:', error);
      try {
        await setDoc(doc(db, 'houses', houseId), { deleted: true }, { merge: true });
      } catch (rollbackError) {
        console.error('[HouseContext] Failed to rollback house creation:', rollbackError);
        throw new Error('Failed to complete house creation and failed to rollback. Please contact support.');
      }
      throw new Error('Failed to update user record. Please try again.');
    }
    
    console.log('[HouseContext] Optimistically updating local userData with houseId:', redactId(houseId));
    
    if (userData) {
      updateUserData({ houseId });
    }
    
    console.log('[HouseContext] Refreshing userData to verify');
    
    try {
      await refreshUserData();
    } catch (error) {
      console.error('[HouseContext] refreshUserData failed:', error);
      console.error('[HouseContext] Rolling back houseId update');
      if (userData) {
        updateUserData({ houseId: previousHouseId });
      }
      throw new Error('Failed to verify house membership. Please try refreshing the page.');
    }
    
    return inviteCode;
  };

  const joinHouse = async (inviteCode: string) => {
    const userId = userData?.id || currentUser?.uid;
    console.log('[HouseContext] joinHouse called - userId:', redactId(userId));
    
    if (!userId) {
      console.error('[HouseContext] User not authenticated');
      throw new Error('User not authenticated');
    }
    
    if (!inviteCode || typeof inviteCode !== 'string') {
      console.error('[HouseContext] Invite code missing or invalid type:', typeof inviteCode);
      throw new Error('Invite code is required');
    }
    
    const trimmedCode = inviteCode.trim().toUpperCase();
    console.log('[HouseContext] Processing invite code:', trimmedCode);
    
    if (trimmedCode.length !== 6 || !/^[A-Z0-9]+$/.test(trimmedCode)) {
      console.error('[HouseContext] Invalid invite code format:', trimmedCode);
      throw new Error('Invalid invite code format. Invite code must be exactly 6 alphanumeric characters');
    }
    
    if (userData?.houseId) {
      console.error('[HouseContext] User already in house:', redactId(userData.houseId));
      throw new Error('You are already a member of a house. Leave your current house first.');
    }
    
    const previousHouseId = userData?.houseId;
    
    console.log('[HouseContext] Querying Firestore for house with invite code:', trimmedCode);
    
    let snapshot;
    try {
      const q = query(collection(db, 'houses'), where('inviteCode', '==', trimmedCode));
      snapshot = await getDocs(q);
      console.log('[HouseContext] Query completed. Found', snapshot.size, 'houses');
    } catch (queryError) {
      console.error('[HouseContext] Firestore query failed:', queryError);
      throw new Error('Failed to search for house. Please check your connection and try again.');
    }
    
    if (snapshot.empty) {
      console.error('[HouseContext] No house found with invite code:', trimmedCode);
      throw new Error('Invalid invite code. Please check the code and try again.');
    }
    
    const houseDoc = snapshot.docs[0];
    const houseId = houseDoc.id;
    const houseData = houseDoc.data() as House;
    
    console.log('[HouseContext] Found house:', redactId(houseId), 'Name:', houseData.name);
    
    // Check if user is already in roommates
    if (houseData.roommates?.includes(userId)) {
      console.log('[HouseContext] User already in house roommates, updating user record');
      try {
        await updateDoc(doc(db, 'users', userId), { houseId });
        if (userData) {
          updateUserData({ houseId });
        }
        return;
      } catch (error) {
        console.error('[HouseContext] Failed to update user houseId:', error);
        throw new Error('Failed to update user record. Please try again.');
      }
    }
    
    console.log('[HouseContext] Adding user to house roommates');
    
    try {
      await updateDoc(doc(db, 'houses', houseId), {
        roommates: arrayUnion(userId),
      });
      console.log('[HouseContext] Successfully added user to roommates');
    } catch (error) {
      console.error('[HouseContext] Failed to add user to house roommates:', error);
      throw new Error('Failed to join house. Please try again.');
    }
    
    console.log('[HouseContext] Updating user houseId:', redactId(userId), '->', redactId(houseId));
    
    try {
      await updateDoc(doc(db, 'users', userId), { houseId });
      console.log('[HouseContext] Successfully updated user houseId');
    } catch (error) {
      console.error('[HouseContext] Failed to update user houseId:', error);
      try {
        await updateDoc(doc(db, 'houses', houseId), {
          roommates: arrayRemove(userId),
        });
        console.log('[HouseContext] Rolled back roommates update');
      } catch (rollbackError) {
        console.error('[HouseContext] Failed to rollback house roommates update:', rollbackError);
        throw new Error('Failed to complete house join and failed to rollback. Please contact support.');
      }
      throw new Error('Failed to update user record. Please try again.');
    }
    
    console.log('[HouseContext] Optimistically updating local userData with houseId');
    
    if (userData) {
      updateUserData({ houseId });
    }
    
    console.log('[HouseContext] Refreshing userData to verify');
    
    try {
      await refreshUserData();
      console.log('[HouseContext] Successfully joined house');
    } catch (error) {
      console.error('[HouseContext] refreshUserData failed:', error);
      console.error('[HouseContext] Rolling back houseId update');
      if (userData) {
        updateUserData({ houseId: previousHouseId });
      }
      throw new Error('Failed to verify house membership. Please try refreshing the page.');
    }
  };

  const leaveHouse = async () => {
    if (!userData || !userData.houseId) return;
    
    const houseId = userData.houseId;
    const previousHouseId = userData.houseId;
    
    console.log('[HouseContext] Leaving house:', redactId(houseId));
    
    try {
      await runTransaction(db, async (transaction) => {
        const houseRef = doc(db, 'houses', houseId);
        const houseDoc = await transaction.get(houseRef);
        
        if (!houseDoc.exists()) {
          throw new Error('House not found');
        }
        
        const houseData = houseDoc.data() as House;
        if (!houseData.roommates?.includes(userData.id)) {
          throw new Error('You are not a member of this house');
        }
        
        if (houseData.roommates?.length <= 1) {
          throw new Error('You are the last member of this house. To leave, you must delete the house or add another member first.');
        }
        
        transaction.update(houseRef, {
          roommates: arrayRemove(userData.id),
        });
      });
    } catch (error) {
      console.error('[HouseContext] Failed to leave house:', error);
      if ((error as Error).message.includes('last member')) {
        throw error;
      }
      throw new Error('Failed to leave house. Please try again.');
    }
    
    console.log('[HouseContext] Setting user houseId to null');
    
    try {
      await updateDoc(doc(db, 'users', userData.id), { houseId: null });
    } catch (error) {
      console.error('[HouseContext] Failed to update user houseId:', error);
      throw new Error('Failed to update user record. Please contact support.');
    }
    
    console.log('[HouseContext] Optimistically updating local userData with houseId: null');
    
    updateUserData({ houseId: null });
    
    if (house) {
      setHouse({ 
        ...house, 
        roommates: house.roommates.filter(id => id !== userData.id) 
      });
    }
    
    console.log('[HouseContext] Refreshing userData to verify');
    
    try {
      await refreshUserData();
    } catch (error) {
      console.error('[HouseContext] refreshUserData failed:', error);
      console.error('[HouseContext] Rolling back houseId update');
      updateUserData({ houseId: previousHouseId });
      if (house) {
        setHouse(house);
      }
      throw new Error('Failed to verify house membership. Please try refreshing the page.');
    }
  };

  const addChore = async (chore: Omit<Chore, 'id' | 'createdAt' | 'houseId'>) => {
    if (!userData?.houseId) throw new Error('Not in a house');
    
    const choreId = doc(collection(db, 'chores')).id;
    await setDoc(doc(db, 'chores', choreId), {
      ...chore,
      houseId: userData.houseId,
      createdAt: serverTimestamp(),
      startDate: chore.startDate || null,
      endDate: chore.endDate || null,
    });
  };

  const deleteChore = async (choreId: string) => {
    await updateDoc(doc(db, 'chores', choreId), { deleted: true });
  };

  const addShoppingItem = async (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'houseId' | 'status'>) => {
    if (!userData?.houseId) throw new Error('Not in a house');
    
    const itemId = doc(collection(db, 'shoppingItems')).id;
    await setDoc(doc(db, 'shoppingItems', itemId), {
      ...item,
      houseId: userData.houseId,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  };

  const purchaseItem = async (itemId: string) => {
    if (!userData) throw new Error('User not authenticated');
    
    await updateDoc(doc(db, 'shoppingItems', itemId), {
      status: 'purchased',
      purchasedBy: userData.id,
      purchasedAt: serverTimestamp(),
    });
  };

  const completeAssignment = async (assignmentId: string) => {
    if (!userData) throw new Error('User not authenticated');
    
    await updateDoc(doc(db, 'assignments', assignmentId), {
      status: 'completed',
      completedAt: serverTimestamp(),
    });
    
    await updateDoc(doc(db, 'users', userData.id), {
      totalCompleted: (userData.totalCompleted || 0) + 1,
      lastCompletedAt: serverTimestamp(),
    });
  };

  const refreshHouseData = async () => {
    if (userData?.houseId) {
      const houseDoc = await getDoc(doc(db, 'houses', userData.houseId));
      if (houseDoc.exists()) {
        setHouse({ id: houseDoc.id, ...houseDoc.data() } as House);
      }
    }
  };

  const value = {
    house,
    roommates,
    chores,
    assignments,
    shoppingList,
    loading,
    createHouse,
    joinHouse,
    leaveHouse,
    addChore,
    deleteChore,
    addShoppingItem,
    purchaseItem,
    completeAssignment,
    refreshHouseData,
  };

  return (
    <HouseContext.Provider value={value}>
      {children}
    </HouseContext.Provider>
  );
};

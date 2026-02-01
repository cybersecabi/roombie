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
  arrayRemove
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

const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const HouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { userData, currentUser, refreshUserData } = useAuth();
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
    // Use userData or currentUser as fallback
    const userId = userData?.id || currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    const houseId = doc(collection(db, 'houses')).id;
    const inviteCode = generateInviteCode();
    
    const houseData: Omit<House, 'id'> = {
      name,
      inviteCode,
      createdBy: userId,
      createdAt: new Date(),
      roommates: [userId],
    };
    
    await setDoc(doc(db, 'houses', houseId), {
      ...houseData,
      createdAt: serverTimestamp(),
    });
    
    await updateDoc(doc(db, 'users', userId), { houseId });
    await refreshUserData();
    
    return inviteCode;
  };

  const joinHouse = async (inviteCode: string) => {
    // Use userData or currentUser as fallback
    const userId = userData?.id || currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    
    const q = query(collection(db, 'houses'), where('inviteCode', '==', inviteCode.toUpperCase()));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Invalid invite code');
    }
    
    const houseDoc = snapshot.docs[0];
    const houseId = houseDoc.id;
    
    await updateDoc(doc(db, 'houses', houseId), {
      roommates: arrayUnion(userId),
    });
    
    await updateDoc(doc(db, 'users', userId), { houseId });
    await refreshUserData();
  };

  const leaveHouse = async () => {
    if (!userData || !userData.houseId) return;
    
    await updateDoc(doc(db, 'houses', userData.houseId), {
      roommates: arrayRemove(userData.id),
    });
    
    await updateDoc(doc(db, 'users', userData.id), { houseId: null });
    await refreshUserData();
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

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { User } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  /** Updates local user data state (only allows houseId updates) */
  updateUserData: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (user: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData({ id: userDoc.id, ...userDoc.data() } as User);
      } else {
        console.warn('[AuthContext] User document not found for:', user.uid);
        setUserData(null);
      }
    } catch (error) {
      console.error('[AuthContext] Error fetching user data:', error);
      setUserData(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      
      setCurrentUser(user);
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
      }
      
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName: name });
    
    const userData: Omit<User, 'id'> = {
      email,
      name,
      streak: 0,
      totalCompleted: 0,
      createdAt: new Date(),
      houseId: null,
    };
    
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });
    
    // Immediately fetch user data so it's available for house creation
    await fetchUserData(user);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const refreshUserData = async () => {
    if (currentUser) {
      await fetchUserData(currentUser);
    }
  };

  const updateUserData = (updates: Partial<User>) => {
    if (Object.keys(updates).length === 0) {
      console.warn('[AuthContext] updateUserData called with empty updates');
      return;
    }
    
    if (!userData) {
      console.warn('[AuthContext] updateUserData called with null userData, ignoring:', updates);
      return;
    }
    
    const allowedFields = ['houseId'];
    const invalidFields = Object.keys(updates).filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
      console.warn('[AuthContext] Attempted to update protected fields:', invalidFields);
      return;
    }
    
    if ('houseId' in updates) {
      const houseIdValue = updates.houseId;
      if (houseIdValue !== null && houseIdValue !== undefined && typeof houseIdValue !== 'string') {
        console.warn('[AuthContext] Invalid houseId type:', typeof houseIdValue);
        return;
      }
    }
    
    setUserData({ ...userData, ...updates });
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    logout,
    refreshUserData,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

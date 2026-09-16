import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { Role, UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  role: Role;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  simulateRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [simulatedRole, setSimulatedRole] = useState<Role | null>(() => {
    return (localStorage.getItem('dastaan_simulated_role') as Role) || null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);

          // Super admin whitelist check from prompt metadata: bilalit.rfc@gmail.com
          const isOwnerEmail = user.email?.toLowerCase() === 'bilalit.rfc@gmail.com';
          const defaultRole: Role = isOwnerEmail ? 'super_admin' : 'customer';

          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            // Elevate to super_admin if owner email
            if (isOwnerEmail && data.role !== 'super_admin') {
              await setDoc(userDocRef, { ...data, role: 'super_admin' }, { merge: true });
              setUserProfile({ ...data, role: 'super_admin' });
            } else {
              setUserProfile(data);
            }
          } else {
            const newProfile: UserProfile = {
              id: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Royal Patron',
              photoURL: user.photoURL || '',
              role: defaultRole,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
          }
        } catch (err) {
          console.warn('User profile sync note:', err);
          setUserProfile({
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Royal Patron',
            photoURL: user.photoURL || '',
            role: user.email?.toLowerCase() === 'bilalit.rfc@gmail.com' ? 'super_admin' : 'customer',
            createdAt: new Date().toISOString(),
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-in error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      setSimulatedRole(null);
      localStorage.removeItem('dastaan_simulated_role');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  const simulateRole = (role: Role) => {
    setSimulatedRole(role);
    localStorage.setItem('dastaan_simulated_role', role);
  };

  // If a role is simulated or user profile is loaded
  const effectiveRole: Role =
    simulatedRole ||
    (currentUser?.email?.toLowerCase() === 'bilalit.rfc@gmail.com'
      ? 'super_admin'
      : userProfile?.role || 'customer');

  const isAdmin = ['super_admin', 'manager', 'order_manager', 'content_manager'].includes(effectiveRole);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        role: effectiveRole,
        isAdmin,
        loading,
        loginWithGoogle,
        logout,
        simulateRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

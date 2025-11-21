import { useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '@/lib/firebase';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!auth || !isFirebaseConfigured) {
      toast.error('Authentication is not configured. Please contact support.');
      return { user: null, error: new Error('Firebase not configured') };
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      toast.success('Account created successfully!');
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      return { user: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!auth || !isFirebaseConfigured) {
      toast.error('Authentication is not configured. Please contact support.');
      return { user: null, error: new Error('Firebase not configured') };
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      return { user: null, error };
    }
  };

  const signInWithGoogle = async () => {
    if (!auth || !googleProvider || !isFirebaseConfigured) {
      toast.error('Google sign-in is not configured. Please contact support.');
      return { user: null, error: new Error('Firebase not configured') };
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success('Signed in with Google successfully!');
      return { user: result.user, error: null };
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      return { user: null, error };
    }
  };

  const signOut = async () => {
    if (!auth || !isFirebaseConfigured) {
      toast.error('Authentication is not configured.');
      return;
    }

    try {
      await firebaseSignOut(auth);
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    isConfigured: isFirebaseConfigured,
  };
};

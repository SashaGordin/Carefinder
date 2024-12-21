import React, { useContext, useState, useEffect } from 'react';
import { auth, firestore } from '../firebase';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // Add state for user role

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(false);

      // gonna pop localStorageCurrentUserID into local storage to make it
      // accessible everywhere...
      // same with localStorageCurrentUserRole, as that will be handy
      if (user) {
        try {
          const userRef = firestore.collection('users').doc(user.uid);
          const doc = await userRef.get();
          if (doc.exists) {
            const userData = doc.data();
            setUserRole(userData.role); // Set the user role state
            localStorage.setItem('localStorageCurrentUserID', user.uid);
            localStorage.setItem('localStorageCurrentUserRole', userData.role);
          } else {
            console.log('No such document!');
            setUserRole(null);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      } else {
        localStorage.removeItem('localStorageCurrentUserID');
        localStorage.removeItem('localStorageCurrentUserRole');
        setUserRole(null);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

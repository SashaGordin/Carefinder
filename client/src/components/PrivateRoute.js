import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDoc, doc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function PrivateRoute({
  allowedRoles,
  redirectPath = '/',
  children,
}) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchUserRole() {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const role = userData.role;
            setUserRole(role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    fetchUserRole();
  }, [currentUser]);

  if (!currentUser) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" />;
  }

  if (!currentUser.emailVerified) {
    // Redirect to login if user is not verified
    return <Navigate to="/verify-email" />;
  }

  if (loading) {
    // Render loading state while fetching user role
    return <div>Loading...</div>;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to specified path if user role doesn't match allowed roles
    return <Navigate to={redirectPath} replace />;
  }

  // Render the children if user role is allowed
  return children;
}

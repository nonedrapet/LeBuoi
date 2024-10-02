// AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth"; // Đảm bảo đã import đúng
import { auth } from './firebaseConfig'; // Kiểm tra xem bạn đã import auth đúng chưa

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

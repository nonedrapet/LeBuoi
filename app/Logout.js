// Logout.js

import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from './firebaseConfig';
import { Alert, Button } from 'react-native';

const Logout = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Đăng xuất thành công!", "Bạn đã được đăng xuất.", [
        {
          text: "OK",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }], // Chuyển hướng về trang đăng nhập
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Lỗi", error.message);
    }
  };

  return (
    <Button title="Đăng xuất" onPress={handleLogout} />
  );
};

export default Logout;

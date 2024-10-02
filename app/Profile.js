// Profile.js

import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AuthContext } from './AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext); // Sử dụng context để lấy thông tin người dùng

  return (
    <View>
      {user ? (
        <Text>Xin chào, {user.email}!</Text> // Hiển thị email của người dùng
      ) : (
        <Text>Bạn chưa đăng nhập.</Text> // Thông báo nếu chưa đăng nhập
      )}
    </View>
  );
};

export default Profile;

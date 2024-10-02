// AuthLoading.js
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { auth } from './firebaseConfig'; // Đảm bảo import firebase auth
import { useNavigation } from '@react-navigation/native';

const AuthLoading = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Home'); // Nếu đã đăng nhập, chuyển đến Home
      } else {
        navigation.navigate('Login'); // Nếu chưa đăng nhập, chuyển đến Login
      }
    });

    return () => unsubscribe(); // Dọn dẹp
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AuthLoading;

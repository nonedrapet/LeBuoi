import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text, SafeAreaView, Alert } from 'react-native';
import { auth, db } from './firebaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { setDoc, doc } from "firebase/firestore";
import Loader from './LoadingAnimation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // State để kiểm tra loading
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Vui lòng điền email và mật khẩu!");
      return;
    }

    try {
      setLoading(true); // Bắt đầu loading
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user; // Lấy thông tin người dùng

      setErrorMessage(''); // Xóa thông báo lỗi khi đăng nhập thành công

      // Cập nhật lastLogin vào Firestore
      await setDoc(doc(db, "users", user.uid), {
        lastLogin: new Date(),
      }, { merge: true }); // Sử dụng { merge: true } để không ghi đè toàn bộ document

      navigation.navigate('Home'); // Chuyển hướng đến màn hình Home sau khi đăng nhập thành công
    } catch (error) {
      // Xử lý lỗi cụ thể từ Firebase
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setErrorMessage("Thông tin tài khoản không chính xác"); // Thông báo lỗi cụ thể
      } else {
        setErrorMessage("Đăng nhập không thành công, vui lòng thử lại!");
      }
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMessage("Vui lòng nhập email để đặt lại mật khẩu!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Đặt lại mật khẩu", "Kiểm tra email của bạn để đặt lại mật khẩu.");
    } catch (error) {
      setErrorMessage("Không thể gửi yêu cầu đặt lại mật khẩu, vui lòng thử lại!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <Loader />}
      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
        style={styles.input} 
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button title="Đăng nhập" onPress={handleLogin} color="#984063" />
      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupButton}>
        <Text style={styles.signupText}>Đăng ký ngay</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#41436A',
    padding: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  signupButton: {
    marginTop: 10,
  },
  signupText: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordText: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 10,
  },
});

export default Login;

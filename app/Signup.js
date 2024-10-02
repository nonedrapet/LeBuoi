import React, { useState } from 'react'; 
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { View, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Thêm confirmPassword
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const handleSignup = async () => {
    setErrorMessage('');

    if (!email || !password || !confirmPassword || !phone || !name) {
      setErrorMessage("Thông tin không được để trống!");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu không khớp!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      // Thêm role là "user" mặc định cho người dùng mới
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        phone: phone,
        name: name,
        role: "user", // Mặc định role là user
        createdAt: new Date(),
        lastLogin: new Date(),
      });

      Alert.alert("Đăng ký thành công!", "Vui lòng kiểm tra email để xác thực tài khoản.");
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      setErrorMessage("Đăng ký không thành công, vui lòng thử lại!");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Tên"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
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
      <TextInput
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        value={confirmPassword} // Trường nhập lại mật khẩu
        onChangeText={setConfirmPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <Button title="Đăng ký" onPress={handleSignup} color="#984063" />
      <TouchableOpacity
        onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}
        style={styles.loginButton}
      >
        <Text style={styles.loginText}>Đã có tài khoản? Đăng nhập ngay</Text>
      </TouchableOpacity>
    </View>
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
  loginButton: {
    marginTop: 10,
  },
  loginText: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#FF0000',
    marginBottom: 10,
  },
});

export default Signup;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { db } from './firebaseConfig'; // Import Firestore
import { addDoc, collection } from 'firebase/firestore';

const AddServiceScreen = ({ navigation, route }) => {
  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleAddService = async () => {
    if (!serviceName || !description || !price) {
      Alert.alert('Lỗi', 'Tất cả các trường đều phải được điền!');
      return;
    }

    try {
      await addDoc(collection(db, 'services'), {
        name: serviceName,
        description: description,
        price: parseFloat(price), // Chuyển đổi giá tiền thành số
        createdAt: new Date(),
        createdBy: route.params.userInfo.name || 'Admin',
      });

      Alert.alert('Thành công', 'Dịch vụ đã được thêm!');
      navigation.goBack(); // Quay lại màn hình trước đó
    } catch (error) {
      console.error("Error adding service: ", error);
      Alert.alert('Lỗi', 'Không thể thêm dịch vụ.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Thêm Dịch Vụ Mới</Text>
      <TextInput
        placeholder="Tên dịch vụ"
        value={serviceName}
        onChangeText={setServiceName}
        style={styles.input}
      />
      <TextInput
        placeholder="Mô tả"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Giá tiền"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric" // Để nhập số
        style={styles.input}
      />
      <Button title="Thêm Dịch Vụ" onPress={handleAddService} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
  },
});

export default AddServiceScreen;

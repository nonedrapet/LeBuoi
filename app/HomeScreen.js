import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Icon từ thư viện
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore'; // Import Firestore
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const Home = () => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }} 
      >
        {() => <HomeScreen userInfo={userInfo} />}
      </Tab.Screen>
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
};

const HomeScreen = ({ userInfo }) => {
  const [services, setServices] = useState([]); // Danh sách dịch vụ
  const [newService, setNewService] = useState(''); // Dịch vụ mới

  // Lấy danh sách dịch vụ từ Firestore
  const fetchServices = async () => {
    try {
      const servicesRef = collection(db, 'services');
      const querySnapshot = await getDocs(servicesRef);
      const servicesList = [];
      querySnapshot.forEach((doc) => {
        servicesList.push({ ...doc.data(), id: doc.id });
      });
      setServices(servicesList);
    } catch (error) {
      console.error("Error fetching services: ", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Thêm dịch vụ mới vào Firestore
  const handleAddService = async () => {
    if (!newService) {
      Alert.alert('Lỗi', 'Tên dịch vụ không được để trống!');
      return;
    }

    try {
      await addDoc(collection(db, 'services'), {
        name: newService,
        createdAt: new Date(),
        createdBy: userInfo.name || 'Admin',
      });

      // Làm mới danh sách dịch vụ sau khi thêm
      fetchServices();
      setNewService(''); // Xóa input sau khi thêm
      Alert.alert('Thành công', 'Dịch vụ đã được thêm!');
    } catch (error) {
      console.error("Error adding service: ", error);
      Alert.alert('Lỗi', 'Không thể thêm dịch vụ.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {userInfo.role === 'admin' ? 'Welcome Admin! You have full access.' : 'Welcome User!'}
      </Text>

      {/* Danh sách các dịch vụ */}
      <FlatList
        data={services}
        renderItem={({ item }) => <Text style={styles.serviceItem}>{item.name}</Text>}
        keyExtractor={(item) => item.id}
      />

      {/* Nút Thêm Dịch Vụ chỉ hiển thị nếu là admin */}
      {userInfo.role === 'admin' && (
        <>
          <TextInput
            placeholder="Nhập tên dịch vụ "
            value={newService}
            onChangeText={setNewService}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
            <Ionicons name="add-circle" size={50} color="#984063" />
          </TouchableOpacity>
        </>
      )}
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
    fontSize: 20,
    marginBottom: 20,
  },
  serviceItem: {
    fontSize: 18,
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
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

export default Home;

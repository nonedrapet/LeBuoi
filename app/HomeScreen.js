import React, { useEffect, useState } from 'react'; 
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
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
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [isAddingService, setIsAddingService] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null); // Thêm trạng thái để lưu id dịch vụ được chọn

  const fetchServices = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!newServiceName || !newServiceDescription || !newServicePrice) {
      Alert.alert('Lỗi', 'Tất cả các trường đều phải được điền!');
      return;
    }

    try {
      await addDoc(collection(db, 'services'), {
        name: newServiceName,
        description: newServiceDescription,
        price: parseFloat(newServicePrice),
        createdAt: new Date(),
        createdBy: userInfo.name || 'Admin',
      });

      fetchServices();
      setNewServiceName('');
      setNewServiceDescription('');
      setNewServicePrice('');
      setIsAddingService(false);
      Alert.alert('Thành công', 'Dịch vụ đã được thêm!');
    } catch (error) {
      console.error("Error adding service: ", error);
      Alert.alert('Lỗi', 'Không thể thêm dịch vụ.');
    }
  };

  const handleServiceClick = (service) => {
    Alert.alert(service.name, `Mô tả: ${service.description}\nGiá: ${service.price} VNĐ`);
    setSelectedServiceId(service.id); // Cập nhật id dịch vụ được chọn
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {userInfo.role === 'admin' ? 'Welcome Admin!' : 'Welcome User!'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#984063" />
      ) : (
        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={services}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleServiceClick(item)}
              style={[
                styles.serviceItemContainer,
                selectedServiceId === item.id ? styles.selectedServiceItem : null // Thay đổi màu sắc nếu được chọn
              ]}
            >
              <Text style={styles.serviceItemName}>{item.name}</Text>
              <Text style={styles.serviceItemDescription}>{item.description}</Text>
              <Text style={styles.serviceItemPrice}>Giá: {item.price} VNĐ</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {userInfo.role === 'admin' && (
        <View style={[styles.addServiceContainer, isAddingService ? styles.activeContainer : null]}>
          <TouchableOpacity style={styles.addButton} onPress={() => setIsAddingService(!isAddingService)}>
            <Ionicons name="add-circle" size={50} color="#e91e63" />
          </TouchableOpacity>

          {isAddingService && (
            <View style={styles.addServiceForm}>
              <TextInput
                placeholder="Tên dịch vụ"
                value={newServiceName}
                onChangeText={setNewServiceName}
                style={styles.input}
              />
              <TextInput
                placeholder="Mô tả dịch vụ"
                value={newServiceDescription}
                onChangeText={setNewServiceDescription}
                style={styles.input}
              />
              <TextInput
                placeholder="Giá dịch vụ"
                value={newServicePrice}
                onChangeText={setNewServicePrice}
                keyboardType="numeric"
                style={styles.input}
              />
              <TouchableOpacity onPress={handleAddService} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Xác Nhận Thêm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  headerText: {
    fontSize: 22,
    //marginTop:0,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  flatListContent: {
    paddingTop: 20,
    paddingBottom: 60,
  },
  serviceItemContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 5,
    marginLeft: 5,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  selectedServiceItem: {
    backgroundColor: '#ffe5e5', // Màu nền khi mục được chọn
  },
  serviceItemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2b2b2b',
  },
  serviceItemDescription: {
    fontSize: 16,
    color: '#555',
    marginVertical: 5,
  },
  serviceItemPrice: {
    fontSize: 18,
    color: '#e91e63',
    marginTop: 5,
  },
  addServiceContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  activeContainer: {
    backgroundColor: '#ffe5e5', // Màu nền khi thêm dịch vụ được kích hoạt
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    width: '100%',
  },
  addButton: {
    marginBottom: 0,
    alignSelf: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    marginTop: 5,
    fontSize: 16,
    color: '#e91e63',
    fontWeight: 'bold',
  },
  addServiceForm: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  input: {
    width: '100%',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#e91e63',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  separator: {
    height: 15,
    backgroundColor: 'transparent',
  },
});

export default Home;

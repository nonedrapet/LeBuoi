import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, TextInput, ScrollView, ImageBackground } from 'react-native';
import { auth, db } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const SettingsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserInfo(docSnap.data());
            setName(docSnap.data().name);
            setPhone(docSnap.data().phone);
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

  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất không?",
      [
        {
          text: "Hủy",
          onPress: () => console.log("Hủy đăng xuất"),
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await auth.signOut();
              Alert.alert("Đăng xuất thành công!");
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              Alert.alert("Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại!");
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleUserInfo = () => {
    setModalVisible(true);
  };

  const handleEditUserInfo = () => {
    setEditModalVisible(true);
  };

  const handleSaveUserInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        name: name,
        phone: phone,
      });
      setUserInfo({ ...userInfo, name: name, phone: phone });
      Alert.alert("Thông tin đã được cập nhật!");
      setEditModalVisible(false);
    }
  };

  // Các hàm xử lý cho các chức năng mới
  const handleFunction1 = () => {
    Alert.alert("Chức năng 1 đã được gọi");
  };

  const handleFunction2 = () => {
    Alert.alert("Chức năng 2 đã được gọi");
  };

  const handleFunction3 = () => {
    Alert.alert("Chức năng 3 đã được gọi");
  };

  const handleFunction4 = () => {
    Alert.alert("Chức năng 4 đã được gọi");
  };

  const handleFunction5 = () => {
    Alert.alert("Chức năng 5 đã được gọi");
  };

  return (
    <ImageBackground
      source={{ uri: 'https://th.bing.com/th/id/OIP.Fwz4bnaa6RAYZ_YZN9q3VwHaNK?rs=1&pid=ImgDetMain' }} 
      style={styles.background}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleUserInfo} style={styles.userInfoContainer}>
              <Text style={styles.userName}>{userInfo.name || 'Người dùng'}</Text>
              <Text style={styles.userEmail}>{userInfo.email}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.functionContainer}>
            <TouchableOpacity onPress={handleEditUserInfo} style={styles.button}>
              <Text style={styles.buttonText}>Chỉnh sửa thông tin</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout} style={styles.button}>
              <Text style={styles.buttonText}>Đăng xuất</Text>
            </TouchableOpacity>
            <View style={styles.separator} />

            {/* Các nút cho chức năng 1 đến 5 */}
            <TouchableOpacity onPress={handleFunction1} style={styles.button}>
              <Text style={styles.buttonText}>Chức năng 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFunction2} style={styles.button}>
              <Text style={styles.buttonText}>Chức năng 2</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFunction3} style={styles.button}>
              <Text style={styles.buttonText}>Chức năng 3</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFunction4} style={styles.button}>
              <Text style={styles.buttonText}>Chức năng 4</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleFunction5} style={styles.button}>
              <Text style={styles.buttonText}>Chức năng 5</Text>
            </TouchableOpacity>
          </View>

          {/* Modal hiển thị thông tin người dùng */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Thông Tin Người Dùng</Text>
              <Text>Email: {userInfo.email}</Text>
              <Text>Tên: {userInfo.name}</Text>
              <Text>Điện thoại: {userInfo.phone}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* Modal chỉnh sửa thông tin người dùng */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={editModalVisible}
            onRequestClose={() => setEditModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Chỉnh Sửa Thông Tin</Text>
              <TextInput 
                placeholder="Tên" 
                value={name} 
                onChangeText={setName} 
                style={styles.input} 
              />
              <TextInput 
                placeholder="Điện thoại" 
                value={phone} 
                onChangeText={setPhone} 
                style={styles.input} 
                keyboardType="phone-pad" 
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSaveUserInfo} style={styles.saveButton}>
                  <Text style={styles.texts}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.closeButton}>
                  <Text style={styles.texts}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
    texts:{
        color:'white',
    },
  background: {
    flex: 1,
    resizeMode: 'cover', // Để làm cho ảnh nền bao phủ toàn bộ màn hình
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.0)', // Để tạo hiệu ứng kính mờ
  },
  scrollContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#6aab9c',
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  functionContainer: {
    marginBottom: 20,
    width: '90%', // Đặt chiều rộng nhỏ hơn
    alignItems: 'center',
    padding: 10, // Thêm padding cho container
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Nền mờ
    borderRadius: 10, // Bo góc
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Màu nền trong suốt hơn
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',
    marginVertical: 5, // Thêm khoảng cách giữa các nút
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6aab9c',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#6aab9c',
    marginVertical: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    width: '100%',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  saveButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
});

export default SettingsScreen;

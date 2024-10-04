import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ServiceDetailScreen = ({ route }) => {
  const { service } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{service.name}</Text>
      <Text>Mô tả: {service.description}</Text>
      <Text>Giá: {service.price}</Text>
      <Text>Người tạo: {service.createdBy}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 10,
  },
});

export default ServiceDetailScreen;

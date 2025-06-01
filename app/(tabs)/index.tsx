import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const handleLogout = () => {
    setModalVisible(false);
    console.log('Выполнен выход');
    // Здесь можешь вызвать метод выхода или навигацию
    // Например: navigation.navigate('Login') 
  };
  return (
    <View>
      <Header/>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

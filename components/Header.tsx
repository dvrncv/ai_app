import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  GestureResponderEvent,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

type HeaderProps = {
  fontLoaded: boolean;
};
const Header: React.FC<HeaderProps> = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = (event: GestureResponderEvent) => {
    setModalVisible(false);
    console.log('Выполнен выход');
    router.replace('/LoginPage');

  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#67C5F9', '#2874D9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Image
            source={{
              uri: 'https://img.icons8.com/emoji/48/000000/sun-behind-cloud.png',
            }}
            style={styles.icon}
          />
          <Text style={styles.text}>ClothesWeather</Text>
        </View>
      
        <Pressable style={styles.logoutButton} onPress={() => setModalVisible(true)}>
          <MaterialIcons name="logout" size={28} color="white" />
        </Pressable>
      </LinearGradient>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>Вы действительно хотите выйти?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={styles.modalButton} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Да</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Нет</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
  container: {
    height:100,
  },
  gradient: {
    position: 'relative',    
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logoContainer: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -0.5 * 140 }, { translateY: 20 },], 
    flexDirection: 'row',
    alignItems: 'center',
    width: 200, 
    justifyContent: 'center',
  },
  logoutButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -14 }, { translateY: 20 },], 
  },
  icon: {
    width: 28,
    height: 28,
    
  },
  text: {
    color: 'white',
    fontSize: 20,
    flex: 1,
    fontFamily: 'Lora-Bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Lora-Bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2874D9',
    borderRadius: 8,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Lora-Bold',
  },
});  
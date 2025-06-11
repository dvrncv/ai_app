import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Entypo} from '@expo/vector-icons';
import { useDispatch} from 'react-redux';
import { login} from '../redux/slices/auth'; 
import { AppDispatch } from '../redux/store'; 



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');  
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await dispatch(login({login: email, password })).unwrap();
      console.log('Успешный вход');
      router.replace('/(tabs)'); 
    } catch (error) {
      console.error('Ошибка входа:', error);
      alert('Неверный email или пароль');
    }
  };

  return (
    <View style={styles.container}>

      <LinearGradient
        colors={['#5DB5F3', '#2E70C9']}
        style={styles.header}
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
      
      </LinearGradient>

      <View style={styles.loginBox}>
        <View style={styles.tabs}>
          <Text style={[styles.tab, styles.activeTab]}
            onPress={() => router.replace('/LoginPage')}
          >Вход</Text>
          <Text style={styles.tab}
          onPress={() => router.replace('/RegistrationPage')}>Регистрация</Text>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={styles.input} 
            placeholder="Введите email" 
            value={email}
            onChangeText={setEmail}
          />
          <FontAwesome name="envelope-o" size={20} color="#2E70C9" />
        </View>

        <Text style={styles.label}>Пароль</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Введите пароль"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Entypo name={showPassword ? "eye-with-line" : "eye"} size={20} color="#2E70C9" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}  onPress={handleLogin}>Войти</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 200,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    paddingTop:80,
    flexDirection: 'row',
    alignItems: 'center',
    width: 200, 
    justifyContent: 'center',
  },
  icon: {
    width: 32,
    height: 32,
    
  },
  text: {
    color: 'white',
    fontSize: 20,
    flex: 1,
    fontFamily: 'Lora-Bold',
  },
  logo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  loginBox: {
    marginTop: 50,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 5,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    fontSize: 18,
    color: '#aaa',
    fontFamily: 'Lora-Bold',
  },
  activeTab: {
    color: '#2E70C9',
    fontFamily: 'Lora-Bold',
    textDecorationLine: 'underline',
  },
  label: {
    marginBottom: 5,
    color: '#333',
    fontFamily: 'Lora-Bold',
  },
  inputRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Lora-Bold',
  },
  forgot: {
    color: '#2E70C9',
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2E70C9',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Lora-Bold',
  },
});

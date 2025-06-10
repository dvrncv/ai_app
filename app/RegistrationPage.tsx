import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { signup } from '../redux/slices/auth'; 
import type { AppDispatch } from '../redux/store';



export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [login, setLogin] = useState('');

const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (!login || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    setError('');
    try {
      const response = await dispatch(signup({ login, password })).unwrap();
    if (response && response.token) {
      router.replace('/(tabs)');
    } else {
      setError('Токен не получен, попробуйте войти снова');
    }
  } catch (err: any) {
    setError(err.message || 'Ошибка регистрации');
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
          <Text style={styles.tab}
            onPress={() => router.replace('/LoginPage')}
          >Вход</Text>
          <Text style={[styles.tab, styles.activeTab]}
          onPress={() => router.replace('/RegistrationPage')}>Регистрация</Text>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputRow}>
          <TextInput 
            style={styles.input} 
            placeholder="Введите email" 
            value={login}
            onChangeText={setLogin}
          />
          <FontAwesome name="envelope-o" size={20} color="#2E70C9" />
        </View>

        <Text style={styles.label}>Пароль</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Введите пароль"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Entypo name={showPassword ? "eye-with-line" : "eye"} size={20} color="#2E70C9" />
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Подтвердите пароль</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Введите пароль"
            secureTextEntry={!showPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Entypo name={showPassword ? "eye-with-line" : "eye"} size={20} color="#2E70C9" />
          </TouchableOpacity>
        </View>
        {error !== '' && (
            <Text style={styles.errorText}>{error}</Text>
        )}

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}  onPress={handleSignup}>Зарегистрироваться</Text>
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
    fontFamily: 'Lora-Bold',
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
  errorText: {
  color: 'red',
  marginTop: 5,
  marginBottom:5,
  fontFamily: 'Lora-Bold',
}
});

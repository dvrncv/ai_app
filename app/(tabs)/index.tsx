import Header from '@/components/Header';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {

  const [modalVisible, setModalVisible] = useState(false);
  const handleLogout = () => {
    setModalVisible(false);
    console.log('Выполнен выход');
  
  };
  const [temperature, setTemperature] = useState('27 °C');
    const [clothingRecommendation, setClothingRecommendation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
  
    const getClothingRecommendation = async () => {
      setLoading(true);
      setError('');
      try {
        setTimeout(() => {
          setClothingRecommendation('Рекомендуем легкую одежду: футболка, шорты и сандалии.');
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Не удалось получить рекомендацию');
        setLoading(false);
      }
    };
  
    const getLocationAndWeather = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Доступ к местоположению запрещен');
        return;
      }
  
      try {
        let location = await Location.getCurrentPositionAsync({});
      } catch (err) {
        setError('Не удалось получить местоположение');
      }
    };
  
    useEffect(() => {
      getLocationAndWeather();
    }, []);
  
    const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      <View>
        <Header />
      </View>
      <View style={styles.container}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/')}
           >
              <Text style={styles.buttonText}>Моя галерея</Text>
            </TouchableOpacity>
      
            <TouchableOpacity 
              style={styles.button}
              onPress={getClothingRecommendation}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Получить предложение</Text>
            </TouchableOpacity>
      
            {loading && <ActivityIndicator size="large" color="#4A90E2" />}
            
            <Text style={styles.temperatureText}>{temperature}</Text>

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.recommendationText}>{clothingRecommendation}</Text>
            )}
      
            
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 16,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#4182C2', 
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20, 
    fontFamily: 'Lora-Bold', 
  },
  temperatureText: {
    fontSize: 48,
    color: '#333',
    marginTop: 30,
    fontFamily: 'Lora-Bold', 
  },
  recommendationText: {
    fontSize: 20, 
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    fontFamily: 'Lora-Bold', 
  },
  errorText: {
    fontSize: 20, 
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'Lora-Bold',
  },
});

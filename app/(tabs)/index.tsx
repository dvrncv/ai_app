import Header from '@/components/Header';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image
} from 'react-native';


export default function HomeScreen() {

  const [modalVisible, setModalVisible] = useState(false);
  const handleLogout = () => {
    setModalVisible(false);
    console.log('Выполнен выход');
  };
    const [temperature, setTemperature] = useState('');
    const [clothingRecommendation, setClothingRecommendation] = useState('');
    const [weatherDescription, setWeatherDescription ] = useState('');
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

    
      const router = useRouter();

    const weatherIcons = {
      Clear: require('../../assets/weatherImages/Clear.png'),
      Clouds: require('../../assets/weatherImages/Clouds.png'),
      Rain: require('../../assets/weatherImages/Rain.png'),
      Snow: require('../../assets/weatherImages/Snow.png'),
      Thunderstorm: require('../../assets/weatherImages/Thunderstorm.png'),
      Drizzle: require('../../assets/weatherImages/Drizzle.png'),
      Mist: require('../../assets/weatherImages/Fog.png'),
      Haze: require('../../assets/weatherImages/Fog.png'),
      Fog: require('../../assets/weatherImages/Fog.png'),
      Default: require('../../assets/weatherImages/Default.png'),
    };

    const getWeatherIcon = (condition: string) => {
      return weatherIcons[condition] || weatherIcons['Default'];
    };

    const [weatherCondition, setWeatherCondition] = useState<string>('Default');
    useEffect(() => {
      const fetchWeather = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Доступ к местоположению запрещен');
          return;
        }

        try {
          const location = await Location.getCurrentPositionAsync({});
          const { latitude, longitude } = location.coords;
          const apiKey = '648aa41bd49fa2e04d6f3e02c510567d';

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${apiKey}`
          );
          const data = await response.json();
          console.log('OpenWeather response:', data);
          setError('');

          const temp = Math.round(data.main.temp);
          const condition = data.weather[0].main;

          setTemperature(`${temp} °C`);
          setWeatherCondition(condition);
          setWeatherDescription(`Сейчас ${data.weather[0].description}.`);
        } catch (err) {
          setError('Ошибка загрузки погоды');
        }
      };

      fetchWeather();

      const interval = setInterval(fetchWeather, 10 * 60 * 1000);

      return () => clearInterval(interval); 
    }, []);


  return (
    <View style={styles.mainContainer}>
      <View>
        <Header />
      </View>
      <View style={styles.container}>
            {weatherCondition && (
              <View style={styles.weatherContainer}>
                  <View style={styles.weatherIconRow}>
                    <Image
                      source={getWeatherIcon(weatherCondition)}
                      style={{ width: 100, height: 100, marginRight: 10 }}
                      resizeMode="contain"
                    />
                    <Text style={styles.weatherTextSize}>{temperature}</Text>
                  </View>
                  <Text style={styles.weatherText}>{weatherDescription}</Text>
                </View>
            )}
            {/* <TouchableOpacity 
              style={styles.button}
              onPress={() => router.push('/')}
           >
              <Text style={styles.buttonText}>Моя галерея</Text>
            </TouchableOpacity> */}
      
            <TouchableOpacity 
              style={styles.button}
              onPress={getClothingRecommendation}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Что надеть сейчас</Text>
            </TouchableOpacity>
            
            {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.recommendationText}>{clothingRecommendation}</Text>
            )}
      

            <TouchableOpacity 
              style={styles.button}
              onPress={getClothingRecommendation}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Рекомендация на день</Text>
            </TouchableOpacity>
                        {loading && <ActivityIndicator size="large" color="#4A90E2" />}
      
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
  weatherText: {
    fontSize: 20, 
    color: '#4182C2',
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
  weatherIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    gap:10,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherTextSize: {
    fontSize: 30, 
    color: '#4182C2',
    
  },
});

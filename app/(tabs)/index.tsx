import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendations, fetchRecommendationsTrue } from '@/redux/slices/wardrobeSlice';
import Header from '../../components/Header';



interface WardrobeItem {
  id: number;
  name: string;
  link: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { 
    currentRecommendations, 
    dailyRecommendations, 
    loadingRecommendations 
  } = useSelector((state: any) => state.wardrobe);

  const [modalVisible, setModalVisible] = useState(false);
  const [temperature, setTemperature] = useState('');
  const [weatherDescription, setWeatherDescription] = useState('');
  const [weatherCondition, setWeatherCondition] = useState('Default');
  const [error, setError] = useState('');

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

  const handleLogout = () => {
    setModalVisible(false);
    console.log('Выполнен выход');
  };

  const getWeatherData = async () => {
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
      
      const temp = Math.round(data.main.temp);
      const condition = data.weather[0].main;

      setTemperature(`${temp} °C`);
      setWeatherCondition(condition);
      setWeatherDescription(`Сейчас ${data.weather[0].description}.`);
      setError('');
      return { latitude, longitude };
    } catch (err) {
      setError('Ошибка загрузки погоды');
      return null;
    }
  };

  const getClothingRecommendation = async () => {
    setError('');
    try {
      const coords = await getWeatherData();
      if (coords) {
        dispatch(fetchRecommendations({
          lat: coords.latitude,
          lon: coords.longitude,
          forecast: false
        }) as any);
      }
    } catch (err) {
      setError('Не удалось получить рекомендацию');
    }
  };

  const getDailyRecommendation = async () => {
    setError('');
    try {
      const coords = await getWeatherData();
      if (coords) {
        dispatch(fetchRecommendations({
          lat: coords.latitude,
          lon: coords.longitude,
          forecast: true
        }) as any);
      }
    } catch (err) {
      setError('Не удалось получить дневную рекомендацию');
    }
  };


  useEffect(() => {
    getWeatherData();
    const interval = setInterval(getWeatherData, 10 * 60 * 1000);
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

        <TouchableOpacity 
          style={styles.button}
          onPress={getClothingRecommendation}
          disabled={loadingRecommendations}
        >
          <Text style={styles.buttonText}>Что надеть сейчас</Text>
        </TouchableOpacity>
        {loadingRecommendations ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : currentRecommendations?.length > 0 ? (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationText}>Рекомендуем сейчас:</Text>
            <FlatList
              horizontal
              data={currentRecommendations}
              keyExtractor={(item, index) => item?.name + index}
              renderItem={({ item }) => {
                const uri = encodeURI(item.link); 
                return (
                  <View style={styles.recommendationItem}>
                    <Image
                      source={{ uri }}
                      style={styles.recommendationImage}
                      resizeMode="cover"
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)} 
                    />
                    <Text style={styles.recommendationItemText}>
                      {item.name || 'Без названия'}
                    </Text>
                  </View>
                );
              }}
              ListEmptyComponent={<Text style={styles.emptyText}>Нет рекомендаций</Text>}
            />
          </View>
        ) : null}

        <TouchableOpacity 
          style={styles.button}
          onPress={getDailyRecommendation}
          disabled={loadingRecommendations}
        >
          <Text style={styles.buttonText}>Рекомендация на день</Text>
        </TouchableOpacity>

        {loadingRecommendations ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : dailyRecommendations?.length > 0 ? (
          <View style={styles.recommendationsContainer}>
            <Text style={styles.recommendationText}>Рекомендуем на день:</Text>
            <FlatList
              horizontal
              data={dailyRecommendations}
              keyExtractor={(item, index) => item?.name + index}
              renderItem={({ item }) => {
                const uri = encodeURI(item.link);
                return (
                  <View style={styles.recommendationItem}>
                    <Image
                      source={{ uri }}
                      style={styles.recommendationImage}
                      resizeMode="cover"
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)} 
                    />
                    <Text style={styles.recommendationItemText}>
                      {item.name || 'Без названия'}
                    </Text>
                  </View>
                );
              }}
              ListEmptyComponent={<Text style={styles.emptyText}>Нет рекомендаций</Text>}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  weatherContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherTextSize: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weatherText: {
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
  recommendationText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  recommendationItem: {
    margin: 10,
    alignItems: 'center',
    width: 120,
  },
  recommendationImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  recommendationItemText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  recommendationsContainer: {
    width: '100%',
    marginTop: 15,
  },
  imagePlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 10,
  },
  listContent: {
  paddingHorizontal: 10,
},

});

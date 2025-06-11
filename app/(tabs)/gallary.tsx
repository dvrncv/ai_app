import Header from '@/components/Header';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchWardrobeItems, uploadFile } from '@/redux/slices/wardrobeSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';




type GalleryItem = {
  id: number;
  image: {
    uri: string;
  };
};

export default function GalleryScreen() {
  const dispatch = useAppDispatch();
  const { items, loadingItems, errorItems, loadingUpload } = useAppSelector(state => state.wardrobe);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [pickPhotoModal, setPickPhotoModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  

  useEffect(() => {
    dispatch(fetchWardrobeItems());
  }, [dispatch]);

  useEffect(() => {
    if (errorItems) {
      Alert.alert('Ошибка', errorItems);
    }
  }, [errorItems]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Нужно разрешение для доступа к галерее!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      await handleImageUpload(result.assets[0].uri);
    }
    setPhotoModal(false); 
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Нужно разрешение для доступа к камере!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      await handleImageUpload(result.assets[0].uri);
    }
    setPhotoModal(false);
  };

const handleImageUpload = async (uri: string) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: uri.startsWith('file://') ? uri : `file://${uri}`,
      type: 'image/jpeg',
      name: `photo_${Date.now()}.jpg`,
    } as any);

    await dispatch(uploadFile(formData)).unwrap();
    dispatch(fetchWardrobeItems());
  } catch (error) {
    Alert.alert('Ошибка загрузки', 'Не удалось загрузить изображение');
  }
};

  const showActionModal = () => {
    setPhotoModal(true);
  };

  return (
    <View style={styles.mainContainer}>
      <Header />

      <Modal visible={pickPhotoModal} transparent={true}>
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPickPhotoModal(false)}
          />
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullscreenImage}
          />
        </View>
      </Modal>

      <Modal visible={photoModal} transparent={true} animationType="slide">
        <View style={styles.photoModalContainer}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPhotoModal(false)}
          />
          <View style={styles.photoModalContent}>
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={takePhoto}
              disabled={loadingUpload}
            >
              <MaterialCommunityIcons name="camera" size={24} color="#4182C2" />
              <Text style={styles.photoButtonText}>
                {loadingUpload ? 'Загрузка...' : 'Сделать фото'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.photoButton} 
              onPress={pickImage}
              disabled={loadingUpload}
            >
              <MaterialCommunityIcons name="image" size={24} color="#4182C2" />
              <Text style={styles.photoButtonText}>
                {loadingUpload ? 'Загрузка...' : 'Выбрать из галереи'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setPhotoModal(false)}
            >
              <Text style={styles.cancelButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.uploadBox}>
          <MaterialCommunityIcons 
            name="cloud-upload-outline" 
            size={100} 
            color="#4182C2" 
            style={styles.uploadIcon} 
          />
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={showActionModal}
            disabled={loadingUpload}
          >
            <Text style={styles.uploadButtonText}>
              {loadingUpload ? 'Загрузка...' : 'Загрузить фотографию'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {loadingItems ? (
          <View style={styles.loadingContainer}>
            <Text>Загрузка галереи...</Text>
          </View>
        ) : (
          <View style={styles.galleryGrid}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.galleryItem}
                onPress={() => {
                  setSelectedImage(item.link);
                  setPickPhotoModal(true);
                }}
              >
                <Image
                  source={{ uri: item.link }}
                  style={styles.galleryImage}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  uploadBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#4182C2',
    borderRadius: 10,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  uploadIcon: {
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#4182C2',
    padding: 10,
    borderRadius: 5,
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
  },
  photoModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  photoModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  photoButtonText: {
    marginLeft: 15,
    fontSize: 16,
  },
  cancelButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import React, { useState } from 'react';
import Header from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Pressable } from 'react-native';



export default function GalleryScreen() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [galleryItems, setGalleryItems] = useState([
    { id: 1, image: require('@/assets/images/outfit.png') },
    { id: 2, image: require('@/assets/images/outfit.png') },
    { id: 3, image: require('@/assets/images/outfit.png') },
    { id: 4, image: require('@/assets/images/outfit.png') },
  ]);
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
      const newImage = { id: Date.now(), image: { uri: result.assets[0].uri } };
      setGalleryItems((prevItems) => [...prevItems, newImage]);
    }
  };

  
  return (
    <View style={styles.mainContainer}>
      <Header />
          <Modal visible={modalVisible} transparent={true}>
            <View style={styles.modalContainer}>
              <Pressable
                style={styles.modalBackdrop}
                onPress={() => setModalVisible(false)}
              />
              <Image
                source={
                  typeof selectedImage === 'number'
                    ? selectedImage
                    : { uri: selectedImage?.uri }
                }
                style={styles.fullscreenImage}
              />
            </View>
          </Modal>
          
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.uploadBox}>
        <MaterialCommunityIcons name="cloud-upload-outline" size={100} color="#4182C2" style={styles.uploadIcon} />
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
          <Text style={styles.uploadButtonText}>Загрузить фотографию</Text>
        </TouchableOpacity>
      </View>
        <Text style={styles.galleryTitle}>Моя галерея</Text>
        <View style={styles.galleryGrid}>
          {galleryItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.galleryItem}
              onPress={() => {
                setSelectedImage(item.image);
                setModalVisible(true);
              }}
            >
                <Image
                  source={typeof item.image === 'number' ? item.image : { uri: item.image.uri }}
                  style={styles.galleryImage}
                />
              </TouchableOpacity>
          ))}
        </View>
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
    padding: 20,
    paddingTop: 10,
  },
  uploadContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  uploadBox: {
    backgroundColor: '#E8F1FB',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#4182C2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  uploadIcon: {
    marginBottom: 16,
  },
  uploadIconText: {
    color: 'white',
    fontSize: 20,
    lineHeight: 20,
    fontFamily: 'Lora-Bold',
  },
  uploadButtonText: {
  color: 'white',
  fontSize: 20,
  fontFamily: 'Lora-Bold',
  },
  galleryTitle: {
  fontSize: 20,
  marginBottom: 15,
  color: '#4182C2',
  fontFamily: 'Lora-Bold',
  borderWidth: 4,              
  borderColor: '#4182C2',      
  padding: 8,                 
  borderRadius: 8,             
  textAlign: 'center',         
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  justifyContent: 'center',
  alignItems: 'center',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  fullscreenImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 12,
    zIndex: 10,
  },
});
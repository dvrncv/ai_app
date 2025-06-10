import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";
import { STATUS } from "../../constant";
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface WardrobeItem {
    id: number;
    name: string;
    link: string; 
}
export interface Params {
    lat: number;
    lon: number;
} 

interface WardrobeState {
    items: WardrobeItem[];
    recommendations: WardrobeItem[];
    loadingItems: boolean;
    loadingRecommendations: boolean;
    loadingUpload: boolean;
} 
export const uploadFile = createAsyncThunk<{ link: string; name: string }, File>(
    'wardrobe/upload',
    async (file, thunkAPI) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
        const response = await axios.post('/wardrobe/upload', formData);
        return response.data;
        } catch (error: any) {
        console.log('Ошибка загрузки:', error.response?.data);
        return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const fetchWardrobeItems = createAsyncThunk<WardrobeItem[]>(
    'wardrobe',
    async (_, thunkAPI) => {
    try {
        const response = await axios.get<WardrobeItem[]>('/wardrobe');
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
    }
); 
export const fetchRecommendations = createAsyncThunk<WardrobeItem[], Params >(
    'wardrobe/recommend',
    async (coords, thunkAPI) => {
    const { lat, lon } = coords;
    try {
        const response = await axios.get<WardrobeItem[]>(
        `/wardrobe/recommend?lat=${lat}&lon=${lon}`
        );
        return response.data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
    }
); 

const initialState: WardrobeState = {
    items: [],
    recommendations: [],
    loadingItems: false,
    loadingRecommendations: false,
    loadingUpload: false
}; 
const wardrobeSlice = createSlice({
    name: 'wardrobe',
    initialState,
    reducers: {    
    },
    extraReducers: (builder) => {
        builder
        .addCase(uploadFile.pending, (state) => {
        state.loadingUpload = true;
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.loadingUpload = false;
            state.items.push({
                id: Date.now(),
                name: action.payload.name,
                link: action.payload.link,
            });
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.loadingUpload = false;
        })
        .addCase(fetchWardrobeItems.pending, (state) => {
            state.loadingItems = true;
        })
        .addCase(fetchWardrobeItems.fulfilled, (state, action) => {
            state.loadingItems = false;
            state.items = action.payload;
        })
        .addCase(fetchWardrobeItems.rejected, (state, action) => {
            state.loadingItems = false;
        })
        .addCase(fetchRecommendations.pending, (state) => {
            state.loadingRecommendations = true;
        })
        .addCase(fetchRecommendations.fulfilled, (state, action) => {
            state.loadingRecommendations = false;
            state.recommendations = action.payload;
        })
        .addCase(fetchRecommendations.rejected, (state, action) => {
            state.loadingRecommendations = false;
        });
    },
});
export const wardrobeReducer = wardrobeSlice.reducer;

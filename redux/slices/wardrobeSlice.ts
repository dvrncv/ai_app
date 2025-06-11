import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../axiosInstance";

export interface WardrobeItem {
    id: number;
    name: string;
    link: string; 
}
export interface Params {
    lat: number;
    lon: number;
    forecast: boolean;
} 

interface WardrobeState {
    items: WardrobeItem[];
    currentRecommendations: WardrobeItem[]; 
    dailyRecommendations: WardrobeItem[];
    loadingItems: boolean;
    loadingRecommendations: boolean;
    loadingUpload: boolean;
} 
export const uploadFile = createAsyncThunk<{ link: string; name: string }, FormData>(
    'wardrobe/upload',
    async (formData, thunkAPI) => {
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
    export const fetchRecommendations = createAsyncThunk<{ items: WardrobeItem[]; forecast: boolean },Params>(
        "wardrobe/recommend",
        async (params, thunkAPI) => {
            try {
            const response = await axios.get<WardrobeItem[]>(
                `/wardrobe/recommend?lat=${params.lat}&lon=${params.lon}&forecast=${params.forecast}`
            );
            return {
                items: response.data,
                forecast: params.forecast,
            };
            } catch (err: any) {
            return thunkAPI.rejectWithValue(err.message);
            }
        }
    );
   

const initialState: WardrobeState = {
    items: [],
    currentRecommendations: [],
    dailyRecommendations: [],
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
            if (action.payload.forecast) {
            state.dailyRecommendations = action.payload.items;
            } else {
            state.currentRecommendations = action.payload.items;
            }
        })
        .addCase(fetchRecommendations.rejected, (state) => {
            state.loadingRecommendations = false;
        });
    },
});
export const wardrobeReducer = wardrobeSlice.reducer;

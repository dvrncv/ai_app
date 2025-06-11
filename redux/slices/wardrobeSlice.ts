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

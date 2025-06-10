import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";
import { STATUS } from "../../constant";

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
    errorItems: string | null;
    errorRecommendations: string | null;
    errorUpload: string | null;
} 
export const uploadFile = createAsyncThunk<{ link: string; name: string },File >(
    'wardrobe/upload',
    async (file, thunkAPI) => {
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await axios.post<{ link: string; name: string }>(
            '/api/v1/wardrobe/upload',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            return response.data;
        } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
        }
    }
); 

export const fetchWardrobeItems = createAsyncThunk<WardrobeItem[]>(
    'wardrobe',
    async (_, thunkAPI) => {
    try {
        const response = await axios.get<WardrobeItem[]>('/api/v1/wardrobe');
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
        `/api/v1/wardrobe/recommend?lat=${lat}&lon=${lon}`
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
    loadingUpload: false,
    errorItems: null,
    errorRecommendations: null,
    errorUpload: null,
}; 
const wardrobeSlice = createSlice({
    name: 'wardrobe',
    initialState,
    reducers: {
        clearErrors(state) {
        state.errorItems = null;
        state.errorRecommendations = null;
        state.errorUpload = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(uploadFile.pending, (state) => {
        state.loadingUpload = true;
        state.errorUpload = null;
        })
        .addCase(uploadFile.fulfilled, (state, action) => {
            state.loadingUpload = false;
            state.errorUpload = null;
            state.items.push({
                id: Date.now(),
                name: action.payload.name,
                link: action.payload.link,
            });
        })
        .addCase(uploadFile.rejected, (state, action) => {
            state.loadingUpload = false;
            state.errorUpload = action.payload as string;
        })
        .addCase(fetchWardrobeItems.pending, (state) => {
            state.loadingItems = true;
            state.errorItems = null;
        })
        .addCase(fetchWardrobeItems.fulfilled, (state, action) => {
            state.loadingItems = false;
            state.items = action.payload;
        })
        .addCase(fetchWardrobeItems.rejected, (state, action) => {
            state.loadingItems = false;
            state.errorItems = action.payload as string;
        })
        .addCase(fetchRecommendations.pending, (state) => {
            state.loadingRecommendations = true;
            state.errorRecommendations = null;
        })
        .addCase(fetchRecommendations.fulfilled, (state, action) => {
            state.loadingRecommendations = false;
            state.recommendations = action.payload;
        })
        .addCase(fetchRecommendations.rejected, (state, action) => {
            state.loadingRecommendations = false;
            state.errorRecommendations = action.payload as string;
        });
    },
});
export const { clearErrors } = wardrobeSlice.actions;
export const wardrobeReducer = wardrobeSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STATUS } from "../../constant";

interface AuthParams {
  login: string;
  password: string;
}

export const login = createAsyncThunk(
  "auth/login",
  async (params: AuthParams) => {
    const response = await axios.post(
      `/auth/authenticate?login=${params.login}&password=${params.password}`
    );
    try {
      AsyncStorage.setItem("token", response.data.token);
      console.log("token", AsyncStorage.getItem("token"));
      
    } catch (error) {
        console.log(error);
    }
    return response.data;
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (params: AuthParams) => {
    const response = await axios.post("/auth/register", params);
    return response.data;
  }
);
interface AuthState {
  data: any;
  status: string;
}

const initialState: AuthState = {
  data: null,
  status: STATUS.PENDING,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      AsyncStorage.removeItem("token");
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.data = null;
        state.status = STATUS.PENDING;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUS.FULFILLED;
      })
      .addCase(login.rejected, (state) => {
        state.data = null;
        state.status = STATUS.REJECTED;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = STATUS.FULFILLED;
      });
  },
});

export const { logout } = authSlice.actions;
export const authReducer = authSlice.reducer;
export const selectIsAuth = (state: any) => Boolean(state.auth.data);
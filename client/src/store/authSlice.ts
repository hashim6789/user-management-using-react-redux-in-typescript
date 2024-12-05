import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";

const hostname = import.meta.env.HOST_NAME;

interface User {
  username: string;
  email: string;
  password: string;
  profileImage: string;
  id: string;
}

interface Admin {
  // adminname: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: Omit<User, "password"> | null;
  token: string | null;
  adminAuthenticated: boolean;
  admin: Admin | null;
  adminToken: string | null;
  error: string | null;
  loading: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const loadFromLocalStorage = (key: string): any => {
  const itemStr = localStorage.getItem(key);
  if (itemStr) {
    try {
      return JSON.parse(itemStr);
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage:`, error);
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  user: loadFromLocalStorage("currentUser"),
  token: localStorage.getItem("authToken") || null,
  adminAuthenticated: !!localStorage.getItem("adminAuthToken"),
  admin: loadFromLocalStorage("currentAdmin"),
  adminToken: localStorage.getItem("adminAuthToken") || null,
  loading: false,
  error: null,
  status: "idle",
};

// Thunk for admin login
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials: Omit<User, "username">, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/admin/login",
        credentials
      );
      return response.data; // API should return { admin, token }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Admin login failed!!!"
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signup",
  async (credentials: Omit<User, "profileImage">, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/auth/register`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Sign up failed!!!"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: Omit<User, "username" | "profileImage">,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        credentials
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed!!!"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    { userId, profileImage }: { userId: string; profileImage: File },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();
      formData.append("profileImage", profileImage);

      const response = await axios.put(
        `http://localhost:3000/api/user/${userId}/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.adminToken = null;
      state.adminAuthenticated = false;
      localStorage.removeItem("adminAuthToken");
      localStorage.removeItem("currentAdmin");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(action.payload.user)
        );
      })
      .addCase(signupUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        localStorage.setItem("authToken", action.payload.token);
        localStorage.setItem(
          "currentUser",
          JSON.stringify(action.payload.user)
        );
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.admin = action.payload.admin;
        state.adminAuthenticated = true;
        state.adminToken = action.payload.token;
        localStorage.setItem("adminAuthToken", action.payload.token);
        localStorage.setItem(
          "currentAdmin",
          JSON.stringify(action.payload.admin)
        );
      })
      .addCase(loginAdmin.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProfile.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError, logout, logoutAdmin } = authSlice.actions;

export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
};

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false
};

//Register
export const signUpUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password }: { email: string; password: string; }, { rejectWithValue })  => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) return rejectWithValue(error.message);
    return { message: `Welcome ${data.user?.email}`, user: data.user };
  }
);
//Login
export const signInUser = createAsyncThunk(
  "auth/signin",
  async ({ email, password }: { email: string; password: string; }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return rejectWithValue(error.message);
    return { message: `Welcome back ${data.user?.email}`, user: data.user };
  }
)
//Logout
export const signOutUser = createAsyncThunk(
  "auth/signout",
  async () => {
    await supabase.auth.signOut();
  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.initialized = true;
    }
  },
  extraReducers: builder => {
    builder
      //Register
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        console.log(action.payload.message);
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Login
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        console.log(action.payload.message);
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Logout
      .addCase(signOutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        console.log("User signed out successfully");
      })
      .addCase(signOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      });
  }
});

export const { setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;


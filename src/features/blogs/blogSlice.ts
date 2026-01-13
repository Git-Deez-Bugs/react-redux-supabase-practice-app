import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export type Blog = {
  blog_id: string;
  blog_title: string;
  blog_content: string;
  blog_author_id: string;
  blog_author_email: string | null;
  blog_created_at: string;
};

type BlogState = {
  blogs: Blog[];
  loading: boolean;
  error: string | null;
};

const initialState: BlogState = {
  blogs: [],
  loading: false,
  error: null
};

//Create
export const createBlog = createAsyncThunk(
  "blogs/create",
  async ({ title, content }: { title: string; content: string }, { rejectWithValue }) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return rejectWithValue("Unauthorized User");
    
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        blog_title: title,
        blog_content: content,
        blog_author_id: user.data.user?.id
      });
    
    if (error) return rejectWithValue(error.message);
    return { message: "New blog created successfully", data };
  }
);
//Read All
export const readBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async ({ page, pageSize }: { page: number; pageSize: number }, { rejectWithValue }) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("blogs")
      .select("*, users(user_email)", { count: "exact" })
      .range(from, to)
      .order("blog_created_at", { ascending: false});

    if (error) return rejectWithValue(error.message);

    const blogsWithEmails = data?.map(blog => ({
      ...blog,
      blog_author_email: blog.users?.user_email,
      users: undefined
    }));

    return { data: blogsWithEmails, count };
  }
);
//Read One
export const readBlog = createAsyncThunk(
  "blogs/fetchBlogById",
  async ({ id }: { id: number }, { rejectWithValue}) => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("blog_id", id);
    
    if (error) return rejectWithValue(error.message);
    return data?.[0] ?? rejectWithValue("Blog not found");
  }
);
//Update
export const updateBlog = createAsyncThunk(
  "blogs/update",
  async ({ id, title, content }: { id: number; title: string; content: string }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("blogs")
      .update({
        blog_title: title,
        blog_content: content
      })
      .eq("blog_id", id);

    if (error) return rejectWithValue(error.message);
    if (!data) return rejectWithValue("Blog not found");

    return { message: `Blog ${id} was updated successfully`, data };
  }
);
//Delete
export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("blog_id", id);

    if (error) return rejectWithValue(error.message);
    return { message: `Blog ${id} was deleted successfully` };
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Create
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Read All
      .addCase(readBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data;
        console.log(action.payload.data)
      })
      .addCase(readBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Read One
      .addCase(readBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload;
        console.log(action.payload)
      })
      .addCase(readBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Update
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Delete
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      });
  }
});

export const blogsReducer = blogSlice.reducer;
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export type Blog = {
  blog_id: string;
  blog_title: string;
  blog_content: string;
  blog_author_id: string;
  blog_author_email: string | null;
  blog_image_path: string | null;
  blog_created_at: string;
};

type BlogState = {
  blogs: Blog[];
  blog: Blog | null;
  loading: boolean;
  error: string | null;
};

const initialState: BlogState = {
  blogs: [],
  blog: null,
  loading: false,
  error: null
};

//Create
export const createBlog = createAsyncThunk(
  "blogs/create",
  async ({ title, content, path }: { title: string; content: string; path: string | null }, { rejectWithValue }) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return rejectWithValue("Unauthorized User");
    
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        blog_title: title,
        blog_content: content,
        blog_author_id: user.data.user?.id,
        blog_image_path: path
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
  async ({ id }: { id: string }, { rejectWithValue}) => {
    const { data, error } = await supabase
      .from("blogs")
      .select("*, users(user_email)")
      .eq("blog_id", id)
      .single();
    
    if (error) return rejectWithValue(error.message);

    return {
      ...data,
      blog_author_email: data.users?.user_email ?? null
    } as Blog;
  }
);
//Update
export const updateBlog = createAsyncThunk(
  "blogs/update",
  async ({ id, title, content, path }: { id: string; title: string; content: string; path: string | null }, { rejectWithValue }) => {
    const { data, error } = await supabase
      .from("blogs")
      .update({
        blog_title: title,
        blog_content: content,
        blog_image_path: path
      })
      .select("*")
      .eq("blog_id", id);

    if (error) return rejectWithValue(error.message);
    if (!data) return rejectWithValue("Blog not found")

    return { message: `Blog ${id} was updated successfully`, data };
  }
);
//Delete
export const deleteBlog = createAsyncThunk(
  "blogs/delete",
  async ({ id }: { id: string }, { rejectWithValue }) => {
    const { error } = await supabase
      .from("blogs")
      .delete()
      .eq("blog_id", id);

    if (error) return rejectWithValue(error.message);
    return { message: `Blog ${id} was deleted successfully` };
  }
);
//Upload Image
export const uploadImage = createAsyncThunk(
  "blogs/uploadImage",
  async ({ file, path }: { file: File; path: string | null; }, { rejectWithValue }) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return rejectWithValue("Unauthorized User");

    if (!path) path = `${user.data.user.id}/${file.name}_${Date.now()}`;

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { upsert: true });
    
    if (error) return rejectWithValue(error.message);
    return { message: `Image ${data.path} was created successfully`, data: data.path };
  }
);
//Get Image
export const getImage = createAsyncThunk(
  "blogs/getImages",
  async ({ path }: { path: string; }, { rejectWithValue }) => {
    const { data, error } = await supabase.storage
      .from("blog-images")
      .createSignedUrl(path, 3600);
    
    if (error) return rejectWithValue(error.message);
    return data.signedUrl;
  }
)

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
        console.log(action.payload.message);
        console.log(action.payload.data);
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
        state.blog = action.payload;
        console.log(action.payload);
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
        console.log(action.payload.message);
        console.log(action.payload.data);
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
        console.log(action.payload.message);
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Upload Image
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload.message);
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.log(action.payload);
      })
      //Get Image
      .addCase(getImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getImage.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(getImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const blogsReducer = blogSlice.reducer;
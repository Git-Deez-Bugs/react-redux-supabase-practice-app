import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

export type Blog = {
  blog_id: string;
  blog_title: string;
  blog_content: string;
  blog_author_id: string;
  blog_author_email: string | null;
  blog_image_path: string | null;
  blog_signedUrl: string | undefined;
  blog_comment_count: number;
  blog_comments: Comment[];
  blog_created_at: string;
};

export type Comment = {
  comment_id: string;
  comment_author_id: string;
  comment_author_email: string | null;
  comment_blog_id: string;
  comment_text_content: string | null;
  comment_image_path: string | null;
  comment_signed_url: string | undefined;
  comment_created_at: string;
  users?: { user_email: string };
}

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
  async ({ title, content, path }: { title: string; content: string; path: string | null }, { getState, rejectWithValue }) => {

    const state = getState() as { auth: { user: { id: string } | null } };
    const user = state.auth.user;

    if (!user) return rejectWithValue("Unauthorized User")
    
    const { data, error } = await supabase
      .from("blogs")
      .insert({
        blog_title: title,
        blog_content: content,
        blog_author_id: user.id,
        blog_image_path: path
      });
    
    if (error) return rejectWithValue(error.message);
    return { message: "New blog created successfully", data };
  }
);
//Read All
export const readBlogs = createAsyncThunk(
  "blogs/fetchAll",
  async ({ page, pageSize }: { page: number; pageSize: number }, { dispatch, rejectWithValue }) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabase
      .from("blogs")
      .select("*, users(user_email), comment_count:comments!comment_blog_id(count)", { count: "exact" })
      .range(from, to)
      .order("blog_created_at", { ascending: false });

    if (error) return rejectWithValue(error.message);

    if (!data) return { data: [], count: 0 };

    const imagePaths = data.map(blog => blog.blog_image_path).filter(Boolean);

    const signedUrls: Record<string, string> = {};

    if(imagePaths.length > 0) {
      const urls = await dispatch(getImages({ path: imagePaths })).unwrap();

      urls.forEach(item => {
        if (item.signedUrl && item.path) signedUrls[item.path] = item.signedUrl;
      });
    }

    const blogsWithExtras = data.map(blog => ({
      ...blog,
      blog_author_email: blog.users.user_email,
      users: undefined,
      blog_signedUrl: blog.blog_image_path
        ? signedUrls[blog.blog_image_path]
        : undefined,
      blog_comment_count: blog.comment_count?.[0].count
    }));

    return { data: blogsWithExtras, count };
  }
);
//Read One
export const readBlog = createAsyncThunk(
  "blogs/fetchBlogById",
  async ({ id }: { id: string; }, { dispatch, rejectWithValue }) => {

    const { data, error } = await supabase
      .from("blogs")
      .select("*, users(user_email)")
      .eq("blog_id", id)
      .single();
    
    if (error) return rejectWithValue(error.message);

    if (!data) return data;

    const signedUrl = data.blog_image_path
          ? await dispatch(getImage({ path: data.blog_image_path })).unwrap()
          : undefined;
    
    return {
      ...data,
      blog_author_email: data.users?.user_email ?? null,
      users: undefined,
      blog_signedUrl: signedUrl,
    } as Blog;
  }
);
// Read One Blog with Comments
export const readBlogWithComments = createAsyncThunk(
  "blogs/fetchBlogByIdWithComments",
  async ({ id }: { id: string; }, { dispatch, rejectWithValue }) => {

    const { data, error } = await supabase
      .from("blogs")
      .select("*, users(user_email), comments!comment_blog_id (*, users(user_email))")
      .eq("blog_id", id)
      .single();
    
    if (error) return rejectWithValue(error.message);

    if (!data) return data;

    const signedUrl = data.blog_image_path
          ? await dispatch(getImage({ path: data.blog_image_path })).unwrap()
          : undefined;

    const commentImagePaths = data.comments.map((comment: Comment) => comment.comment_image_path).filter(Boolean);

    const commentSignedUrls: Record<string, string> = {};

    if (commentImagePaths.length > 0) {

      const commentImageUrls = await dispatch(getImages({ path: commentImagePaths })).unwrap();

      commentImageUrls.forEach(url => {
        if (url.signedUrl && url.path) commentSignedUrls[url.path] = url.signedUrl;
      })

    }

    const commentsWithExtras = data.comments?.map((comment: Comment) => ({
      ...comment,
      comment_author_email: comment.users?.user_email ?? null,
      comment_signed_url: comment.comment_image_path
        ? commentSignedUrls[comment.comment_image_path]
        : undefined,
      users: undefined,
      comments: undefined
    })) ?? [];
    
    return {
      ...data,
      blog_author_email: data.users?.user_email ?? null,
      users: undefined,
      comments: undefined,
      blog_signedUrl: signedUrl,
      blog_comments: commentsWithExtras ?? []
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
  async ({ id, path }: { id: string; path: string | null }, { dispatch, rejectWithValue }) => {

    if (path) await dispatch(deleteImage({ path })).unwrap();

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
  async ({ file, path }: { file: File; path: string | null; }, { getState, rejectWithValue }) => {
    
    const state = getState() as { auth: { user: { id: string } | null } };
    const user = state.auth.user;

    if (!user) return rejectWithValue("Unauthorized User")

    if (!path) path = `${user.id}/${file.name}_${Date.now()}`;

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(path, file, { upsert: true });
    
    if (error) return rejectWithValue(error.message);
    return { message: `Image ${data.path} was created successfully`, data: data.path };
  }
);
//Get Images
export const getImages = createAsyncThunk(
  "blogs/getImages",
  async ({ path }: { path: string[]; }, { rejectWithValue }) => {
    const { data, error } = await supabase.storage
      .from("blog-images")
      .createSignedUrls(path, 3600);
    
    if (error) return rejectWithValue(error.message);
    return data;
  }
)
//Get Image
export const getImage = createAsyncThunk(
  "blogs/getImage",
  async ({ path }: { path: string; }, { rejectWithValue }) => {
    const { data, error } = await supabase.storage
      .from("blog-images")
      .createSignedUrl(path, 3600);
    
    if (error) return rejectWithValue(error.message);
    return data.signedUrl;
  }
)
//Delete Image
export const deleteImage = createAsyncThunk(
  "blogs/deleteImage",
  async ({ path }: { path: string; }, { rejectWithValue }) => {
    const { error } = await supabase.storage
      .from("blog-images")
      .remove([path]);

    if (error) return rejectWithValue(error.message);
    return { message: `Image ${path} was deleted successfully` };
  }
)
//Create Comment
export const createComment = createAsyncThunk(
  "blogs/createComment",
  async ({ id, textContent, path }: { id: string; textContent: string | undefined; path: string | null }, { getState, rejectWithValue }) => {

    const state = getState() as { auth: { user: { id: string } | null } };
    const user = state.auth.user;

    if (!user) return rejectWithValue("Unauthorized User");

    const { data, error } = await supabase
      .from("comments")
      .insert({
        comment_blog_id: id,
        comment_author_id: user.id,
        comment_text_content: textContent,
        comment_image_path: path
      });

    if (error) return rejectWithValue(error.message);

    return { message: "New comment created successfully", data };
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
      //Read One with Comments
      .addCase(readBlogWithComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(readBlogWithComments.fulfilled, (state, action) => {
        state.loading = false;
        state.blog = action.payload;
        console.log(action.payload);
      })
      .addCase(readBlogWithComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
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
      })
      //Delete Image
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Create Comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload.data);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  }
});

export const blogsReducer = blogSlice.reducer;
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedLayout from "./ProtectedLayout"
import AuthListener from "./AuthListener"
import BlogsPage from "./pages/blogs/BlogsPage"
import SignUpPage from "./pages/auth/SignUpPage"
import SignInPage from "./pages/auth/SignInPage"
import SignOutPage from "./pages/auth/SignOutPage"
import CreateBlogPage from "./pages/blogs/CreateBlogPage"
import UpdateBlogPage from "./pages/blogs/UpdateBlogPage"
import DeleteBlogPage from "./pages/blogs/DeleteBlogPage"
import BlogPage from "./pages/blogs/BlogPage"

export default function App() {
  return (
    <BrowserRouter>
      <AuthListener />
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<BlogsPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blogs/:id" element={<BlogPage />} />
          <Route path="/blogs/create" element={<CreateBlogPage />} />
          <Route path="/blogs/update/:id" element={<UpdateBlogPage />} />
          <Route path="/blogs/delete/:id" element={<DeleteBlogPage />} />
          <Route path="/signout" element={<SignOutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

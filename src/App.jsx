
import { Routes, Route,Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Header from "./components/Header";
import Home from "./pages/Home/Home";
import Categories from "./pages/Category/Categories";
import CategoryStories from "./pages/Category/CategoryStories";
import DraftHome from "./pages/Drafts/Drafthome";
import DraftList from "./pages/Drafts/DraftList";
import NewDraft from "./pages/Drafts/NewDraft";
import StoryDetail from "./pages/Story/StoryDetail";
import StoryReader from "./pages/Story/StoryReader";
import Chapter from "./pages/Story/Chapter";
import ChangePassword from "./pages/Auth/ChangePassword";
import Notifications from "./pages/Notifications/Notifications";
import AddChapter from "./pages/Story/AddChapter";
import AuthorProfile from "./pages/Author/AuthorProfile";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import VerifyOtp from "./pages/Auth/VerifyOtp";

import ProtectedRoute from "./routes/ProtectedRoute";
import AccountDetails from "./pages/Author/AccountDetails";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageStories from "./pages/Admin/ManageStories";

import Footer from "./components/Footer";
import AboutUs from "./pages/Static/AboutUs";
import ScrollToTop from "./components/ScrollToTop";

import "./styles.css";

export default function App() {
  const { i18n } = useTranslation();

  // Initialize language on app load
  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    if (savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
    document.documentElement.lang = savedLang;
  }, [i18n]);

  return (
    <>
      <ScrollToTop />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        {/*<Route path="/stories/:category" element={<CategoryStories />} />*/}
        <Route path="/stories" element={<CategoryStories />} />    


        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/story/preview" element={<StoryReader />} />

        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/about-us" element={<AboutUs />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/story/:id/read" element={<StoryReader />} />
          <Route path="/story/:storyId/chapter/:chapterId" element={<Chapter />} />
          <Route path="/author/me" element={<AuthorProfile />} />
          <Route path="/account" element={<AccountDetails />} />
          <Route path="/change-password" element={<ChangePassword />} />

          <Route path="/draft" element={<DraftHome />} />
          <Route path="/draft/list" element={<DraftList />} />
          <Route path="/draft/new" element={<NewDraft />} />
          <Route path="/draft/edit/:id" element={<NewDraft />} />

          <Route path="/add-chapter/:storyId" element={<AddChapter />} />

          <Route path="/notifications" element={<Notifications />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="stories" element={<ManageStories />} />
          </Route>
        </Route>
      </Routes>

      <Footer />
    </>
  );
}


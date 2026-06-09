
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import AdminRoute from "./routes/AdminRoute";
import AccountDetails from "./pages/Author/AccountDetails";

import Footer from "./components/Footer";
import AboutUs from "./pages/Static/AboutUs";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import ManageStories from "./pages/Admin/ManageStories";
import ManageChapters from "./pages/Admin/ManageChapters";
import ManageReviews from "./pages/Admin/ManageReviews";
import ManageLanguages from "./pages/Admin/ManageLanguages";
import ManageCategories from "./pages/Admin/ManageCategories";
import ManageNotifications from "./pages/Admin/ManageNotifications";
import AdminAnalytics from "./pages/Admin/AdminAnalytics";
import AdminAuditLogs from "./pages/Admin/AdminAuditLogs";
import AdminSettings from "./pages/Admin/AdminSettings";
import ScrollToTop from "./components/ScrollToTop";
import EditStory from "./pages/EditStory";

import "./styles.css";

export default function App() {
  const { i18n } = useTranslation();
  const location = useLocation();

  // Check if current path is admin route
  const isAdminRoute = location.pathname.startsWith("/admin");

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
      
      {/* Only show header and footer on non-admin routes */}
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categories" element={<Categories />} />
        {/*<Route path="/stories/:category" element={<CategoryStories />} />*/}
        <Route path="/stories" element={<CategoryStories />} />    


        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/story/preview" element={<StoryReader />} />
        <Route path="/edit-story/:id" element={<EditStory />} />
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

          {/* ADMIN ROUTES */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="stories" element={<ManageStories />} />
            <Route path="chapters" element={<ManageChapters />} />
            <Route path="reviews" element={<ManageReviews />} />
            <Route path="languages" element={<ManageLanguages />} />
            <Route path="categories" element={<ManageCategories />} />
            <Route path="notifications" element={<ManageNotifications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="audit-logs" element={<AdminAuditLogs />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
      </Routes>

      {/* Only show footer on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </>
  );
}


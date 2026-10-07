import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

// User Pages & Components
import Home from "./pages/User/Home";
import Navbar from "./Components/User/Navbar";
import Footer from "./pages/User/Footer";      // UserNavbar alias
// import Footer from "./Components/User/Footer";       // UserFooter alias

// Admin Pages
import Adminlogin from "./pages/Admin/Adminlogin";
import AdminLayout from "./layouts/AdminLayout";

// User Layout
import UserLayout from "./layouts/UserLayout";

// Utility Components
import ScrollToTop from "./Components/ScrollToTop";
import BookingForm from "./Components/User/Bookingform";
import CustomerPortal from "./Components/User/CustomerPortal";
import PartnerDashboard from "./Components/User/PartnerDashboard";
import Packages from "./Components/User/Packages";
import About from "./pages/User/About";
import TermsAndConditions from "./pages/User/Terms";
import PrivacyPolicy from "./pages/User/Privacy";
import ContactPage from "./pages/User/Contact";
import CarWashAhmedabad from "./pages/User/Carwashahmedabad"
import CarWashGandhinagar from "./pages/User/Carwashgandhinagar"


// ─────────────────────────────────────────────
// Protected Route: Admin
// ─────────────────────────────────────────────
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("al_token");
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

// ─────────────────────────────────────────────
// Protected Route: User
// ─────────────────────────────────────────────
const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// ─────────────────────────────────────────────
// App Layout (Navbar + Footer conditionally)
// ─────────────────────────────────────────────
const AppLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");
  const isDriverRoute = pathname.startsWith("/driver");

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!isAdminRoute && !isDriverRoute && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && !isDriverRoute && <Footer />}
    </div>
  );
};

// ─────────────────────────────────────────────
// App Entry Point
// ─────────────────────────────────────────────
function App() {
  // return (
    // <AppLayout>
    //   <Routes>
    //     {/* Public Routes */}
    //     <Route path="/" element={<Home />} />
    //     <Route path="/book" element={<BookingForm />} />
    //     <Route path="/packages" element={<Packages />} />
    //     <Route path="/about" element={<About />} />
    //     <Route path="/term" element={<TermsAndConditions />} />
    //     <Route path="/privacy" element={<PrivacyPolicy />} />
    //     <Route path="/contact" element={<ContactPage />} />
    //     <Route path="/car-wash-in-ahmedabad" element={<CarWashAhmedabad />} />
    //     <Route path="/car-wash-in-gandhinagar" element={<CarWashGandhinagar />} />











    //     <Route path="/admin/login" element={<Adminlogin />} />

    //     {/* Admin Protected Routes */}
    //     <Route
    //       path="/admin/*"
    //       element={
    //         <AdminProtectedRoute>
    //           <AdminLayout />
    //         </AdminProtectedRoute>
    //       }
    //     />

    //     {/* User Protected Routes */}
    //     <Route path="/user/portal" element={<CustomerPortal />} />
    //     <Route path="/partner/portal" element={<PartnerDashboard />} />

    //     {/* <Route
    //       path="/user/*"
    //       element={
    //         <UserProtectedRoute>
    //           <UserLayout />
    //         </UserProtectedRoute>
    //       }
    //     /> */}

    //     {/* 404 Fallback */}
    //     <Route
    //       path="*"
    //       element={
    //         <div className="flex items-center justify-center h-screen font-bold text-2xl text-slate-400">
    //           404 - Page Not Found
    //         </div>
    //       }
    //     />
    //   </Routes>
    // </AppLayout>
  // );
}

export default App;
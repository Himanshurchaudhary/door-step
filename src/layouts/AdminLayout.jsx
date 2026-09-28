// src/components/AdminLayout.jsx
import { useState, useEffect } from "react";
import AdminSidebar from "../Components/Admin/Adminsidebar";
import AdminBanners from "../Components/Admin/Adminbanners";
import AdminPackages from "../Components/Admin/Packagesadmin";
import AddonsSection from "../Components/Admin/Addonssection";
import PartnersAdmin from "../Components/Admin/Partnersadmin";
import ServiceCities from "../Components/Admin/Servicecities";
import CarTypes from "../Components/Admin/CarTypes";
import AdminBookings from "../Components/Admin/Adminbookings";
import AdminCustomers from "../Components/Admin/Admincustomers";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from "react-router-dom";


const AdminLayout = () => {
  const navigate = useNavigate();

  // ✅ Token check — agar login nahi hai to login page pe bhejo
  useEffect(() => {
    const token = localStorage.getItem("al_token");
    if (!token) {
      navigate("/admin/login");
    }
  }, []);

  return (
    <AdminSidebar>
      <Routes>
        {/* Yahan sab admin pages render honge */}
        <Route path="banners" element={<AdminBanners />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="addons" element={<AddonsSection />} />
        <Route path="partners" element={<PartnersAdmin />} />
        <Route path="service-city" element={<ServiceCities />} />
        <Route path="car-type" element={<CarTypes />} />
        <Route path="admin-booking" element={<AdminBookings />} />
        <Route path="users" element={<AdminCustomers />} />








      </Routes>
      <Outlet />
    </AdminSidebar>
  );
};

export default AdminLayout;
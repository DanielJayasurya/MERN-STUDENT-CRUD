import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import StudentRegistration from "../pages/StudentRegistration";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AdminLogin from "../pages/AdminLogin";
import ReportPortal from "../pages/ReportPortal";
import NotFound from "../NotFound";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const Layout = ({ children }) => {
  return (
    <>
      <Navbar title="Praathee Student Registration" />
      {children}
      <Footer title="© Praathee Media Private Ltd.. 2024 All rights reserved." />
    </>
  );
};

const Home = () => {
  return (
    <>
      <Layout>
        <StudentRegistration />
      </Layout>
    </>
  );
};

const Login = () => {
  return (
    <>
      <Layout>
        <AdminLogin />
      </Layout>
    </>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      <Layout>
        <ReportPortal />
      </Layout>
    </>
  );
};

export default AppRoutes;

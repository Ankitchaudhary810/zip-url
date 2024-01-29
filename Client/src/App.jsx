import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import EmailVerify from "./components/EmailVerify";
import Dashboard from "./components/pages/Dashboard";
import { isAuthenticated } from "./Apicalls/auth";
import UserRoutes from "./components/UserRoutes";
import UrlCard from "./components/UrlCard";
import Analytics from "./components/pages/Analytics";
import Profile from "./components/pages/Profile";
import AdminCreateAccount from "./components/Admin/AdminCreateAccount";
import AdminRoute from "./components/Admin/AdminRoute";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashBoard from "./components/Admin/AdminDashBoard";
import AdminUserData from "./components/Admin/AdminUserData";
import AdminReport from "./components/Admin/AdminReport";
import AdminSummary from "./components/Admin/AdminSummary";
import { Theme } from "@radix-ui/themes";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin/*" element={<AdminLayout />} />
          <Route path="/*" element={<UserLayout />} />
        </Routes>
      </Router>
    </>
  );
};

const AdminLayout = () => (
  <>
    <Routes>
      <Route path="/" element={<Outlet />}>
        <Route path="account" element={<AdminCreateAccount />} />
        <Route path="login" element={<AdminLogin />} />
        <Route path="dashboard" element={<AdminDashBoard />} />
        <Route path=":userId/:adminId" element={<AdminUserData />} />
        <Route path="reports" element={<AdminReport />} />
        <Route path="summary" element={<AdminSummary />} />
      </Route>
    </Routes>
  </>
);

const UserLayout = () => (
  <>
    <Navbar />
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route
        path="*"
        element={
          <div className="mt-5 text-center">
            <h1>Page Is Not Found</h1>
          </div>
        }
      />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/:id/verify/:token" element={<EmailVerify />} />
      <Route path="/email" element={<EmailVerify />} />
      <Route path="/user" element={<UserRoutes />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analysis/:shorturl" element={<Analytics />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/textroute" element={<UrlCard />} />
    </Routes>
  </>
);

export default App;

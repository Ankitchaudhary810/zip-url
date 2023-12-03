import React from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { AdminIsAuthenticated } from '../../AdminApiCalls/AdminAuth';

const AdminRoute = () => {
    if (AdminIsAuthenticated()) {
        return <Outlet />
    } else {
        return <Navigate to={"/admin/account"} />
    }
}
export default AdminRoute;
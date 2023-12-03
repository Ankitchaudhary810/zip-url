import React from "react";
import {  Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../Apicalls/auth";


const UserRoutes = () => {
    if(isAuthenticated()){
        return <Outlet/>
    }else{
        return <Navigate to={"/signin"} />
    }
}

export default UserRoutes;

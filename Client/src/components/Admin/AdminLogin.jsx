import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { AdminSignin, AdminaAthenticate } from '../../AdminApiCalls/AdminAuth';
import { toast } from 'react-toastify';

const AdminLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [didRedirect, setDidRedirect] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        AdminSignin({ email, password }).then((data) => {
            if (data.msg === "Password is incorrect...") {
                alert("Password is Incorrect");
            } else if (data.msg === "Admin Not Found") {
                alert("Admin Not Found")
            } else {
                AdminaAthenticate(data, () => {
                    setDidRedirect(true);
                });
            }
        })
    }
    return (
        <div style={containerStyle}>
            <div className="card w-md-100 text-white" style={{ backgroundColor: "#1E1E1F" }}>
                <div className="card-body">
                    <h1 className="card-title">Admin Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ backgroundColor: "#172627" }}>

                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>

                                </>
                            ) : (
                                "Submit"
                            )}
                        </button>
                        <p>Have an Account? <Link to="/admin/account" className="fw-bold text-white">
                            <u>Create Account</u>
                        </Link></p>
                        {didRedirect && <Navigate to="/admin/dashboard" />}
                    </form>
                </div>
            </div>
        </div>
    );
};


const containerStyle = {
    backgroundColor: "#000000",
    color: "white",
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

export default AdminLogin;
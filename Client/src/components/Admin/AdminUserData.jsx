import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AdminIsAuthenticated, AdminUserUrls } from '../../AdminApiCalls/AdminAuth';
const AdminUserData = () => {
    const [userUrls, setUserUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const params = useParams();
    const admin = AdminIsAuthenticated();
    const admintoken = admin.admintoken;
    const userId = params.userId;
    const adminId = params.adminId;

    const fetchUserUrls = async () => {
        try {
            const resp  = AdminUserUrls(adminId, userId, admintoken).then((data) => {
                if(data.msg === "Urls Found"){
                    setUserUrls(data.userUrls);
                    setIsLoading(false);
                }else if(data.msg === "No URLs found for this user"){
                    setUserUrls([]);
                    setIsLoading(false);
                }
            })
           
        } catch (error) {
            console.error('Error fetching user URLs:', error.message);
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUserUrls();
    }, []);
    if (isLoading) {
        return <p style={containerStyle}>Loading...</p>;
    }
    if (typeof userUrls === "undefined" || userUrls.length === 0) {
        return (
            <div style={containerStyle}>
                <h2>Admin User Data</h2>
                <p>No URLs found for this user.</p>
            </div>
        );
    }
    return (
        <div style={containerStyle}>
            <h2>Admin User Data</h2>
            <div className="row">
                {userUrls.length === 0 ? (
                    <div className="col">
                        <p>No URLs found for this user.</p>
                    </div>
                ) : (
                    userUrls.map(url => (
                        <div className="col-md-4 mb-4" key={url._id}>
                            <div className="card text-white" style={urlCardStyle}>
                                <div className="card-body">
                                    <h5 className="card-title">URL Details</h5>
                                    <p className="card-text">Original URL: {url.originalUrl}</p>
                                    <p className="card-text">Short URL: {url.shortUrl}</p>
                                    <p className="card-text">Password Protected: {url.passwordProtected ? 'Yes' : 'No'}</p>
                                </div>
                                <div className="card-footer">
                                    <button className="btn btn-danger" onClick={() => handleDeleteUrl(url._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const containerStyle = {
    backgroundColor: "#000000",
    color: "white",
    width: "100%",
    minHeight: "100vh",
    padding: "20px", 
};

const urlCardStyle = {
    width: '100%',
    height: '250px',
    backgroundColor: "#1E1E1F",
    boxShadow: '3px 1px 4px 0px rgba(255,185,103,0.75)',
    WebkitBoxShadow: '4px 2px 5px 0px rgba(255,255,255,0.75)',
    MozBoxShadow: '4px 2px 5px 0px rgba(255,255,255,0.75)',
};

export default AdminUserData;

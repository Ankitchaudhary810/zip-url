import React, { useEffect } from "react";
import {
  AdminDeleteUser,
  AdminGetUsers,
  AdminIsAuthenticated,
} from "../../AdminApiCalls/AdminAuth";
import { useState } from "react";
import { Link } from "react-router-dom";
const AdminDashBoard = () => {
  const admin = AdminIsAuthenticated();
  const adminId = admin.admin._id;
  const admintoken = admin.admintoken;

  const [users, setUsers] = useState([]);

  useEffect(() => {
    handleUserData();
  }, []);

  const handleUserData = () => {
    AdminGetUsers(adminId, admintoken).then((data) => {
      if (data.msg === "No User") {
        alert("No users");
      } else if (data.msg === "Internal Server Error") {
        alert("internal server error");
      } else {
        setUsers(data.user);
      }
    });
  };

  console.log({ users });

  const handleDeleteData = (userId) => {
    AdminDeleteUser(adminId, userId, admintoken).then((data) => {
      if (
        data.msg === "User account and associated URLs deleted successfully"
      ) {
        alert("account is deleted");
        window.location.reload();
      }
    });
  };

  return (
    <>
      <div className="d-flex justify-content-center ">
        <ul class=" d-flex justify-content-evenly nav justify-content-center w-100 bg-black">
          <li class="nav-item ">
            <a class="nav-link" href="#">
              Profile
            </a>
          </li>
          <Link>
            <li class="nav-item">
              <a class="nav-link" href="#">
                User
              </a>
            </li>
          </Link>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Settings
            </a>
          </li>
          <Link to={`/admin/summary`}>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Summary
              </a>
            </li>
          </Link>
          <Link to={`/admin/reports`}>
            <li class="nav-item">
              <a class="nav-link" href="#">
                Reports
              </a>
            </li>
          </Link>
        </ul>
      </div>
      <div style={containerStyle}>
        <div className="card mt-2 mb-5" style={cardStyle}>
          <h2 className="text-center">Admin Dashboard</h2>
          <p className="text-center mb-0">User Management</p>
          <div className="scroll-container overflow-hidden">
            {users.map((user) => (
              <div
                className="card user-card text-white m-4"
                style={{ backgroundColor: "#1E1E1F" }}
                key={user.id}
              >
                <div
                  className="card-body"
                  style={{ backgroundColor: "#181818" }}
                >
                  <h5 className="card-title">{user.fullName}</h5>
                  {/* <p className="card-text">{user.email}</p>
                  <p className="card-text">{user._id}</p>

                  <p className="card-text">Joined: {user.createdAt}</p> */}

                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn text-danger"
                      onClick={() => handleDeleteData(user._id)}
                      style={{ backgroundColor: "#172627" }}
                    >
                      Delete
                    </button>
                    <Link to={`/admin/${user._id}/${adminId}`}>
                      <button
                        className="btn btn text-danger"
                        onClick={() => handleUserData()}
                        style={{ backgroundColor: "#172627" }}
                      >
                        Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const containerStyle = {
  backgroundColor: "#000000",
  color: "white",
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  backgroundColor: "#1D1D1E",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "90%",
  maxWidth: "800px",
};

export default AdminDashBoard;

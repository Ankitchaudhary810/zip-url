import React, { Fragment, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import Logo from "../../Assets/zipurl-low-resolution-logo-color-on-transparent-background.svg";
import { isAuthenticated, signout } from "../Apicalls/auth";
import { toast } from "react-toastify";
import Logo2 from "../../Assets/logo2.svg";
import profile from "../../Assets/profile.png";
import logout from "../../Assets/logout.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const history = useNavigate();

  const data = isAuthenticated();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const currentTab = (path) => {
    return {
      color: location.pathname === path ? "orange" : "#FFFFFF",
    };
  };

  const handleSignout = () => {
    closeNavbar();
    signout(() => {
      history("/signin");
      toast.warn("Signout Success", {
        position: "top-right",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });
  };

  return (
    <nav
      className="navbar navbar-expand-lg text-dark"
      style={{
        backgroundColor: "#FFFFFF",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="container ">
        <Link
          className="navbar-brand text-dark"
          to="/"
          onClick={closeNavbar}
          style={{ marginRight: "10px" }}
        >
          <img src={Logo} alt="" width="70px" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          style={{ marginBottom: "1px", marginLeft: "12px" }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link
                className="nav-link text-dark"
                style={{ ...currentTab("/"), marginLeft: "15px" }}
                to="/"
                onClick={closeNavbar}
              >
                Home
              </Link>
            </li>

            {/* {isAuthenticated() && (
              <li className="nav-item">
                <Link
                  className="nav-link text-dark"
                  style={{ ...currentTab("/profile"), marginLeft: "15px" }}
                  to="/profile"
                  onClick={closeNavbar}
                >
                  Profile
                </Link>
              </li>
            )} */}

            {isAuthenticated() && (
              <li className="nav-item">
                <Link
                  className="nav-link text-dark"
                  style={{ ...currentTab("/profile"), marginLeft: "15px" }}
                  to="/user/dashboard"
                  onClick={closeNavbar}
                >
                  Dashboard
                </Link>
              </li>
            )}

            <li className="nav-item">
              <Link
                className="nav-link text-dark"
                style={{ ...currentTab("/about"), marginLeft: "15px" }}
                to="/about"
                onClick={closeNavbar}
              >
                About
              </Link>
            </li>

            <li className="nav-item text-dark">
              <Link
                className="nav-link text-dark"
                style={{ ...currentTab("/contact"), marginLeft: "15px" }}
                to="/contact"
                onClick={closeNavbar}
              >
                Contact Us
              </Link>
            </li>

            {!isAuthenticated() && (
              <li className="nav-item">
                <Link
                  className="nav-link text-dark"
                  style={{ ...currentTab("/signup"), marginLeft: "15px" }}
                  to="/signup"
                  onClick={closeNavbar}
                >
                  Signup
                </Link>
              </li>
            )}

            {!isAuthenticated() && (
              <li className="nav-item">
                <Link
                  className="nav-link text-dark"
                  style={{ ...currentTab("/signin"), marginLeft: "15px" }}
                  to="/signin"
                  onClick={closeNavbar}
                >
                  Sign In
                </Link>
              </li>
            )}

            {isAuthenticated() && (
              <li className="nav-item dropdown">
                <MDBDropdown>
                  <MDBDropdownToggle
                    tag="a"
                    className="nav-link dropdown-toggle user-action"
                  >
                    <img
                      src={profile}
                      width="27px"
                      height="27px"
                      className="avatar"
                      alt="Avatar"
                      style={{ marginRight: "4px" }}
                    />
                    {data.user.fullName}
                    {/* <b className="caret"></b> */}
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <Link to="/user/profile">
                      <MDBDropdownItem link>
                        <i className="fa fa-user-o"></i> Profile{" "}
                      </MDBDropdownItem>
                    </Link>
                    {/* <MDBDropdownItem link><i className="fa fa-calendar-o"></i> Calendar</MDBDropdownItem> */}
                    {/* <MDBDropdownItem link><i className="fa fa-sliders"></i> Settings</MDBDropdownItem> */}
                    <MDBDropdownItem divider />
                    <MDBDropdownItem
                      onClick={handleSignout}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="material-icons">
                        {" "}
                        <img
                          src={logout}
                          width="20px"
                          height="20px"
                          className="avatar"
                          alt="Avatar"
                          style={{ marginLeft: "3px" }}
                        />
                      </i>{" "}
                      Logout
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </li>
            )}
          </ul>
          {/* <ul className="navbar-nav">
            <li className="nav-item text-dark mt-2">
              <Link
                className="btn btn-dark  ml-md-3"
                style={{
                  marginLeft: "15px",
                  backgroundColor: "#FFA458",
                  outline: "1px solid black",
                  padding: "0.3rem 1.2rem",
                  position: "relative",
                  top: "-3px"
                }}
                to="/book"
              >
                Book
              </Link>
            </li>
          </ul> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

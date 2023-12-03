import React, { useState } from 'react';
import "./Home.css"
import password from "../../../Assets/password.png"
import accpet from "../../../Assets/accept.png"
import linkFile from "../../../Assets/link-file.png"
import qrCode from "../../../Assets/qr-code.png"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import Marquee from "react-fast-marquee";
import apple from "../../../Assets/companies/apple.png"
import Twitch from "../../../Assets/companies/Twitch.png"
import amazone from "../../../Assets/companies/amazone.png"
import Bitly from "../../../Assets/companies/Bitly.png"
import pinterest from "../../../Assets/companies/pinterest.png"
import google from "../../../Assets/companies/google.png"
import discord from "../../../Assets/companies/Discord.png"
import atl from "../../../Assets/companies/atl.png"
import threads from "../../../Assets/companies/threads.png"
import Reddit from "../../../Assets/companies/Reddit.png"
import chatgpt from "../../../Assets/companies/chatgpt.webp"





const Home = () => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const buttonStyles = {
    outline: '2px solid black',
    backgroundColor: isHovered ? '#F3F3F3' : '#FFA458',
    marginTop: "100px"
  };

  const handleOnClick = () => {
    if (localStorage.getItem('jwt') === null) {
      toast.warn(`Sign In Please.!!`, {
        position: "top-right",
        autoClose: 1900,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      navigate('/signin');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <>
      <div>
        <div className="container text-center" >
          <div className="display-6 display-lg-4 display-md-5 display-sm-6 display-xs-7" style={{ marginTop: "200px", fontWeight: "bold" }}>
            Simplify, Protect, Share, <br />
            and Track Your Links
          </div>
          <p className="sub-heading mt-5 mb-1 display-lg-4 display-md-5 display-sm-6 display-xs-7">
            "Protect your links with password authentication, <br />
            customize URLs for better branding, and gain insights into click activity.
            <br /> Experience efficient, secure, and data-driven link management."
          </p>
          <div
            className="btn text-dark"
            style={buttonStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleOnClick}
          >
            Get Started For Free
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#ffffff", marginTop: "150px", minHeight: "740px" }}>
        <div>
          <div style={{ height: '3px', background: 'black' }}></div>
        </div>

        <div className="container-fluid">
          <div className="text-center display-6 mt-5 display-lg-4 display-md-5 display-sm-6 display-xs-7">Our Services</div>
          <div className="container mt-4">
            <div className="row">
              {/* cards */}
              <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                <div className="card w-100 " style={{
                  border: "1px solid black",
                  boxShadow: "8px 8px 0px -1px rgba(0,0,0,0.75)",
                }}>
                  <div className="card-block">
                    <div className="card-body d-flex align-items-center m-3">
                      <img
                        src={password}
                        className="card-img-top"
                        alt="Card Image"
                        style={{ width: "35px", height: "35px" }}
                      />
                      <h5 className="card-title" style={{ marginLeft: "30px", marginTop: "5px", fontWeight: "bold" }}>
                        Password Protection
                      </h5>
                    </div>
                    <p className="m-4">
                      A complete solution that uses password protection to increase the impact and security of each point of connection between your content and audience.
                    </p>
                    <ul className="m-3 p-3 list-unstyled">
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Maintain privacy with clicks
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Encrypt the protection Password
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Password-Protected Access
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Secure Content Sharing
                      </li>
                    </ul>
                    <div className="text-center">
                      <button
                        className="btn w-75 mb-4 border-danger"
                        style={{ backgroundColor: "#FFA458" }}
                        onClick={handleOnClick}
                      >
                        Get Started
                      </button>
                    </div>

                    <div className="text-center mb-4">
                      <Link to="/password-protection" className="w-75 text-decoration-none">
                        Learn More
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                <div className="card w-100 " style={{
                  border: "1px solid black",
                  boxShadow: "8px 8px 0px -1px rgba(0,0,0,0.75)"
                }}>
                  <div className="card-block">
                    <div className="card-body d-flex align-items-center m-3">
                      <img
                        src={linkFile}
                        className="card-img-top"
                        alt="Card Image"
                        style={{ width: "35px", height: "35px" }}
                      />
                      <h5 className="card-title" style={{ marginLeft: "30px", marginTop: "5px", fontWeight: "bold" }}>
                        Link Management
                      </h5>
                    </div>
                    <p className="m-4">
                      Track clicks on protected links, gaining insights into engagement, location, and audience reach. Optimize content strategy with analytics.
                    </p>
                    <ul className="m-3 p-3 list-unstyled">
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Custom links with your brand
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Advanced analytics & tracking
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        URL shortening at scale
                      </li>

                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        URL redirects
                      </li>

                    </ul>
                    <div className="text-center">
                      <button
                        className="btn w-75 mb-4 border-danger"
                        style={{ backgroundColor: "#FFA458" }}
                        onClick={handleOnClick}
                      >
                        Get Started
                      </button>
                    </div>

                    <div className="text-center mb-4">

                      <Link to="/link-management" className="w-75 text-decoration-none" >
                        Learn More
                      </Link>
                    </div>

                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-12 mt-4">
                <div className="card w-100" style={{
                  border: "1px solid black",
                  boxShadow: "8px 8px 0px -1px rgba(0,0,0,0.75)"
                }}>
                  <div className="card-block">
                    <div className="card-body d-flex align-items-center m-3">
                      <img
                        src={qrCode}
                        className="card-img-top"
                        alt="Card Image"
                        style={{ width: "35px", height: "35px" }}
                      />
                      <h5 className="card-title" style={{ marginLeft: "30px", marginTop: "5px", fontWeight: "bold" }}>
                        QR Code Integration
                      </h5>
                    </div>
                    <p className="m-4">
                      Generate QR codes for protected URLs, easy mobile sharing and access. Scan and redirect to password-protected content on smartphones.
                    </p>
                    <ul className="m-3 p-3 list-unstyled">
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        QR Code Sharing
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Secure Link Sharing
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Mobile Access Enabled
                      </li>
                      <li className="mt-2">
                        <img
                          src={accpet}
                          className="card-img-top"
                          alt="Card Image"
                          style={{ width: "20px", height: "20px", marginRight: "12px" }}
                        />
                        Effortless QR Scanning
                      </li>
                    </ul>
                    <div className="text-center">
                      <button
                        className="btn w-75 mb-4 border-danger"
                        style={{ backgroundColor: "#FFA458" }}
                        onClick={handleOnClick}
                      >
                        Get Started
                      </button>
                    </div>

                    <div className="text-center mb-4">

                      <Link to="/qrcode" className="w-75 text-decoration-none" >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>

        <div style={{ height: '3px', backgroundColor: 'black', marginTop: "100px" }}></div>
        <div style={{ backgroundColor: "#F5F6F7" , paddingBottom:"45px" }} >
          <div >
          <div className="text-center display-6 display-lg-4 display-md-5 display-sm-6 display-xs-7 pt-5">Our Clients</div>
            <Marquee
              direction='right'
              speed={"100"}
              autoFill="true"
              className='mb-5 mt-5'
            >
              <img src={apple} style={{ width: "100px", height: "100px", padding: "13px 2px" }} className='mx-5' />
              <img src={Twitch} style={{ width: "140px", height: "100px", padding: "13px 2px" }} className='mx-5' />
              <img src={amazone} style={{ width: "120px", height: "90px", padding: "13px 2px" }} className='mx-5' />


              <img src={pinterest} style={{ width: "100px", height: "110px", padding: "13px 2px" }} className='mx-5' />
              <img src={threads} style={{ width: "220px", height: "110px", padding: "13px 2px" }} className='mx-5' />
              <img src={Reddit} style={{ width: "190px", height: "150px", padding: "13px 2px" }} className='mx-5' />
              <img src={google} style={{ width: "100px", height: "100px", padding: "13px 2px" }} className='mx-5' />
              <img src={chatgpt} style={{ width: "100px", height: "100px", padding: "13px 2px" }} className='mx-5' />
              <img src={discord} style={{ width: "100px", height: "100px", padding: "13px 2px" }} className='mx-5' />
              <img src={atl} style={{ width: "190px", height: "120px", padding: "13px 2px" }} className='mx-5' />

              <img src={Bitly} style={{ width: "150px", height: "100px", padding: "13px 2px" }} className='mt-4 mx-5' />


            </Marquee>

          </div>

        </div>


        <div style={{ height: '3px', backgroundColor: 'black' }}></div>
        {/* <div style={{ backgroundColor: "white" }}>
          <div >
          <h3 className='text-center pt-4'>Our Customer Reviews</h3>
          <Marquee 
          direction='right' 
          speed={"100"} 
          autoFill="true"
          >
        
        </Marquee>

          </div>

        </div> */}
        {/* <div style={{ height: '3px', backgroundColor: 'black' }}></div> */}



        <footer className=" text-dark text-center py-4" style={{ backgroundColor: "white" }} >
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <h5>Contact Info</h5>
                <p>Phone:+91 00111-00111</p>
                <p>Email: noreplyzipurl1@gmail.com</p>
              </div>
              <div className="col-md-4">
                <h5>Links</h5>
                <ul className="list-unstyled">

                  <li><Link to="/"> Home </Link></li>
                  <li><Link to="/about">About </Link></li>
                  <li>
                    <Link to="/user/dashboard">Dashboard </Link>
                  </li>
                  <li><Link to="/contact">Contact </Link></li>
                </ul>
              </div>



              <div className="col-md-4">
                {/* <h5>Product</h5>
                <p>Product Info Here</p> */}
                <h5>Unlock the Power of ZipURL</h5>
                <p>
                  ZipURL empowers you with password-protected shortened URLs, advanced tracking, and global audience connectivity.
                  Monitor clicks, timestamps, and locations, while ensuring secure access. Unleash the potential of ZipURL today!
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                <p className="mt-4">©2023 ZipUrl All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;

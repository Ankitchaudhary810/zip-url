import React, { useEffect, useState } from 'react'
import { isAuthenticated } from '../../Apicalls/auth'
import { Link } from "react-router-dom"
import { createShortUrl } from '../../Apicalls/url'
import ask from "../../../Assets/ask.png"
import { toast } from 'react-toastify';
import background from "../../../Assets/background.jpg"
import UrlCard from '../UrlCard'
import { Spinner } from 'react-bootstrap';
import No from "../../../Assets/no.png"

import { getShortUrlByUserId } from '../../Apicalls/url'
const Dashboard = () => {
  const data = isAuthenticated();
  const token = data.token;
  const userId = data.user._id;


  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [urls, setUrls] = useState([]);
  const [reload, setrelod] = useState(false);
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);
  const [first , setFirst] = useState(false);
  const isAnyFieldEmpty = originalUrl.trim() === ''

  const loadUrls = () => {
    setIsLoadingUrls(true);
    getShortUrlByUserId(userId)
      .then((data) => {
        setUrls(data);
        setIsLoadingUrls(false); 
      })
      .catch((error) => {
        console.error("Error fetching URLs:", error);
        setIsLoadingUrls(false); // Set isLoadingUrls to false on error as well
      })
      .finally(() => {
        setIsLoadingUrls(false);
      });
  };


  useEffect(() => {
    loadUrls();
  }, [reload]);


  const onSubmit = async (e) => {
    e.preventDefault();
    const urlData = {
      originalUrl,
      shortUrl,
      password,
    }
    setFirst(true);
    try {
      createShortUrl(userId, token, urlData).then(res => {
        if (res.msg === "Internal Server Error") {
          setFirst(false);
          toast.error('Internal Server Error', {
            position: "top-right",
            autoClose: 1900,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })
        } else if (res.msg === "Url is required") {
          setFirst(false);
          toast.error('Url is required', {
            
            position: "top-right",
            autoClose: 1900,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          })

        } else if (res.msg === `${shortUrl} name already Exits please Take different One`) {
          setFirst(false);
          toast.error(`${shortUrl} Already Exits.. Take different Name`, {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          return;
        } else {
          setFirst(false);
          toast.success(`ShortUrl is created`, {
            position: "top-right",
            autoClose: 1900,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setOriginalUrl("");
          setShortUrl("")
          setPassword("")
          setrelod(!reload);
          return;
        }
      })
    } catch (error) {
      console.log("internal server error");
    }
  }

  const handleUrlDeletion = (shortUrl) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url.shortUrl !== shortUrl));
  };

  const name = data.user.fullName;



  return (
    <div  >

      <h1 className='text-center display-6 mt-5 display-lg-4 display-md-5 display-sm-6 display-xs-7' autoComplete="off">
        <span>{name}</span>'s Dashboard</h1>


      <div className="container container-fluid col-md-6 offset-sm-3 text-left p-5" style={{
        backgroundColor: "white",
        border: "1px solid black",
        borderRadius: "13px",
        boxShadow: "8px 8px 0px -1px rgba(0,0,0,0.75)",
      }}>

        <div className="text-center mb-4 "><h4>
          Create New  <span style={{ color: "#EFAA75" }}>Short-Url</span></h4></div>

        <div className="form-floating mb-3 ">
          <input type="url" className="form-control" placeholder="https://zipurl.com/api/create/url/:userId"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
          <label placeholder='https://zipurl.com/api/create/url/:userId'>Url</label>
        </div>

        <div className="form-floating mb-3">
          <input type="text" className="form-control" id="floatingInput" autoComplete='off' placeholder="Password"
            value={shortUrl}
            onChange={(e) => setShortUrl(e.target.value)}
          />
          <label htmlFor="floatingPassword">Customize name </label>
          <span style={{ fontSize: "14px" }}>Customize name (Optinal)<img
            src={ask}
            className="card-img-top "
            alt="Card Image"
            style={{ width: "15px", height: "15px", marginLeft: "4px" }}
            title='This name is used to make the long URL more memorable'
          /></span>

        </div>


        <div className="form-floating mb-3">
          <input type="password" className="form-control" id="floatingInput" autoComplete='off' placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingInput">Password</label>
          <span style={{ fontSize: "14px" }}>Password is for security(Optinal)<img
            src={ask}
            className="card-img-top "
            alt="Card Image"
            style={{ width: "15px", height: "15px", marginLeft: "4px" }}
            title='Password is used to provide a secure Redirection.'
          /></span>
        </div>



        <div className="col-md-6 offset-sm-3 text-left d-flex justify-content-center">
          <button
            className="btn btn-lg btn-primary mt-2 text-dark"
            style={{ backgroundColor: "orange" }}
            onClick={onSubmit}
          >
            {
              first ? ( <>
                <span className="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
                Processing..
              </>):(<>Get ShortUrl</>)
            }
            
          </button>
        </div>

      </div>


      <div className="container mt-5 " style={{
        height: "1010px", backgroundColor: "white",
        border: "1px solid black",
        borderRadius: "13px",
        boxShadow: "8px 8px 0px -1px rgba(0,0,0,0.75)",
        marginBottom: "30px"
      }}>
        <div className="">
          <div className="card-body p-5">
            <h4 className="text-center">ShortUrl History</h4>

            {isLoadingUrls ? (
              <Spinner animation="border" role="status" variant="primary">
                <span className="sr-only">Loading...</span>
              </Spinner>
            ) : urls.length === 0 ? (
              <div className="mt-5 text-center">
                {/* <h5>No ShortUrl</h5> */}
                <img
                  src={No}
                  className="card-img-top"
                  alt="No Image"
                  style={{ width: "100px", height: "100px", marginRight: "12px" }}
                />
              </div>
            ) : (
              urls.map((url) => <UrlCard url={url} key={url._id} onUrlDelete={handleUrlDeletion} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
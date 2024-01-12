import React, { useRef, useState } from "react";
// import { Button } from "react-bootstrap";
import { QRCode } from "react-qrcode-logo";
import html2canvas from "html2canvas";
import logo from "../../Assets/logo.png";
import time from "../../Assets/time.png";
import redirect from "../../Assets/redirect.png";
import notpro from "../../Assets/notpro.png";
import protec from "../../Assets/protec.png";
import { deleteShortUrl } from "../Apicalls/url";
import { isAuthenticated } from "../Apicalls/auth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Card,
  Input,
  Checkbox,
  Typography,
} from "@material-tailwind/react";

const UrlCard = ({ url, onUrlDelete }) => {
  const qrCodeRef = useRef(null);
  const data = isAuthenticated();
  const [open, setOpen] = React.useState(false);
  const [urlData, setUrlData] = useState({
    Original: "",
    ShortUrl: "",
    Password: "",
  });
  const token = data.token;

  const onSubmit = (e) => {
    e.preventDefault();

    deleteShortUrl(url.shortUrl, token).then((res) => {
      if (res.msg === "Internal Server Error") {
        toast.error("Internal Server Error", {
          position: "top-right",
          autoClose: 1900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (res.msg === "URL deleted successfully") {
        toast.success(`Deleted successfully`, {
          position: "top-right",
          autoClose: 1900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        onUrlDelete(url.shortUrl);
      } else if (res.msg === "URL not found") {
        toast.error("URL not found", {
          position: "top-right",
          autoClose: 1900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
      }
    });
  };

  const myStyle = {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    boxShadow: " -1px 1px 12px -7px rgba(0,0,0,0.75)",
    WebkitBoxShadow: "-1px 1px 12px -7px rgba(0,0,0,0.75)",
    MozBoxShadow: "-1px 1px 12px -7px rgba(0,0,0,0.75)",
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    const formattedDate = new Date(dateString).toLocaleString(
      undefined,
      options
    );
    return formattedDate;
  };

  const downloadQR = async () => {
    try {
      if (qrCodeRef.current) {
        const canvas = await html2canvas(qrCodeRef.current);
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrcode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    } catch (error) {
      console.error("Error while generating QR code:", error);
    }
  };

  const fullShortUrl = `localhost:1234/${url.shortUrl}`;

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log({ name, value });
    setUrlData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  function fetchUrlData(id) {
    fetch(`http://localhost:1234/get/${id}/${data.user._id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("data: ", data);
        setUrlData({
          Original: data.originalUrl,
          ShortUrl: data.shortUrl,
          Password: data.password,
        });
      });
  }
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowPasswordTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowPasswordTooltip(false);
  };

  return (
    <>
      <div className="card text-white mt-2 mx-2" style={myStyle}>
        <div className="row ">
          <div className="col-md-6 col-sm-12 d-flex flex-column align-items-center justify-content-center ">
            <div ref={qrCodeRef} className="mt-1 p-1">
              <QRCode
                value={fullShortUrl}
                size={100}
                bgColor="lightblue"
                logoImage={logo}
                qrStyle="dots"
                ecLevel="L"
              />
            </div>
            <button
              className="btn  mb-2"
              style={{
                backgroundColor: "#FFA458",
                fontSize: "11px",
                whiteSpace: "nowrap",
              }}
              onClick={downloadQR}
            >
              Download
            </button>
          </div>

          <div className="col-md-6 col-sm-12 text-dark text-left ">
            <div className="px-3 py-2">
              <p
                className="mb-0 p-1"
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {url.originalUrl}
              </p>
              <p className="mb-1 p-1">
                <img
                  src={redirect}
                  className="card-img-top"
                  alt="Card Image"
                  style={{ width: "20px", height: "20px", marginRight: "12px" }}
                />
                <a
                  href={`http://localhost:1234/${url.shortUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`zipurl.com/${url.shortUrl}`}
                </a>
              </p>
              <p className="mb-1 p-1 ">
                <img
                  src={time}
                  className="card-img-top"
                  alt="Card Image"
                  style={{ width: "20px", height: "20px", marginRight: "12px" }}
                />
                {formatDate(url.createdAt)}
              </p>
              {url.password ? (
                <p className="mb-0 p-1">
                  <img
                    src={protec}
                    className="card-img-top"
                    alt="Card Image"
                    style={{
                      width: "25px",
                      height: "25px",
                      marginRight: "4px",
                    }}
                  />
                  Password Protected
                </p>
              ) : (
                <p className="mb-0">
                  <img
                    src={notpro}
                    className="card-img-top"
                    alt="Card Image"
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "4px",
                    }}
                  />
                  No Password.
                </p>
              )}
              <Link to={`/user/analysis/${url.shortUrl}`}>
                <button
                  className="btn  mb-2"
                  style={{
                    backgroundColor: "lightblue",
                    fontSize: "11px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Analysis
                </button>
              </Link>

              <button
                className="btn mb-2 mx-2"
                style={{
                  backgroundColor: "lightblue",
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                }}
                onClick={handleOpen}
              >
                Edit
              </button>

              <button
                className="btn  mb-2 "
                style={{
                  backgroundColor: "lightblue",
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                }}
                onClick={onSubmit}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <Dialog
          open={open}
          handler={handleOpen}
          size="md"
          style={{
            alignItems: "center",
            width: "700px",
            marginLeft: "1500px",
            position: "absolute",
            border: "1px solid black",
            justifyContent: "center",
            borderRadius: "10px",
          }}
        >
          <div className="modal-header mx-3 my-3">
            <h5 className="modal-title" id="exampleModalLabel">
              Edit ShortUrl
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={handleOpen}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <DialogBody>
            <div className="modal-body">
              <div
                className="card"
                style={{
                  backgroundColor: "transparent",
                  boxShadow: "none",
                  outline: "none",
                }}
              >
                <form>
                  <div className="row g-3 mb-2">
                    <div className="col-md-12">
                      <label
                        htmlFor="first_name"
                        className="form-label block mb-2 text-sm font-medium text-gray-900"
                      >
                        Original Url
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        className="form-control"
                        placeholder="John"
                        required
                        value={urlData.Original}
                        onChange={handleInputChange}
                        name="Original"
                      />
                    </div>
                    <div className="col-md-12">
                      <label
                        htmlFor="company"
                        className="form-label block mb-2 text-sm font-medium text-gray-900"
                      >
                        ShortUrl
                      </label>
                      <input
                        type="text"
                        id="company"
                        className="form-control"
                        placeholder="Flowbite"
                        name="ShortUrl"
                        value={urlData.ShortUrl}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-12">
                      <label
                        htmlFor="phone"
                        className="form-label block mb-2 text-sm font-medium text-gray-100"
                      >
                        Password
                      </label>
                      <span
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Password is hashed"
                      >
                        <i
                          className="bi bi-info-circle-fill ms-1"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        ></i>
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        className="form-control"
                        value={urlData.Password}
                        onChange={handleInputChange}
                        placeholder="123-45-678"
                        name="Password"
                        disabled
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </DialogBody>
          <DialogFooter>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger mx-4"
                onClick={() => {
                  handleOpen(url._id);
                  fetchUrlData(url._id);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-success"
                // onClick={() => handleUpdateMr(id)}
              >
                Update
              </button>
            </div>
          </DialogFooter>
        </Dialog>
      </div>
    </>
  );
};

export default UrlCard;

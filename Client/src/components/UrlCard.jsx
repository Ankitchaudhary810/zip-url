import React, { useRef } from "react";
import { Button } from "react-bootstrap";
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

const UrlCard = ({ url, onUrlDelete }) => {
  const qrCodeRef = useRef(null);
  const data = isAuthenticated();
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

  return (
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
                  style={{ width: "25px", height: "25px", marginRight: "4px" }}
                />
                Password Protected
              </p>
            ) : (
              <p className="mb-0">
                <img
                  src={notpro}
                  className="card-img-top"
                  alt="Card Image"
                  style={{ width: "30px", height: "30px", marginRight: "4px" }}
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
              className="btn  mb-2 mx-3"
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
    </div>
  );
};

export default UrlCard;

import React, { useEffect, useState } from "react";
import { isAuthenticated } from "../../Apicalls/auth";
import { Link, json } from "react-router-dom";
import { createShortUrl } from "../../Apicalls/url";
import ask from "../../../Assets/ask.png";
import { toast } from "react-toastify";
import background from "../../../Assets/background.jpg";
import UrlCard from "../UrlCard";
import { Spinner } from "react-bootstrap";
import No from "../../../Assets/no.png";
import "@radix-ui/themes/styles.css";
import { Dialog, Button, Flex, Text, TextField, Badge } from "@radix-ui/themes";
import { getShortUrlByUserId } from "../../Apicalls/url";
import ex from "../../../Assets/ex.png";
import axios from "axios";

const Dashboard = () => {
  const data = isAuthenticated();
  const token = data.token;
  const userId = data.user._id;

  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [urls, setUrls] = useState([]);
  const [reload, setrelod] = useState(false);
  const [isLoadingUrls, setIsLoadingUrls] = useState(false);
  const [first, setFirst] = useState(false);

  const [image, setImage] = useState(null);

  const isAnyFieldEmpty = originalUrl.trim() === "";

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
    };
    setFirst(true);
    try {
      createShortUrl(userId, token, urlData).then((res) => {
        if (res.msg === "Internal Server Error") {
          setFirst(false);
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
        } else if (res.msg === "Url is required") {
          setFirst(false);
          toast.error("Url is required", {
            position: "top-right",
            autoClose: 1900,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else if (
          res.msg === `${shortUrl} name already Exits please Take different One`
        ) {
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
          setShortUrl("");
          setPassword("");
          setrelod(!reload);
          return;
        }
      });
    } catch (error) {
      console.log("internal server error");
    }
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (file.size <= 2 * 1024 * 1024) {
        const sanitizedFileName = file.name.replace(/\s/g, "");

        setImage({
          file: file,
          name: sanitizedFileName,
        });
      }

      console.log("image: ", image);

      setImage({ file: file, name: file });

      console.log("Selected file:", file);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleBulkUpload = async (e) => {
    e.preventDefault();

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", image.file, image.name);

    try {
      const response = await axios.post(
        `http://localhost:1234/url/bulk-upload/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);
      if (response.status === 200) {
        toast.success("Bulk Link Upload is successful", {
          position: "top-center",
        });
      } else if (response.status === 400) {
        toast.error("Link With Same Name does not Uploaded In Db.", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Link With Same Name does not Uploaded In Db.", {
        position: "top-center",
      });
      console.error("Error uploading file:", error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const name = data.user.fullName;

  const handleUrlDeletion = (shortUrl) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url.shortUrl !== shortUrl));
  };

  return (
    <Dialog.Root>
      <div>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Bulk Link Upload Using Excel</Dialog.Title>
          <Dialog.Description size="2" mb="2">
            <Badge color="orange" mb={"1"}>
              Note.
            </Badge>
            <ul>
              <li>Excel Should Be In Proper Format.</li>
              <li>
                File Limit is{" "}
                <Badge color="orange" mb={"1"}>
                  3MB.
                </Badge>
              </li>
              <li>
                Excel Header Should Follow The
                <Badge color="red" mb={"0"}>
                  Key-Map
                </Badge>
              </li>
              <li>Customize Name Value Can be Blank Also.</li>
            </ul>
            <span style={{ cursor: "pointer", color: "black" }}>
              See File Format
            </span>
          </Dialog.Description>

          <img
            src={ex}
            width={560}
            height={110}
            style={{ border: "1px solid black", borderRadius: "3px" }}
          />

          <form action="" enctype="multipart/form-data">
            <Flex direction="column" gap="3">
              <label>
                <Text as="div" size="2" mb="1" mt={"3"} weight="bold">
                  Upload
                </Text>
                <input
                  type="file"
                  name="image"
                  accept=".xls, .xlsx"
                  onChange={handleFileChange}
                  style={{ marginBottom: "8px" }}
                />
              </label>
            </Flex>
          </form>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
            <Dialog.Close>
              <Button disabled={isUploading} onClick={handleBulkUpload}>
                {isUploading ? <Spinner size={20} /> : "Save"}
              </Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>

        <h1
          className="text-center display-6 mt-5 display-lg-4 display-md-5 display-sm-6 display-xs-7"
          autoComplete="off"
        >
          <span>{name}</span>'s Dashboard
        </h1>

        <div
          className="container container-fluid col-md-6 offset-sm-3 text-left p-5"
          style={{
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "13px",
            boxShadow: "8px 8px 0px -1px rgba(0,0,0,0.75)",
          }}
        >
          <div className="text-center mb-4 ">
            <h4>
              Create New <span style={{ color: "#EFAA75" }}>Short-Url</span>
            </h4>
          </div>

          <div className="form-floating mb-3 ">
            <input
              type="url"
              className="form-control"
              placeholder="https://zipurl.com/api/create/url/:userId"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
            <label placeholder="https://zipurl.com/api/create/url/:userId">
              Url
            </label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="floatingInput"
              autoComplete="off"
              placeholder="Password"
              value={shortUrl}
              onChange={(e) => setShortUrl(e.target.value)}
            />
            <label htmlFor="floatingPassword">Customize name </label>
            <span style={{ fontSize: "14px" }}>
              Customize name (Optinal)
              <img
                src={ask}
                className="card-img-top "
                alt="Card Image"
                style={{ width: "15px", height: "15px", marginLeft: "4px" }}
                title="This name is used to make the long URL more memorable"
              />
            </span>
          </div>

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingInput"
              autoComplete="off"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="floatingInput">Password</label>
            <span style={{ fontSize: "14px" }}>
              Password is for security(Optinal)
              <img
                src={ask}
                className="card-img-top "
                alt="Card Image"
                style={{ width: "15px", height: "15px", marginLeft: "4px" }}
                title="Password is used to provide a secure Redirection."
              />
            </span>
          </div>

          <div className="col-md-6 offset-sm-3 text-left d-flex justify-content-center">
            <button
              className="btn btn-lg btn-primary mt-2 text-dark"
              style={{ backgroundColor: "orange" }}
              onClick={onSubmit}
            >
              {first ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm mx-1"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Processing..
                </>
              ) : (
                <>Get ShortUrl</>
              )}
            </button>
          </div>
          <Dialog.Trigger>
            <Button color="jade" mb={2}>
              Bulk Upload
            </Button>
          </Dialog.Trigger>
        </div>

        <div
          className="container mt-5 "
          style={{
            height: "1010px",
            backgroundColor: "white",
            border: "1px solid black",
            borderRadius: "13px",
            boxShadow: "8px 8px 0px -1px rgba(0,0,0,0.75)",
            marginBottom: "30px",
          }}
        >
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
                    style={{
                      width: "100px",
                      height: "100px",
                      marginRight: "12px",
                    }}
                  />
                </div>
              ) : (
                urls.map((url) => (
                  <UrlCard
                    url={url}
                    key={url._id}
                    onUrlDelete={handleUrlDeletion}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog.Root>
  );
};

export default Dashboard;

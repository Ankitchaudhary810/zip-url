import { useEffect, useState, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import emails from "../../Assets/emails.png";
import error from "../../Assets/error.png";

const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:1234/api/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log("data:", data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  const timeout = setTimeout(() => {
    window.location.replace("http://localhost:5173/signin");
  }, 2500);

  return (
    <Fragment>
      {validUrl ? (
        <div className="text-center m-5">
          <img src={emails} alt="Email" width="100px" height="100px" />
          <h1>Email verified successfully</h1>
          {/* <Link to="/signin">
            <button className="btn btn-danger">Click Here</button>
          </Link> */}
          <p>Redirecting....</p>
        </div>
      ) : (
        <div className="text-center m-5">
          <img src={error} alt="Email" width="100px" height="100px" />
          <h1 className="text-center mt-4">404 Not Found</h1>
        </div>
      )}
    </Fragment>
  );
};

export default EmailVerify;

import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Logo from "../../Assets/zipurl-low-resolution-logo-color-on-transparent-background.svg";
import { authenticate, signin } from '../Apicalls/auth';
import { toast } from 'react-toastify';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [didRedirect, setDidRedirect] = useState(false);

  const isAnyFieldEmpty = email.trim() === '' || password.trim() === '';

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await signin({ email, password });

      if (data.msg === "User Not Found") {
        setError("Please Check Your Email. Not Found");
      } else if (data.msg === "Password is incorrect...") {
        setError("Password is not Correct");
      } else if (data.msg === "Email not verified") {
        setError("Email Is Not Verified... Put Correct Email");
      } else {
        authenticate(data, () => {
            setDidRedirect(true);
            toast.success(`Welcome Back... ${data.user.fullName}`, {
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
      }
    } catch (error) {
      console.log("Signin request failed");
    }

    setIsLoading(false);
  };

  const ErrorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid row mt-4">
      <div className="col-md-6 offset-sm-3 text-left">
        <h1 className="col-md-6 offset-sm-3 text-left display-6 text-nowrap" style={{ whiteSpace: 'nowrap' }}>
          Login to <span><img src={Logo} alt="" style={{ width: "100px" }} /></span>
        </h1>
        {ErrorMessage()}

        <div className="form-floating mt-2">
          <input
            type="email"
            className="form-control"
            id="floatingEmail"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className="form-floating mt-2">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <p className="text-center text-muted mt-3 mb-1  ">
          New User an account?{' '}
          <Link to="/signup" className="fw-bold text-body">
            <u>Create Account</u>
          </Link>
        </p>

        <div className="col-md-6 offset-sm-3 text-left d-flex justify-content-center">
          <button
            className="btn btn-lg btn-primary mt-3 text-dark"
            style={{ backgroundColor: "orange" }}
            onClick={onSubmit}
            disabled={isAnyFieldEmpty || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-3 text-dark" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
        {didRedirect && <Navigate to="/" />}
      </div>
    </div>
  );
};

export default Signin;

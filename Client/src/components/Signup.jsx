import React, { useState } from 'react';
import { signup } from '../Apicalls/auth';
import { Link } from 'react-router-dom';
import Logo from "../../Assets/zipurl-low-resolution-logo-color-on-transparent-background.svg";
import { toast } from 'react-toastify';


const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Cpassword, setCPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isAnyFieldEmpty = fullName.trim() === '' || email.trim() === '' || password.trim() === '';
  const isPasswordMatch = password === Cpassword;

  const validateEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordMatch) {
      toast.error("Passwords don't match", {
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
    }
    if (!validateEmail(email)) {
      toast.error('Invalid email address', {
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
    }
    setIsLoading(true);

    // Signup Request
    signup({ fullName, email, password }).then((data) => {
      console.log({ data })
      if (data.msg === "An Email is sent to your account please verify") {
        setIsLoading(false);
        toast.success(`Verification Link is sent to ${email} `, {
          position: "top-right",
          autoClose: 2200,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setFullName('');
        setEmail('');
        setPassword('');
        setCPassword('');
      }
      else if (data.msg === "Email already exists. Please use a different email address.") {
        setIsLoading(false);
        toast.warn('User Already Exists!. Check Email...', {
          position: "top-right",
          autoClose: 1900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setSuccess(false);
      }
      else {
        setIsLoading(false);
        toast.warn(`"An error occurred during signup. Please try again later. `, {
          position: "top-right",
          autoClose: 1900,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });
  };

  const successMessage = () => {
    if (success) {
      return (
        <div className="row">
          <div className="col-md-6 offset-sm-3 text-left d-flex justify-content-center">
            <div className="alert alert-success text-nowrap ">
              Verification Link is Send to {email}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  {
    isLoading && (
      <div className="text-center mt-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }



  const ErrorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left d-flex justify-content-center">
          <div className="alert alert-danger text-nowrap" style={{ display: error ? '' : 'none' }}>
            {error}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid row">
      <div className="col-md-6 offset-sm-3 text-left ">
        <h1 className="col-md-6 offset-sm-3 text-left display-6 text-nowrap" style={{ whiteSpace: 'nowrap' }}>
          Sign up to <span><img src={Logo} alt="" style={{ width: "130px" }} /></span>
        </h1>
        {successMessage()}
        {ErrorMessage()}

        <div className={`form-floating ${isPasswordMatch ? '' : 'has-danger'}`}>
          <input
            type="text"
            className="form-control"
            id="floatingName"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <label htmlFor="floatingName">Full Name</label>
        </div>

        <div className={`form-floating mt-2 ${isPasswordMatch ? '' : 'has-danger'}`}>
          <input
            title="Valid Email is Require"
            type="email"
            className="form-control"
            id="floatingEmail"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="floatingEmail">Email address</label>
        </div>

        <div className={`form-floating mt-1  ${isPasswordMatch ? '' : 'has-danger'}`}>
          <input
            type="password"
            className="form-control"
            title="Password should match.. Otherwise Button will disable"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <small className="form-text text-muted " style={{ fontSize: "12px" }}>Password should be at least 6 characters long.</small>

        <div className={`form-floating mt-1 ${isPasswordMatch ? '' : 'has-danger'}`}>
          <input
            type="password"
            className="form-control"
            id="floatingCPassword"
            placeholder="Repeat Password"
            value={Cpassword}
            onChange={(e) => setCPassword(e.target.value)}
          />
          <label htmlFor="floatingCPassword">Repeat Password</label>
        </div>
        <small className="form-text text-muted " style={{ fontSize: "12px" }}>Password Must Match.. Otherwise button will be disable.</small>

        <p className="text-center text-muted mt-1 mb-0">
          Have already an account?{' '}
          <Link to="/signin" className="fw-bold text-body">
            <u>Login here</u>
          </Link>
        </p>

        <div className="col-md-6 offset-sm-3 text-left d-flex justify-content-center">
          <button
            className="btn btn-lg btn-primary mt-2"
            style={{ backgroundColor: "orange", color: "black" }}
            onClick={onSubmit}
            disabled={isAnyFieldEmpty || !isPasswordMatch || isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                Loading...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;

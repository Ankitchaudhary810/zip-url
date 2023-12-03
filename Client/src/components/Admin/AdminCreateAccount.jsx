import React, { useState  } from 'react';
import { AdminSignup } from '../../AdminApiCalls/AdminAuth';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom';

const AdminCreateAccount = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    AdminSignup({fullName, email , password}).then((data) => {
      console.log({data});
      if(data.msg === "Account is Created"){
        setIsLoading(false);
        toast.success(`Account is Created`, {
          position: "top-right",
          autoClose: 2200,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          });
      }else if(data.msg === "User is already Exists"){
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
      }else {
        
      }

    })
  };

  return (
    <div style={containerStyle}>
      <div className="card w-md-100 text-white" style={{ backgroundColor: "#1E1E1F" }}>
        <div className="card-body">
          <h1 className="card-title">Admin Account</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <hr style={{width:"100%"}}/>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
              <hr style={{width:"100%"}}/>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
              <hr style={{width:"100%"}}/>
            <button type="submit" className="btn btn-primary" style={{backgroundColor:"#172627"}}>

            {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              
            </>
          ) : (
            "Submit"
          )}
            </button>
            <p>Have an Account? <Link to="/admin/login" className="fw-bold text-white">
            <u>Login here</u>
          </Link></p>
            
          </form>
        </div>
      </div>
    </div>
  );
};

const containerStyle = {
  backgroundColor: "#000000",
  color: "white",
  width: "100%",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

export default AdminCreateAccount;

import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { isAuthenticated, signout, updateUserName, updateUserPassword } from '../../Apicalls/auth';
import { toast } from 'react-toastify';
import Spinner from 'react-bootstrap/Spinner'; 
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isLoading, setIsLoading] = useState(false);
  const history = useNavigate();

  const [fullName, setFullName] = useState('');
  const [loadName, setLoadName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const boxStyle = {
    boxShadow: "rgba(255, 255, 255, 0.2) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.9) 0px 0px 0px 1px",
    outLine: "none"
  };

  const data = isAuthenticated();
  const email = data.user.email;
  const Name = data.user.fullName;
  const token = data.token;
  const userId = data.user._id;

  useEffect(() => {
    setLoadName(Name);
    setFullName(Name);
  }, [])


  const handleNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmNewPasswordChange = (event) => {
    setConfirmNewPassword(event.target.value);
  };

  const handleUpdateName = (event) => {
    event.preventDefault();

    if (Name === fullName) {
      toast.warn('Name is Already Same', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    updateUserName(fullName, token, userId).then(res => {
      console.log("name res: ", res);


      if (res.msg === "Name is Required") {
        toast.error("Name is Required", {
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

      } else if (res.msg === "Name is Updated") {
        toast.success(`Name is Updated. `, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        signout(() => {
          history('/signin');
          toast.success('Please Login to See Changes', {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        });
      }
      else if (res.msg === "Internal Server Error") {
        toast.error("Internal Server Error", {
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
    })

  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    setIsLoading(true);

    if (confirmNewPassword !== newPassword) {
      toast.error("Password should match..", {
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

    updateUserPassword(currentPassword, newPassword, token, userId).then(data => {
      console.log(data.msg);
      if (data.msg === "Current Password is Required") {
        toast.error("Current Password is Required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);
      } else if (data.msg === "New Password is Required") {
        toast.error("New Password is Required", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);

      } else if (data.msg === "User not found") {
        toast.error("You are not found", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);

      } else if (data.msg === "Incorrect current password") {
        toast.error("Current password is Not Correct", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);

      } else if (data.msg === "Password updated successfully") {
        toast.success("Password Updated.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);

        setConfirmNewPassword("");
        setCurrentPassword("");
        setNewPassword("");
      } else {
        toast.error("Internal server error", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setIsLoading(false);
        setConfirmNewPassword("");
        setCurrentPassword("");
        setNewPassword("");
      }
    })

  };

  return (
    <div className='mb-5'>
      <h3 className='text-center mt-5 '>User Profile Page</h3>
      <div className="container mt-4 p-3">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="card" style={boxStyle}>
              <div className="card-body mx-3">
                <h5 className="card-title mb-3 ">Profile</h5>

                <form>
                  <div className="mb-3 ">
                    <label htmlFor="name" className="form-label">Display name</label>
                    <input type="text" className="form-control" id="name" value={fullName} onChange={handleNameChange} />
                  </div>
                  <div className="mb-3">
                    <button type="button" className="btn bg-dark text-white" onClick={handleUpdateName}>Update Name</button>
                  </div>

                  <div className="mb-3 mt-5">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="email" disabled placeholder={`${email}                         Verified`} />
                  </div>

                  <div className="mb-3 mt-5">
                    <h6>Security & Authentication</h6>
                  </div>
                  <div className="mb-2">
                    <h6>Change Password </h6>
                  </div>
                  <div className="mb-2 " style={{ fontSize: "12px" }}>
                    <p>You will Be required to login after changing your password.</p>
                  </div>

                  <div className="mb-3 mt-5">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input type="password" className="form-control" id="currentPassword" value={currentPassword} onChange={handleCurrentPasswordChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={handleNewPasswordChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                    <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={handleConfirmNewPasswordChange} />
                  </div>
                  <div className="mb-3">
                    <button type="button" className="btn bg-danger text-white" onClick={handleChangePassword} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            className='mx-2'
                            aria-hidden="true"
                          />
                          Updating...
                        </>
                      ) : (
                        'Change Password'
                      )}

                    </button>
                  </div>

                  <div className="mb-3 mt-5">
                    <button
                      type="button"
                      className="btn btn-white border-danger text-danger"
                      onClick={handleShow}
                    >
                      Delete Account
                    </button>
                  </div>

                  <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                  >
                    <Modal.Header closeButton className='bg-dark text-white'>
                      <Modal.Title>Confirm Account Deletion</Modal.Title>
                    </Modal.Header>

                    <Modal.Body className='bg-dark text-white'>
                      Are you sure you want to delete your account? This action cannot be undone.
                    </Modal.Body>
                    <Modal.Footer className='bg-dark text-white'>
                      <Button variant="secondary" onClick={handleClose}>
                        Close
                      </Button>
                      <button
                        type="button"
                        className="btn btn-white border-danger text-danger"
                        onClick={handleShow}
                      >
                        Delete Account
                      </button>
                    </Modal.Footer>
                  </Modal>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;






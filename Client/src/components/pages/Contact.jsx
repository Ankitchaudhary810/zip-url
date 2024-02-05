import React, { useState } from "react";
import contact from "../../../Assets/contact.jpg";
import "./Contact.css";
import { z } from "zod";
import { toast } from "react-toastify";

const formSchema = z.object({
  FullName: z.string().min(4, "Name must be at least 4 characters long"),
  Email: z.string().email({ message: "Invalid email address" }),
  Message: z.string().min(20, "Message should alteast 20 words"),
});

const Contact = () => {
  const [data, setData] = useState({
    FullName: "",
    Email: "",
    Message: "",
  });

  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      data.Email.length === 0 ||
      data.FullName.length === 0 ||
      data.Message.length === 0
    ) {
      toast.warn("Fill Whole Form", {
        position: "top-center",
      });
      return;
    }

    setLoading(true);

    const response = await fetch("http://localhost:1234/api/feedback-form", {
      method: "Post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });
    setLoading(false);
    toast.success("Form Submited..", {
      position: "top-center",
    });
    setData({
      FullName: "",
      Email: "",
      Message: "",
    });

    console.log(response.status);
  };

  return (
    <div className="container mt-5 p-5">
      <h3 className="mx-3 font-bold">
        <b>Let's Talk....</b>
      </h3>

      <div className="row">
        <div className="col-md-6 ">
          <form className="mx-3 my-3" onSubmit={handleSubmit}>
            <div className="form-row">
              <p>
                Feel free to drop us a message! We'd love to hear from you and
                assist with any questions or inquiries you may have.
              </p>
              <div className="col my-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Full Name"
                  name="FullName"
                  value={data.FullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col my-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  name="Email"
                  value={data.Email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 my-4">
                <textarea
                  className="form-control"
                  placeholder="Your Message"
                  rows={"10"}
                  cols={"25"}
                  name="Message"
                  value={data.Message}
                  onChange={handleInputChange}
                ></textarea>
                {/* <p className="text-end">Max 300 Words</p> */}
              </div>
              <button className="btn p-2 btn-primary">
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm mx-4"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </form>
        </div>
        <div className="col-md-6">
          <img
            src={contact}
            className="img-fluid bounce"
            alt="Contact"
            // style={{ border: "1px solid black", borderRadius: "13px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;

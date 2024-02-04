import React from "react";

const Contact = () => {
  return (
    <div className="container mt-5">
      <h3 className="mx-3">Get In Touch....</h3>
      <form className="mx-3 my-3 w-50">
        <div class="form-row">
          <div class="col my-4">
            <input type="text" class="form-control" placeholder="Name" />
          </div>
          <div class="col my-4">
            <input type="text" class="form-control" placeholder="Last name" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default Contact;

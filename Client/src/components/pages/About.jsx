import React from "react";
import ankit from "../../../Assets/ankit1.jpeg";
const About = () => {
  return (
    <div>
      <div className="container mt-5">
        <div className="text-center mb-4">
          <img
            src={ankit} // Replace with the URL of your profile photo
            alt="Profile Photo"
            className="img-fluid rounded"
            style={{
              width: "200px",
              height: "220px",
              border: "1px solid black",
            }}
          />
        </div>
        <h1 className="mb-4">About Me</h1>
        <p>
          Hi there! I'm Ankit Chaudhary, a Full Stack developer dedicated to
          creating awesome projects. This is a project that I've been working
          on, and I'm excited to share it with you.
        </p>
        <p>
          Feel free to explore the features and functionality. If you have any
          suggestions or issues, I'd love to hear from you!
        </p>
        <div className="text-center mt-4">
          <a
            href="https://github.com/Ankitchaudhary810/zip-url"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark"
          >
            Rate on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;

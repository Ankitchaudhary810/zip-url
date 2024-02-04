import React from "react";
import ankit from "../../../Assets/ankit1.jpeg";
const About = () => {
  return (
    <div>
      <div className="container mt-2">
        <div className="text-center mb-4">
          <img
            src={ankit} // Replace with the URL of your profile photo
            alt="Profile Photo"
            className="img-fluid rounded"
            style={{
              width: "220px",
              height: "220px",
              border: "1px solid black",
            }}
          />
        </div>
        <div className="text-center mt-4">
          <a
            href="https://twitter.com/Ankit__tw"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark mx-3 bg-primary "
          >
            <b>Follow On</b>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              class="bi bi-twitter mx-1"
              viewBox="0 0 16 16"
            >
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
            </svg>
          </a>

          <a
            href="https://github.com/Ankitchaudhary810/zip-url"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark mx-3"
          >
            Rate on{" "}
            <span className="mx-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-github"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/ankit-chaudhary-a08ba1239/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-dark mx-3 bg-danger"
          >
            Connect On{" "}
            <span className="mx-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                class="bi bi-linkedin"
                viewBox="0 0 16 16"
              >
                <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
              </svg>
            </span>
          </a>
        </div>
        <h1 className="mb-2">About Me</h1>

        <p>
          Hi there! I'm Ankit Chaudhary, a Full Stack developer dedicated to
          creating awesome projects. This is a project that I've been working
          on, and I'm excited to share it with you.
        </p>
        <div class="container">
          <div class="row">
            <div class="col-md-6 ">
              <div class="flex d-flex flex-column mx-0">
                <ul>
                  <p>CLIENT SIDE</p>
                  <li> Dynamic Password Protection🔑</li>
                  <li> User Authentication JWT Token</li>
                  <li> Protected Routes</li>
                  <li> Qr Code Generation.</li>
                  <li> Bulk Link Upload Using Excel.</li>
                  <li> Responsive UI </li>
                  <li> Detailed Analytics Page.</li>
                  <li> Edit, Delete Specific Url.</li>
                </ul>
              </div>
            </div>
            <div class="col-md-6">
              <div class="flex d-flex flex-column">
                <ul>
                  <p>ADMIN SIDE</p>
                  <li> Admin authentication JWT Token.</li>
                  <li> Admin Dashboard.</li>
                  <li> All User List and Their URL's.</li>
                  <li> Admin Can Delete The Specific User.</li>
                  <li> User Report</li>
                  <li> User Filter.</li>
                  <li> Report Generation In Admin Side. </li>
                  <li> All User Link Download In Excel Format. </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <p>
          Feel free to explore the features and functionality. If you have any
          suggestions or issues, I'd love to hear from you!
        </p>
      </div>
    </div>
  );
};

export default About;

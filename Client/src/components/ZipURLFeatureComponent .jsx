import React from 'react';
import { FaLock, FaChartLine, FaGlobe } from 'react-icons/fa';

const ZipURLFeatureComponent = () => {
  return (
    <div className="container text-center">
      <h2 className="mb-4">Unlock the Power of ZipURL</h2>

      <div className="row justify-content-center">
        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <FaLock className="feature-icon" />
              <h5 className="card-title">Securely Connect</h5>
              <p className="card-text">
                ZipURL provides password protection for shortened URLs, ensuring secure access to your content.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <FaChartLine className="feature-icon" />
              <h5 className="card-title">Track Engagement</h5>
              <p className="card-text">
                Advanced tracking features allow you to monitor clicks, timestamps, and locations for valuable insights.
              </p>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <FaGlobe className="feature-icon" />
              <h5 className="card-title">Global Connectivity</h5>
              <p className="card-text">
                Reach and engage audiences worldwide with ZipURL's seamless global connectivity.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-lg mt-4">Unleash the Potential</button>
    </div>
  );
};

export default ZipURLFeatureComponent;

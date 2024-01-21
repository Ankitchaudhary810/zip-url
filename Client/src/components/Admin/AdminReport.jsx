import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";

import {
  AdminReports,
  AdminIsAuthenticated,
} from "../../AdminApiCalls/AdminAuth";
import { Link } from "react-router-dom";

const AdminReport = () => {
  const admin = AdminIsAuthenticated();
  const adminId = admin.admin._id;
  const admintoken = admin.admintoken;
  const [Reports, setReports] = useState([]);
  const [loading, setIsLoading] = useState(false);

  const [userData, setUserData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [filterByName, setFilterByName] = useState("");
  const [filterByEmail, setFilterByEmail] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Updated filteredData array to include timestamp filter

  // const filteredData = userData.filter(
  //   (data) =>
  //     data.fullName.toLowerCase().includes(filterByName.toLowerCase()) ||
  //     data.email.toLowerCase().includes(filterByEmail.toLowerCase()) ||
  //     (fromDate &&
  //       toDate &&
  //       new Date(data.timestamp).getTime() >= new Date(fromDate).getTime() &&
  //       new Date(data.timestamp).getTime() <= new Date(toDate).getTime())
  // );

  // const handleFilterSubmit = () => {
  //   const filteredData = userData.filter(
  //     (data) =>
  //       fromDate &&
  //       toDate &&
  //       new Date(data.timestamp).getTime() >= new Date(fromDate).getTime() &&
  //       new Date(data.timestamp).getTime() <= new Date(toDate).getTime()
  //   );
  //   setUserData(filteredData);
  // };

  const filterdData = userData.filter((user) => {
    const NameCondition =
      filterByName.trim() === "" || user.fullName.includes(filterByName.trim());

    const EmailCondition =
      filterByEmail.trim() === "" || user.email.includes(filterByEmail.trim());

    return NameCondition || EmailCondition;
  });
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = () => {
    setIsLoading(true);
    AdminReports(admintoken, adminId).then((data) => {
      setReports(data);

      setIsLoading(false);
    });

    fetch("http://localhost:1234/admin/admin-reports", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setCsvData(data);
      });

    console.log({ userData });
  };

  const handleResetFilters = () => {
    setFilterByName("");
    setFilterByEmail("");
    setFromDate("");
    setToDate("");
    fetchReport();
  };

  const headers = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Original Url", key: "originalUrl" },
    { label: "ShortUrl", key: "shortUrl" },
    { label: "Timestamp", key: "timestamp" },
    { label: "User Agent", key: "userAgent" },
    { label: "Browser", key: "userBroswer" },
    { label: "Os", key: "os" },
    { label: "platform", key: "platform" },
    { label: "city", key: "city" },
    { label: "region", key: "region" },
    { label: "country_name", key: "country_name" },
    { label: "org", key: "org" },
  ];

  return (
    <>
      <div style={containerStyle}>
        {loading === true ? (
          <h3>Loading......</h3>
        ) : (
          <>
            {/* <div className="">
              <Link to="/admin/dashboard">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#172627" }}
                >
                  Back
                </button>
              </Link>
            </div> */}
            <div className="card mt-2 mb-5 w-100" style={cardStyle}>
              <Link to="/admin/dashboard">
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ backgroundColor: "#172627", marginLeft: "20px" }}
                >
                  Back
                </button>
              </Link>
              <h2 className="text-center bg-orange-500 ">Admin Dashboard</h2>
              <CSVLink
                data={csvData}
                headers={headers}
                filename={"data.csv"}
                style={{
                  backgroundColor: "#0ec73f",
                  width: "100px",
                  color: "white",
                  marginLeft: "20px",
                  borderRadius: "2px",
                  textDecoration: "none",
                  display: "inline-block",
                  marginBottom: "20px",
                }}
              >
                <p
                  style={{
                    textAlign: "center",
                    marginTop: "2px",
                    marginBottom: "5px",
                  }}
                >
                  Import Csv
                </p>
              </CSVLink>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto auto auto auto",
                  gap: "120px",
                  marginBottom: "30px",
                }}
              >
                <div className="container">
                  <div className="row">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter By Name"
                        value={filterByName}
                        onChange={(e) => setFilterByName(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Filter By Email"
                        value={filterByEmail}
                        onChange={(e) => setFilterByEmail(e.target.value)}
                      />
                    </div>
                    From
                    <div className="col">
                      <input
                        type="date"
                        className="form-control"
                        name=""
                        id=""
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                    </div>
                    To
                    <div className="col">
                      <input
                        type="date"
                        className="form-control"
                        name=""
                        id=""
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                    <div className="col">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          handleFilterSubmit();
                        }}
                      >
                        Submit
                      </button>
                    </div>
                    <div className="col">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={handleResetFilters}
                      >
                        Reset Filter
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <table className="table table-success table-striped rounded">
                <thead>
                  <tr>
                    <th scope="col">Sr.</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Original Url</th>
                    <th scope="col">ShortUrl</th>
                    <th scope="col">timestamp</th>
                    <th scope="col">User Agent</th>
                    <th scope="col">Browser</th>
                    <th scope="col">Os</th>
                    <th scope="col">Platform</th>
                    <th scope="col">City</th>
                    <th scope="col">Region</th>
                    <th scope="col">Country_name</th>
                    <th scope="col">Org</th>
                  </tr>
                </thead>
                <tbody>
                  {filterdData &&
                    filterdData.map((data, index) => (
                      <tr key={index}>
                        <th scope="row w-100">{index + 1}</th>
                        <td>{data.fullName}</td>
                        <td>{data.email}</td>
                        <td>
                          <a
                            href={data.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {data.originalUrl}
                          </a>
                        </td>
                        <td>{data.shortUrl}</td>
                        <td>{new Date(data.timestamp).toDateString()}</td>
                        <td>{data.userAgent}</td>
                        <td>{data.userBroswer}</td>
                        <td>{data.os}</td>
                        <td>{data.platform}</td>
                        <td>{data.city}</td>
                        <td>{data.region}</td>
                        <td>{data.country_name}</td>
                        <td>{data.org}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const boxStyle = {
  boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.85)",
  WebkitBoxShadow: "0px 1px 5px 0px rgba(0,0,0,0.85)",
  MozBoxShadow: "0px 1px 5px 0px rgba(0,0,0,0.85)",
  outline: "none",
};

const containerStyle = {
  backgroundColor: "#000000",
  color: "white",
  width: "2000%",
  minHeight: "100vh",
  display: "flex",

  justifyContent: "center",
  alignItems: "center",
  maxWidth: "2000px",
};

const cardStyle = {
  backgroundColor: "#1D1D1E",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "2000px",
};

export default AdminReport;

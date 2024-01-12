import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getUrlInfoByShortUrl } from "../../Apicalls/url";
import Chart from "chart.js/auto";
import { InfinitySpin } from "react-loader-spinner";
import "./analytics.css";

const Analytics = () => {
  const params = useParams();
  const [clicks, setClicks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [clickData, setClickData] = useState([]);
  const [createdAt, setCreatedAt] = useState("");
  const [password, setPassword] = useState(false);
  const [mostUsedOs, setMostUsedOs] = useState("");
  const [osDistribution, setOsDistribution] = useState({});
  const [mostVisitedCity, setMostVisitedCity] = useState("");
  const [mostUsedBrowser, setMostUsedBrowser] = useState("");
  const [mostUsedPlatform, setMostUsedPlatform] = useState("");
  const [mostVisitedCountry, setMostVisitedCountry] = useState("");

  const processClicksData = (clicksData) => {
    const countryClicks = clicksData.reduce((acc, curr) => {
      const country = curr.country_name;
      if (country) {
        acc[country] = (acc[country] || 0) + 1;
      }
      return acc;
    }, {});

    // Sort the countries by click count in descending order
    const sortedCountries = Object.entries(countryClicks).sort(
      (a, b) => b[1] - a[1]
    );

    // Get the top 5 countries and the sum of clicks for the rest
    let topCountries = sortedCountries.slice(0, 5);
    // let otherClicks = sortedCountries.slice(5).reduce((sum, [_, clicks]) => sum + clicks, 0);

    // Add "Other" category to the list
    // topCountries.push(['Other', otherClicks]);

    return topCountries;
  };

  const createDoughnutChart = (clicksData) => {
    const ctx = document.getElementById("doughnutChart").getContext("2d");
    const topCountries = processClicksData(clicksData);

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: topCountries.map(([country, _]) => country),
        datasets: [
          {
            data: topCountries.map(([_, clicks]) => clicks),
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#ffce56",
              "#4bc0c0",
              "#9966ff",
            ],
          },
        ],
      },
      options: {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: true, // Maintain aspect ratio
        plugins: {
          title: {
            display: true,
            text: "Top Countries by Clicks", // Set your desired title here
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    });
  };

  const createLineChart = (clickData) => {
    const ctx = lineChartRef.current.getContext("2d");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyClicks = Array.from({ length: 12 }, (_, monthIndex) => {
      const monthName = months[monthIndex];
      const clicksInMonth = clickData.filter(
        (click) => new Date(click.timestamp).getMonth() === monthIndex
      );
      return clicksInMonth.length;
    });

    new Chart(ctx, {
      type: "line",
      data: {
        labels: months,
        datasets: [
          {
            label: "Click Count",
            data: monthlyClicks,
            fill: false,
            // borderColor: '#ff6384',
            pointStyle: "circle", // Set the point style to circle
            pointBackgroundColor: "black", // Set the point color to black
            pointRadius: 5, // Set the point radius
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Clicks Over Time",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Months",
            },
          },
          y: {
            beginAtZero: true,
            stepSize: 1,
            title: {
              display: true,
              text: "Number of Clicks",
            },
          },
        },
      },
    });
  };

  const createPlatformPieChart = (platformData) => {
    const ctx = platformChartRef.current.getContext("2d");
    const platforms = Object.keys(platformData);
    const platformClicks = Object.values(platformData);

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: platforms,
        datasets: [
          {
            data: platformClicks,
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#ffce56",
              "#4bc0c0",
              "#9966ff",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Top Most Used Platform",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    });
  };

  const createOsPieChart = (osData) => {
    const ctx = osChartRef.current.getContext("2d");
    const osLabels = Object.keys(osData);
    const osClicks = Object.values(osData);

    new Chart(ctx, {
      type: "pie",
      data: {
        labels: osLabels,
        datasets: [
          {
            data: osClicks,
            backgroundColor: [
              "#ff6384",
              "#36a2eb",
              "#ffce56",
              "#4bc0c0",
              "#9966ff",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Operating System Distribution",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const data = await getUrlInfoByShortUrl(params.shorturl);
        setClicks(data.msg.clicks.length);
        setCreatedAt(data.msg.createdAt);
        setPassword(data.msg.password);

        // Process clicks data to find most used browser, OS, city, and country
        if (data.msg.clicks.length > 0) {
          const browsers = data.msg.clicks.reduce((acc, curr) => {
            acc[curr.browser] = (acc[curr.browser] || 0) + 1;
            return acc;
          }, {});

          const operatingSystems = data.msg.clicks.reduce((acc, curr) => {
            acc[curr.os] = (acc[curr.os] || 0) + 1;
            return acc;
          }, {});

          const cities = data.msg.clicks.reduce((acc, curr) => {
            acc[curr.city] = (acc[curr.city] || 0) + 1;
            return acc;
          }, {});

          const countries = data.msg.clicks.reduce((acc, curr) => {
            acc[curr.country_name] = (acc[curr.country_name] || 0) + 1;
            return acc;
          }, {});

          const platforms = data.msg.clicks.reduce((acc, curr) => {
            acc[curr.platform] = (acc[curr.platform] || 0) + 1;
            return acc;
          }, {});

          if (data.msg.clicks.length > 0) {
            createDoughnutChart(data.msg.clicks);
            setClickData(data.msg.clicks);
            createLineChart(data.msg.clicks);
            createPlatformPieChart(platforms);
            setOsDistribution(operatingSystems);
            createOsPieChart(operatingSystems);
          }
          setMostUsedBrowser(
            Object.keys(browsers).reduce((a, b) =>
              browsers[a] > browsers[b] ? a : b
            )
          );
          setMostUsedOs(
            Object.keys(operatingSystems).reduce((a, b) =>
              operatingSystems[a] > operatingSystems[b] ? a : b
            )
          );
          setMostVisitedCity(
            Object.keys(cities).reduce((a, b) =>
              cities[a] > cities[b] ? a : b
            )
          );
          setMostVisitedCountry(
            Object.keys(countries).reduce((a, b) =>
              countries[a] > countries[b] ? a : b
            )
          );
          setMostUsedPlatform(
            Object.keys(platforms).reduce((a, b) =>
              platforms[a] > platforms[b] ? a : b
            )
          );
        }
      } catch (error) {
        console.log("Error: ", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.shorturl]);

  const lineChartRef = useRef(null);
  const platformChartRef = useRef(null);
  const osChartRef = useRef(null);

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString()
    : "";
  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleTimeString()
    : "";

  const boxStyle = {
    boxShadow: "0px 1px 5px 0px rgba(0,0,0,0.85)",
    WebkitBoxShadow: "0px 1px 5px 0px rgba(0,0,0,0.85)",
    MozBoxShadow: "0px 1px 5px 0px rgba(0,0,0,0.85)",
    outline: "none",
  };

  if (loading) {
    return (
      <h3 className="text-center mt-5">
        <InfinitySpin width="200" color="black" />
      </h3>
    );
  }

  return (
    <>
      <div className="grey-bg container-fluid mt-5 ">
        {/* First Row */}
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="bi bi-people-fill primary font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right bg-orange-600">
                      <h3>{clicks}</h3>
                      <span>No.Of Clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-speech warning font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{formattedTime}</h3>
                      <span>Time</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-graph success font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{formattedDate}</h3>
                      <span>Date of Creation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-pointer danger font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{password ? "Password Protected" : "No Password"}</h3>
                      <span>Password</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Second row */}

        <div className="row mt-5">
          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="bi bi-people-fill primary font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{mostUsedBrowser}</h3>
                      <span>Most Used Browser</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-speech warning font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{mostUsedOs}</h3>
                      <span>Most Used Os</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-graph success font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{mostVisitedCity}</h3>
                      <span>Most visited City</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-pointer danger font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{mostVisitedCountry}</h3>
                      <span>Most Visited Country</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* {Thired row} */}

        <div className="row mt-5">
          <div className="col-xl-3 col-sm-6 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="media d-flex">
                    <div className="align-self-center">
                      <i className="icon-pointer danger font-large-2 float-left"></i>
                    </div>
                    <div className="media-body text-right">
                      <h3>{mostUsedPlatform}</h3>
                      <span>Most Used Platform</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* fourth row */}

        <div className="row mt-5 mb-5">
          <div className="col-xl-6 col-sm-12 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <div className="w-50 chart-container">
                      <canvas
                        id="doughnutChart"
                        height="300"
                        style={{ width: "100%", height: "100%" }}
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-sm-12 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <div className="w-50 chart-container">
                      <canvas
                        ref={lineChartRef}
                        width="300"
                        height="300"
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* fifth row */}
        <div className="row mt-5 mb-5">
          <div className="col-xl-6 col-sm-12 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <div className="w-50 chart-container">
                      <canvas
                        ref={platformChartRef}
                        width="300"
                        height="300"
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-sm-12 col-12">
            <div
              className={`card ${
                loading ? "card-hover-disabled" : "card-hover-enabled"
              }`}
              style={boxStyle}
            >
              <div className="card-content">
                <div className="card-body">
                  <div className="d-flex justify-content-center">
                    <div className="w-50 chart-container">
                      <canvas
                        ref={osChartRef}
                        width="300"
                        height="300"
                      ></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;

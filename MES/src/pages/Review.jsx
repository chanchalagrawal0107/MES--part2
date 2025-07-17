// import React, { Component } from "react";
// import Navbar from "../components/Navbar.jsx";
// import Sidebar from "../components/Sidebar.jsx";

// class Review extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       reports: [],
//     };
//   }

//   componentDidMount() {
//     this.fetchReports();
//   }

//   fetchReports = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/reports/generated"); // ✅ Use consistent API
//       const data = await res.json();
//       this.setState({ reports: data });
//     } catch (error) {
//       console.error("Error fetching reports:", error);
//     }
//   };

//   handleReviewAndSign = async (reportId) => {
//     const reviewerName = localStorage.getItem("username");

//     try {
//       const res = await fetch("http://localhost:5000/api/reports/review", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ reportId, reviewerName }),
//       });

//       const data = await res.json();
//       alert(data.message);
//       this.fetchReports(); // ✅ Refresh report list
//     } catch (error) {
//       console.error("Error reviewing report:", error);
//     }
//   };

//   render() {
//     return (
//       <>
//         <Navbar />
//         <Sidebar />
//         <div className="content-container">
//           <h2 className="text-center">Reports Pending Review</h2>

//           {this.state.reports.length === 0 ? (
//             <p className="text-center">No reports pending review.</p>
//           ) : (
//             this.state.reports.map((report) => (
//               <div className="report-box" key={report.id}>
//                 <p><strong>Submitted by:</strong> {report.author}</p>
//                 <p><strong>Report Content:</strong> {report.data}</p>
//                 <div className="button-container text-center">
//                   <button
//                     className="btn btn-warning"
//                     onClick={() => this.handleReviewAndSign(report.id)}
//                   >
//                     Reviewed and Sign
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </>
//     );
//   }
// }

// export default Review;


// import React, { Component } from "react";
// import axios from "axios";

// class ReviewerDashboard extends Component {
//   state = {
//     files: [],
//   };

//   componentDidMount() {
//     this.fetchFiles();
//   }

//   fetchFiles = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/files/reviewer");
//       this.setState({ files: res.data.files });
//     } catch (err) {
//       alert("Error loading reviewer files");
//     }
//   };

//   handleSign = async (file) => {
//     try {
//       const res = await axios.post("http://localhost:5000/api/sign", {
//         filename: file,
//         role: "reviewer",
//         username: localStorage.getItem("username"),
//       });
//       alert(res.data.message);
//       this.fetchFiles();
//     } catch (err) {
//       alert("Error signing file");
//     }
//   };

//   render() {
//     return (
//       <div className="container mt-5">
//         <h3>Reviewer Dashboard</h3>
//         <ul className="list-group">
//           {this.state.files.map((file) => (
//             <li className="list-group-item d-flex justify-content-between" key={file}>
//               {file}
//               <button className="btn btn-sm btn-success" onClick={() => this.handleSign(file)}>
//                 Sign & Move to Reviewed
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   }
// }

// export default ReviewerDashboard;

import React, { Component } from "react";
import axios from "axios";

class ReviewerDashboard extends Component {
  state = {
    files: [],
  };

  componentDidMount() {
    this.fetchFiles();
  }

  fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files/reviewer", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      this.setState({ files: res.data.files });
    } catch (err) {
      alert("Error loading reviewer files");
    }
  };

  handleSign = async (file) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/sign",
        {
          filename: file,
          role: "reviewer",
          username: localStorage.getItem("username"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      alert(res.data.message);
      this.fetchFiles();
    } catch (err) {
      alert("Error signing file",err);
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <h3>Reviewer Dashboard</h3>
        {this.state.files.map((file) => (
          <div className="card mb-4" key={file}>
            <div className="card-header d-flex justify-content-between">
              <span>{file}</span>
              <button className="btn btn-sm btn-success" onClick={() => this.handleSign(file)}>
                Sign & Move to Reviewed
              </button>
            </div>
            <div className="card-body">
              <iframe
                src={`http://localhost:5000/reports/generated/${file}`}
                width="100%"
                height="500px"
                title={file}
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default ReviewerDashboard;

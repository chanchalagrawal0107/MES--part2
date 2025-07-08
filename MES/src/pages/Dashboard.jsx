// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar.jsx";
// import Sidebar from "../components/Sidebar.jsx";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const handleCardClick = (path) => {
//     navigate(path);
//   };

//   return (
//     <>
//       <Navbar />
//       <Sidebar />

//       <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
//         <div
//           className="card"
//           style={{ width: "18rem", cursor: "pointer" }}
//           onClick={() => handleCardClick("./components/AlarmDashboard")}
//         >
//           <div className="card-body">
//             <h5 className="card-title">Alarms Report</h5>
//             <p className="card-text">Click to view Alarms Dashboard</p>
//           </div>
//         </div>

//         <div
//           className="card"
//           style={{ width: "18rem", cursor: "pointer" }}
//           onClick={() => handleCardClick("/audit")}
//         >
//           <div className="card-body">
//             <h5 className="card-title">Audit Report</h5>
//             <p className="card-text">Click to view Audit Dashboard</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar.jsx";
// import Sidebar from "../components/Sidebar.jsx";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const handleCardClick = (path) => {
//     navigate(path);
//   };

//   const openAlarmsReport = () => {
//     window.open(
//       "http://nitrov/ReportServer/Pages/ReportViewer.aspx?%2fRockwell+Project+Report%2fAlarms+Report&rs:Command=Render",
//       "_blank"
//     );
//   };

//   const openAuditReport = () => {
//     window.open(
//       "http://nitrov/ReportServer/Pages/ReportViewer.aspx?%2fRockwell+Project+Report%2fAsset+Centre+Report&rs:Command=Render",
//       "_blank"
//     );
//   };

//   return (
//     <>
//       <Navbar />
//       <Sidebar />

//       <div className="dashboard-container">
//         <div className="dashboard-card" onClick={openAlarmsReport}>
//           <div className="card-body">
//             <h5 className="card-title">Alarms Report</h5>
//             <p className="card-text">Click to view Alarms Dashboard</p>
//           </div>
//         </div>

//         <div className="dashboard-card" onClick={openAuditReport}>
//           <div className="card-body">
//             <h5 className="card-title">Audit Report</h5>
//             <p className="card-text">Click to view Audit Dashboard</p>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


// import React, { Component } from "react";
// import Navbar from "../components/Navbar.jsx";
// import Sidebar from "../components/Sidebar.jsx";

// class Dashboard extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       role: "",
//     };
//   }

//   componentDidMount() {
//     const storedRole = localStorage.getItem("userRole");
//     this.setState({ role: storedRole });
//   }

//   openAlarmsReport = () => {
//     window.open(
//       "http://nitrov/ReportServer/Pages/ReportViewer.aspx?%2fRockwell+Project+Report%2fAlarms+Report&rs:Command=Render",
//       "_blank"
//     );
//   };

//   openAuditReport = () => {
//     window.open(
//       "http://nitrov/ReportServer/Pages/ReportViewer.aspx?%2fRockwell+Project+Report%2fAsset+Centre+Report&rs:Command=Render",
//       "_blank"
//     );
//   };

//   handleNavigate = (path) => {
//     window.location.href = path;
//   };

//   render() {
//     const { role } = this.state;

//     return (
//       <>
//         <Navbar />
//         <Sidebar />
//         <div className="dashboard-container">

//           {/* AUTHOR: Can generate reports */}
//           {role === "Author" && (
//             <>
//               <div className="dashboard-card" onClick={this.openAlarmsReport}>
//                 <div className="card-body">
//                   <h5 className="card-title">Alarms Report</h5>
//                   <p className="card-text">Click to generate Alarms Report</p>
//                 </div>
//               </div>

//               <div className="dashboard-card" onClick={this.openAuditReport}>
//                 <div className="card-body">
//                   <h5 className="card-title">Audit Report</h5>
//                   <p className="card-text">Click to generate Audit Report</p>
//                 </div>
//               </div>
//             </>
//           )}

//           {/* REVIEWER: Only sees reports to review */}
//           {role === "Reviewer" && (
//             <div className="dashboard-card" onClick={() => this.handleNavigate("/review")}>
//               <div className="card-body">
//                 <h5 className="card-title">Review Reports</h5>
//                 <p className="card-text">Check reports from authors and sign</p>
//               </div>
//             </div>
//           )}

//           {/* APPROVER: Only sees reports to approve */}
//           {role === "Approver" && (
//             <div className="dashboard-card" onClick={() => this.handleNavigate("/approve")}>
//               <div className="card-body">
//                 <h5 className="card-title">Approve Reports</h5>
//                 <p className="card-text">Give final approval and sign</p>
//               </div>
//             </div>
//           )}

//         </div>
//       </>
//     );
//   }
// }

// export default Dashboard;

import React, { Component } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import AuthorCards from "../components/AuthorCards.jsx";
import ReviewerCard from "../components/ReviewerCard.jsx";
import ApproverCard from "../components/ApproverCard.jsx";
import AuthorUpload from "../components/AuthorUpload.jsx";


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
    };
  }

  componentDidMount() {
    const storedRole = localStorage.getItem("userRole");
    this.setState({ role: storedRole });
  }

  render() {
    const { role } = this.state;

    return (
      <>
        <Navbar />
        <Sidebar />
        <div className="dashboard-container">
          {role === "Author" && <AuthorCards />}
          {role === "Reviewer" && <ReviewerCard />}
          {role === "Approver" && <ApproverCard />}
        </div>
        
      </>
    );
  }
}

export default Dashboard;

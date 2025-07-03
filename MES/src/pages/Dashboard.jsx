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

import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    navigate(path);
  };

  const openAlarmsReport = () => {
    window.open(
      "http://nitrov/ReportServer/Pages/ReportViewer.aspx?%2fRockwell+Project+Report%2fAlarms+Report&rs:Command=Render",
      "_blank"
    );
  };

  const openAuditReport = () => {
    window.open(
      "http://nitrov/ReportServer/Pages/ReportViewer.aspx?%2fRockwell+Project+Report%2fAsset+Centre+Report&rs:Command=Render",
      "_blank"
    );
  };

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="dashboard-container">
        <div className="dashboard-card" onClick={openAlarmsReport}>
          <div className="card-body">
            <h5 className="card-title">Alarms Report</h5>
            <p className="card-text">Click to view Alarms Dashboard</p>
          </div>
        </div>

        <div className="dashboard-card" onClick={openAuditReport}>
          <div className="card-body">
            <h5 className="card-title">Audit Report</h5>
            <p className="card-text">Click to view Audit Dashboard</p>
          </div>
        </div>
      </div>
    </>
  );
}

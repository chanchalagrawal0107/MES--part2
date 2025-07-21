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

// componentDidMount() {
//   const storedRole = localStorage.getItem("userRole");

//   if (storedRole) {
//     this.setState({ role: storedRole });
//   } else {
//     // Try Windows auto-login
//     fetch("http://localhost:5000/api/user", {
//       credentials: "include",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Not Windows-authenticated");
//         return res.json();
//       })
//       .then((data) => {
//         const { user, groups } = data;

//         // You can map specific users or groups to roles
//         let detectedRole = "";
//         if (groups.includes("MES_Authors")) detectedRole = "Author";
//         else if (groups.includes("MES_Reviewers")) detectedRole = "Reviewer";
//         else if (groups.includes("MES_Approvers")) detectedRole = "Approver";

//         if (detectedRole) {
//           localStorage.setItem("userRole", detectedRole);
//           this.setState({ role: detectedRole });
//         } else {
//           console.warn("No role-matching group found.");
//         }
//       })
//       .catch((err) => {
//         console.error("Windows auto-login failed:", err.message);
//       });
//   }
// }
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

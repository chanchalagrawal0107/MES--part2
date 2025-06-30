import Navbar from "../components/Navbar.jsx";
import React from 'react'
import Sidebar from "../components/Sidebar.jsx";
import AlarmDashboard from "../components/AlarmDashboard.jsx";

export default function Dashboard() {
  return (
    <>
        <Navbar/>
        <Sidebar/>
        <AlarmDashboard/>
    </>
  );
}
import Navbar from "../components/Navbar.jsx";
import React from 'react'
import Sidebar from "../components/Sidebar.jsx";

export default function Dashboard() {
  return (
    <>
        <Navbar/>
        <Sidebar/>
        {/* <div style={{ padding : "20px"}}>
          <button onClick={onLogout}></button>
        </div> */}
    </>
  );
}
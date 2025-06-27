import Login from './pages/Login'
import Register from './pages/Register'
import Reset from './pages/Reset'
import React, {Component} from 'react'
import Dashboard from './pages/Dashboard'
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

function App() {
  
  return (
    <>
    <Dashboard/>  
    
      {/* <Login/> */}
      {/* <Register/> */}
      {/* <Reset/> */}
    </>
  )
}

export default App
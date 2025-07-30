import React, { Component } from "react";
import "../style.css";

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
  event.preventDefault();
  const { username, password } = this.state;
  
  try {
    const response = await fetch('http://localhost:5000/api/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: username,
        newPassword: password,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      alert('Password reset successful!');
      this.props.navigate('/');
    } else {
      alert(data.message || 'Password reset failed');
    }
  } catch (error) {
    console.error('Reset error:', error);
    alert('Something went wrong during password reset.');
  }
};

  render() {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Reset Password</h1>
          </div>
          
          <form onSubmit={this.handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter your username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter new password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <button type="submit" className="auth-btn">
              Reset Password
            </button>

            <div className="auth-footer">
              <p>
                Remember your password? <a href="/" className="auth-link">Login</a>
              </p>
              <p>
                New User? <a href="/register" className="auth-link">Register</a>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Reset;
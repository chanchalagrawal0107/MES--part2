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
      <div className="bg">
        <div className="login-panel">
          <h2 className="h2">Reset Password</h2>

          <form onSubmit={this.handleSubmit}>
            <div className="username">
              <label htmlFor="username" className="form-label"><b>Username</b></label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={this.state.username}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="password">
              <label htmlFor="password" className="form-label"><b>New Password</b></label>
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

            <button type="submit" className="login-button">
              Reset Password
            </button>

            <p className="text-center">
              New User? <a href="/register" className="register">Register</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Reset;
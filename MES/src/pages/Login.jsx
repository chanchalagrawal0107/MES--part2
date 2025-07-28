import React, { Component } from "react";
import "../style.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      role:'',
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { username, password, role } = this.state;

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,  
          password,
          role,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Optional: Save token if you're using JWT
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('username', username);
        }

        this.props.onLogin(username, password, role);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong during login.');
    }
  };

  render() {
    return (
      <div className="bg">
        <div className="login-panel">
          <h2 className="h2">Login</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="username">
              <label htmlFor="username" className="form-label">
                Username
              </label>
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="role">
              <label htmlFor="role" className="form-label">
                <b>Role</b>
              </label>
              <select
                id="role"
                name="role"
                className="form-control"
                value={this.state.role}
                onChange={this.handleChange}
                required
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Author">Author</option>
                <option value="Reviewer">Reviewer</option>
                <option value="Approver">Approver</option>
              </select>
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            <p className="text-center">
              New User?{" "}
              <a href="/register" className="register">
                Register
              </a>
            </p>
            <p className="text-center">
              <a href="/reset" className="reset">
                Forgot Password?
              </a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;

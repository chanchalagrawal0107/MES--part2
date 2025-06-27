import React, { Component } from "react";
import "../style.css";


class Login extends Component {
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

  handleSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.props.onLogin(username, password);
  };

  render() {
    return (
      <div className="bg">
        <div className="login-panel">
          <h2 className="h2">Login</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="username">
              <label htmlFor="username" className="form-label">Username</label>
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
              <label htmlFor="password" className="form-label">Password</label>
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

            <button type="submit" className="login-button">Login</button>

            <p className="text-center">
              New User? <a href="#" className="register">Register</a>
            </p>
            <p className="text-center">
              <a href="#" className="reset">Forgot Password?</a>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
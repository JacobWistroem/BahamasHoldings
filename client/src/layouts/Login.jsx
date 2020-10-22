/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import image from "assets/img/sidebar-3.jpg";
import AuthService from './AuthService';

class Login extends Component {
  constructor(props) {
    super(props);
    this.onlogin = this.onlogin.bind(this);
    this.Submit = this.Submit.bind(this);
    
    this.Auth = new AuthService();
    this.state = {
      image: image,
      color: "black",
      hasImage: true,
    };
  }

  handleImageClick = image => {
    this.setState({ image: image });
  };
  handleColorClick = color => {
    this.setState({ color: color });
  };
  handleHasImage = hasImage => {
    this.setState({ hasImage: hasImage });
  };

  componentDidMount(){
    document.getElementById("username").addEventListener("keydown", this.Submit);
    document.getElementById("password").addEventListener("keydown", this.Submit);
  }

  Submit = (e) => {
    if(e.key === 'Enter'){
      this.onlogin();
    }
  }


  onlogin = () => {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    this.Auth.login(user, pass)
      .then(res => {
        this.props.history.push('/admin');
      }).catch(err =>{
        this.props.history.push('/login');
          alert(err.description);
      })


  }

  render() {
    return (
      <div id="main-login-content" className="form-group">
        
          <label>Brugernavn:</label>
          <input id="username" type="text"/>
          <label>Kodeord:</label>
          <input id="password" type="password"/>
          <button onClick={this.onlogin}>Login</button>
      </div>
    );
  }
}

export default Login;

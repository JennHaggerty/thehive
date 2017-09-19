import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Logout from './logout';
import config from './config';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      show: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    if(localStorage.token && this.state.loggedIn === false) {
      this.state.toggleLogin(true);
    }
  }
  handleClick(e) {
    this.setState({ show: !this.state.show });
  }
  handleSubmit(e) {
    e.preventDefault();
    var _details = {};
    var self = this;
    ['email', 'password']
    .forEach(function (fieldToChange) {
      _details[fieldToChange] = document.querySelector('[name="'+fieldToChange+'"]').value;
    })
    axios.post(config.server + '/login', _details)
    .then(function successcallback(response){
      // sets cookie in local storage
      localStorage.setItem('token', response.data.token);
      // sets the login state to 'true'
      //self.props.toggleLogin(true);
      // hides the login form
      alert("You are now logged in.")
      self.state.show = false;
    })
    .catch(function (error) {
      console.log(error);
      alert("There was a problem logging in.")
    });
  }
  render () {
    return (
      <div>
        <center>
        <div id="login">
          { !this.state.loggedIn
            ? <div className="panel panel-default col-xs-12 col-sm-12 col-md-6 col-lg-6">
                <div className="panel-heading">
                  <h3 className="panel-title">Login</h3>
                </div>
                <div className="panel-body">
                  <form onSubmit={event => this.handleSubmit(event)}>
                    <input type="text" placeholder="email" name="email"/> <br />
                    <input type="password" placeholder="password" name="password"/> <br />
                    <button onSubmit={ () => this.handleSubmit() }>Submit</button>
                  </form>
                </div>
              </div>
            : <Logout toggleLogin={this.state.toggleLogin} />
          }
        </div>
        </center>
      </div>
    );
  }
}
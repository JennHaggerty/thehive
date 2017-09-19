import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Navigation from './navigation';
import Logout from './logout';
import config from './config';

export default class App extends Component {
  constructor(props) {
    super(props);

    var self = this;
    this.state = {
      user: {},
      loggedIn: false,
      toggleLogin: function(value) {
        self.setState({
          loggedIn: value
        }) 
      }
    };
  }

  componentDidMount() {
    if(localStorage.token && this.state.loggedIn === false) {
      this.state.toggleLogin(true);
    }
  }

  getUser() {
    //var url = window.location.hash.slice(1);
    axios.get(config.server)
      .then(res => {
        this.setState({ 
          user: res.data
        });
      });
  }


  render() {
      return (
        <div>
          <header>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css"></link>
          </header>
          
          <Navigation loggedIn={this.state.loggedIn} />
          <div className="content">
            {this.props.children}
          </div>
  
          <div id="loggedin">
            { !this.state.loggedIn
              ? null
              : <Logout toggleLogin={this.state.toggleLogin} />
            }
          </div>
        </div>
      );
  }
}
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import './App.css';
import About from './about';
import Projects from './projects';
import Contact from './contact';
import Resume from './resume';
import Login from './login';

export default class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //show: false
    };
  }
  render() {
    const self = this;
    const contextualProjects = (props) => {
      return (
        <Projects
          loggedIn={self.props.loggedIn}
          {...props}
       />
      )
    }
    return (
      <Router>
        <Navbar collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <Link to="/about" id="NavItem">
                JENNIFER HAGGERTY
              </Link>
            </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse id="navButton">
          <Nav>
            <NavItem><Link to="/about" id="NavItem">About</Link></NavItem>
            <NavItem><Link to="/projects" id="NavItem">Blog</Link></NavItem>
            <NavItem><Link to="/contact" id="NavItem">Contact</Link></NavItem>
          </Nav>
          <Nav pullRight>
            <NavItem><Link to="/resume" id="NavItem">Resume</Link></NavItem>
            <NavItem><Link to="/github" id="NavItem">Github</Link></NavItem>
          </Nav>
        </Navbar.Collapse>
          <Route exact path="/" component={About}/>
          <Route path="/about" component={About}/>
          <Route path="/projects" render={contextualProjects}/>
          <Route path="/contact" component={Contact}/>
          <Route path="/resume" component={Resume}/>
          <Route path="/login" component={Login}/>
          <Route path='/github' component={() => window.location = 'https://github.com/jennhaggerty'}/>
        </Navbar>
      </Router>
    )
  }
}
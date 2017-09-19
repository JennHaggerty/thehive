import React, { Component } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Schools from './schools';
import Jobs from './jobs';

export default class Resume extends Component {
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
  render() {
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3>Available for hire</h3>
            <p>Rock Hill, SC | Remote</p>
            <b>tel:</b> 1+ (646) 575-0349<br/>
            <b>email:</b> consulting@jhaggerty.net
          </div>
          <div className="col-md-8">
            <h3>Summary</h3>
            Jennifer has worked extensively with incubator and start-up companies 
            to refine their vision and to prototype and implement applications 
            for mobile, web, and desktop platforms. With a decade of experience 
            in development and design, and direct management roles. 
            Rare days off are spent painting, volunteering traveling and studying photography.
          </div>
        </div>
        <div className="row">
          <div className="col-md-12" id="tools">
            <h3>Proficiencies</h3>
            <table>
              <tbody>
                <tr>
                  <td className="col-lg-3"><h4>Front</h4></td>
                  <td className="col-lg-3"><h4>Back</h4></td>
                  <td className="col-lg-3"><h4>E-commerce</h4></td>
                  <td className="col-lg-3"><h4>Tools</h4></td>
                </tr>
                <tr>
                  <td>(X)HTML(5), CSS(3), LESS, JavaScript, 
                    Angular, Common.js, jQuery, React.</td>
                  <td>NodeJS, PHP, SQL.</td>
                  <td>Woocommerce, Shopify, Magneto, Drupal 
                    Commerce, Volusion.</td>
                  <td>AWS, DigitalOcean, Docker, WordPress, Ansible.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12" id="experience">
            <h3>Experience</h3>
            <Jobs loggedIn={this.state.loggedIn} />
          </div>
          <div className="col-md-12" id="certifications">
            <h3>Certifications</h3>
            Google Analytics
          </div>
          <div className="col-md-12" id="education">
            <h3>Education</h3>
            <Schools loggedIn={this.state.loggedIn} />
          </div>
        </div>
      </div>
    )
  }
}
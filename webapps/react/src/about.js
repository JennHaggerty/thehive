import React, { Component } from 'react';
import './App.css';
import Row from '../node_modules/react-bootstrap/lib/Row';
import Col from '../node_modules/react-bootstrap/lib/Col';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
//import { Router, Route, Link, browserHistory, IndexRoute  } from 'react-router'

export default class About extends Component {
  render() {
    return (
      <div>
        <div id="introduction" className="jumbotron">
        
          <h2>Full stack engineer serving enterprise and startup solutions</h2>
          <p>Jennifer Haggerty provides technical advisement and solutions in four key competencies:</p>
          <Row id="competencies">
            <Col id="competencies" className="col-xs-6 col-md-3">
              Web Development
            </Col>
            <Col id="competencies" className="col-xs-6 col-md-3">
              UX/UI Design
            </Col>
            <Col id="competencies" className="col-xs-6 col-md-3">
              Marketing & Analytics
            </Col>
            <Col id="competencies" className="col-xs-6 col-md-3">
              Globalization
            </Col>
          </Row>
        
        </div>

        <div id="about">
          <p>Jennifer Haggerty has a unique toolset that can tackle both sides of the technical and creative 
          problems that clients bring to the table. Her technical and design experience allows 
          informed, well-reasoned solutions in a timely manner. Mobile and web presence are a requirement in today’s 
          business world, Jennifer excels in defining, meeting, and exceeding our client’s critical 
          ePresence needs. She meets these needs by providing customer focused technical solutions, in a transparent, 
          clearly communicated project management environment.  
          Whether you are a small business seeking to distinguish yourself in the global market-place or a governmental 
          agency seeking to better understand the motives and strategies of the actors therein, Jennifer can provide the 
          research, analysis and best of all:  a viable, concrete plan for success.</p>
  
          <p>Returning clients is a metric we pride ourselves on. Integrity is the touchstone of J Haggerty Consulting LLC, your success is our success. We will always be honest and 
          up front about project risk-factors, bottle-necks, and contingencies.</p>
          
          <p><b>Principal</b> – Jennifer has worked extensively with incubator and start-up companies to refine their vision and to prototype and 
          implement applications for mobile, web, and desktop platforms. Schooling includes a Bachelor of Arts in Studio Art from the University of South Carolina. Rare days off are spent painting 
          and studying photography, samples of which can be found <a href="https://bardicwarrior.com">here</a>.</p>
        </div>
      </div>


    )
  }
}
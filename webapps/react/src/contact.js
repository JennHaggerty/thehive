import React, { Component } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

export default class Contact extends Component {
  render() {
    return (
    	<div>
        <div id="contact">
          <h2>Contacting Jennifer</h2>
          <p>Rock Hill, SC</p>
          <b>tel:</b> 1+ (646) 575-0349<br/>
          <b>email:</b> consulting@jhaggerty.net
        </div>
      </div>
    )
  }
}
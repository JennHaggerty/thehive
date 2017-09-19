import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import config from './config';

export default class Schools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      schools: undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getSchools() {
    var self = this;
    axios.get(`${config.server}/schools`)
      .then(res => {
        self.setState({
          init: true,
          schools: res.data
        });
      });
  }
  handleChange(e, school) {
    const schools = this.state.schools;
    const key = e.target.name;
    const val = e.target.value;
    const index = e.target.parentElement.querySelector('[name="index"]').value;
    schools[index][key] = val;
    this.setState({ schools });
    
  }
  handleClick(e, school) {
    var newState = this.state;
    if(e === 'edit'){
      newState.show = !this.state.show;
      newState.schools.forEach(_schools => {
        if (_schools.id === school.id) {
          _schools.show = !this.state.show;
        }

      })
    }
    this.setState(newState);
  }
  handleSubmit(e, school) {
    var schools = this.state.schools;
    var self = this;
    var newState = this.state;
    // removes the 'show' attribute from the inquiry else it errors when referenced in the db.
    schools = schools.map(_school => {
      delete _school.show;
      return _school;
    })
    var schoolsPromise;
      if(e === 'delete') {
        schools.forEach((_school, index) => {
          if(_school.id === school.id) {
            schools.splice(index, 1);
            schoolsPromise = axios.delete(config.server + '/schools', {
              params: { 'id': school.id },
              headers: {'Authorization': localStorage.token }
            });
          }
        });
      } else if(e && e.target && e.target.name === 'add') {
        e.preventDefault();
        var newschools = {
          name: e.target.querySelector('input[name="name"]') && e.target.querySelector('input[name="name"]').value,
          url: e.target.querySelector('input[name="url"]') && e.target.querySelector('input[name="url"]').value,
          degree: e.target.querySelector('input[name="degree"]') && e.target.querySelector('input[name="degree"]').value,
          major: e.target.querySelector('input[name="major"]') && e.target.querySelector('input[name="major"]').value,
          city: e.target.querySelector('input[name="city"]') && e.target.querySelector('input[name="city"]').value,
          state: e.target.querySelector('input[name="state"]') && e.target.querySelector('input[name="state"]').value,
          started: e.target.querySelector('input[name="started"]') && e.target.querySelector('input[name="started"]').value,
          finished: e.target.querySelector('input[name="finished"]') && e.target.querySelector('input[name="finished"]').value
        };
        schoolsPromise = axios.post(config.server + '/school',
          [newschools], {
          headers: {'Authorization': localStorage.token}
        })
        .then(serverResponse => {
          newState.schools.push(newschools) 
        })
      } else {
        if (e.preventDefault) { e.preventDefault(); }
        schoolsPromise = axios.post(config.server + '/schools',
          schools, {
          headers: {'Authorization': localStorage.token}
        })
      }  
      schoolsPromise = schoolsPromise || Promise.reject('No promise provided..')    
      schoolsPromise.then(function successcallback(response){
        self.forceUpdate();
      })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    if (!this.state.schools) {
      this.getSchools();
      return (
        <div id="schools">Getting schools...</div>
      )
    } else {
      return (
        <div id="schools" >
          { this.props.loggedIn 
            ? <div>
              <div className="panel panel-default" id="addSchool" key="index">
                <form name="add" onSubmit={this.handleSubmit}>
                  <table>
                    <tbody className="panel-body">
                      <tr className="panel-heading">
                        <th className="panel-title">
                          Add School
                        </th>
                        <th>
                          <input type="submit" value="Save" className="pull-right"/>
                        </th>
                      </tr>
                      <tr>
                        <td>Name:<input type="hidden" name="index" /></td>
                        <td>
                          <input type="text"
                            name="name"
                            value={this.state.name}
                            placeholder=" " 
                            required/> <br/>
                        </td>
                        <td>Url:</td>
                        <td>
                          <input type="text"
                            name="url"
                            value={this.state.url}
                            placeholder=" " /><br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Degree:</td>
                        <td>
                          <input type="text"
                            name="degree"
                            value={this.state.degree}
                            placeholder=" " /><br/>
                        </td>
                        <td>Major:</td>
                        <td>
                          <input type="text"
                            name="major"
                            value={this.state.major}
                            placeholder=" " 
                            required/><br/>
                        </td>
                      </tr>
                      <tr>
                        <td>City:<input type="hidden" name="index" /></td>
                        <td>
                          <input type="text"
                            name="city"
                            value={this.state.city}
                            placeholder=" " 
                            required/> <br/>
                        </td>
                        <td>State:<input type="hidden" name="index" /></td>
                        <td>
                          <input type="text"
                            name="state"
                            value={this.state.state}
                            placeholder=" " 
                            required/> <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Started:<input type="hidden" name="index" /></td>
                        <td>
                          <input type="text"
                            name="started"
                            value={this.state.started}
                            placeholder="YYYY-MM-DD HH:MM:SS" 
                            required/> <br/>
                        </td>
                        <td>Finished:<input type="hidden" name="index" /></td>
                        <td>
                          <input type="text"
                            name="finished"
                            value={this.state.finished}
                            placeholder="YYYY-MM-DD HH:MM:SS" 
                            required/> <br/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
              <div id="editSchools">
                { this.state.schools.map((school, index) => 
                  {
                    return (
                      <div key={index}>
                        <div className="col-md-12">
                          <div className="col-md-8">
                            <a href='{school.url}'>{ school.name }</a>
                            <button onClick={ () => this.handleClick('edit', school) }>Edit</button>
                            <button onClick={ () => this.handleSubmit('delete', school) }>Delete</button>
                          </div>
                          { school.show
                            ? <form onSubmit={this.handleSubmit}>
                                <div className="col-md-6">
                                  <input type="hidden" name="index" value={index} />
                                  <input type="hidden" name="id" value={school.id} />
                                  Name: <input
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    defaultValue={school.name} /><br/>
                                  Url: <input
                                    name="url"
                                    value={this.state.url}
                                    onChange={this.handleChange}
                                    defaultValue={school.url} /><br/>
                                  Degree: <input
                                    name="degree"
                                    value={this.state.degree}
                                    onChange={this.handleChange}
                                    defaultValue={school.degree} /><br/>
                                  Major: <input
                                    name="major"
                                    value={this.state.major}
                                    onChange={this.handleChange}
                                    defaultValue={school.major} /><br/>
                                  Graduated: <input
                                    name="finished"
                                    value={this.state.finished}
                                    onChange={this.handleChange}
                                    defaultValue={school.finished} />
                                </div>
                                <div  className="col-md-6">
                                    City: <input
                                      name="city"
                                      value={this.state.city}
                                      onChange={this.handleChange}
                                      defaultValue={school.city} /><br/>
                                    State: <input
                                      name="state"
                                      value={this.state.state}
                                      onChange={this.handleChange}
                                      defaultValue={school.state} /><br/>
                                    From: <input
                                      name="started"
                                      value={this.state.started}
                                      onChange={this.handleChange}
                                      defaultValue={school.started} /><br/>
                                    To: <input
                                      name="finished"
                                      value={this.state.finished}
                                      onChange={this.handleChange}
                                      defaultValue={school.finished} /><br/>
                                    <input type="submit" value="Save" className="pull-right" />
                                </div>
                              </form>
                            : <div> 
                                <div className="col-md-8">
                                  <b>Degree: {school.degree}</b><br/>
                                  Major: {school.major}<br/>
                                  Graduated: {school.finished}
                                </div>
                                <div className="col-md-4">
                                  {school.city}, {school.state}<br/>
                                From {school.started} to {school.finished}
                                </div>
                              </div>
                          }
                        </div>
                      </div>
                    );
                  })
                }     
              </div>
            </div>
            // non-editview. this implies not logged in also
            : <table className="col-md-12">
                <tbody>
                  { this.state.schools.map((school, index) => 
                    {
                      return (
                        <tr key={index}>
                          <td className="col-md-8">
                            <a href='{school.url}'>{ school.name }</a><br/>
                            <b>Degree: {school.degree}</b><br/>
                            Major: {school.major}<br/>
                            Graduated: {school.finished}
                          </td>
                          <td id="stats" className="col-md-4">
                            {school.city}, {school.state}<br/>
                            From {school.started} to {school.finished}
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
          }
        </div>
      )
    }
  }
}
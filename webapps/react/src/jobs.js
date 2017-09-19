import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import config from './config';

export default class Jobs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: undefined
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  getJobs() {
    var self = this;
    axios.get(`${config.server}/jobs`)
      .then(res => {
        self.setState({
          init: true,
          jobs: res.data
        });
      });
  }
  handleChange(e, job) {
    const jobs = this.state.jobs;
    const key = e.target.name;
    const val = e.target.value;
    const index = e.target.parentElement.querySelector('[name="index"]').value;
    jobs[index][key] = val;
    this.setState({ jobs });
    
  }
  handleClick(e, job) {
    var newState = this.state;
    if(e === 'edit'){
      newState.show = !this.state.show;
      newState.jobs.forEach(_jobs => {
        if (_jobs.id === job.id) {
          _jobs.show = !this.state.show;
        }
      })
    }
    this.setState(newState);
  }
  handleSubmit(e, job) {
    debugger;
    var jobs = this.state.jobs;
    var self = this;
    var newState = this.state;
    // removes the 'show' attribute from the inquiry else it errors when referenced in the db.
    jobs = jobs.map(_job => {
      delete _job.show;
      return _job;
    })
    // eslint-disable-next-line
    var jobsPromise;
      if(e === 'delete') {
        jobs.forEach((_job, index) => {
          if(_job.id === job.id) {
            jobs.splice(index, 1);
            jobsPromise = axios.delete(config.server + '/jobs', {
              params: { 'id': job.id },
              headers: {'Authorization': localStorage.token }
            });
          }
        });
      } else if(e && e.target && e.target.attributes && e.target.attributes.name && e.target.attributes.name.value && e.target.attributes.name.value === 'add') {
        e.preventDefault();
        var newjobs = {
          name: e.target.querySelector('input[name="name"]') && e.target.querySelector('input[name="name"]').value,
          url: e.target.querySelector('input[name="url"]') && e.target.querySelector('input[name="url"]').value,
          position: e.target.querySelector('input[name="position"]') && e.target.querySelector('input[name="position"]').value,
          description: e.target.querySelector('textarea[name="description"]') && e.target.querySelector('textarea[name="description"]').value,
          city: e.target.querySelector('input[name="city"]') && e.target.querySelector('input[name="city"]').value,
          state: e.target.querySelector('input[name="state"]') && e.target.querySelector('input[name="state"]').value,
          started: e.target.querySelector('input[name="started"]') && e.target.querySelector('input[name="started"]').value,
          finished: e.target.querySelector('input[name="finished"]') && e.target.querySelector('input[name="finished"]').value
        };
        jobsPromise = axios.post(config.server + '/job',
          [newjobs], {
          headers: {'Authorization': localStorage.token}
        })
        .then(serverResponse => {
          newState.jobs.push(newjobs)
        })
      } else {
        if (e.preventDefault) { e.preventDefault(); }
        jobsPromise = axios.post(config.server + '/jobs',
          jobs, {
          headers: {'Authorization': localStorage.token}
        })
      }  
      jobsPromise = jobsPromise || Promise.reject('No promise provided..')    
      .then(function successcallback(response){
        self.forceUpdate();
      })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    if (!this.state.jobs) {
      this.getJobs();
      return (
        <div id="jobs">Getting experience..</div>
      )
    } else {
      const loggedIn = this.props.loggedIn;
      // const preview = this.state.show;
      // can see _ONLY_ edit view while logged in
      const editView = loggedIn;
      return (
        <div id="jobs">
          { editView 
            ? <div>
              <div id="addJob" key="index" className="panel panel-default">
                <form name="add" onSubmit={this.handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td></td>
                        <th>
                          Add Work
                        </th>
                      </tr>
                      <tr>
                        <td>Employer Name:<input type="hidden" name="index" /></td>
                        <td>
                          <input type="text"
                            name="name"
                            value={this.state.name}
                            placeholder=" " 
                            required/> <br/>
                        </td>
                        <td>Employer Url:</td>
                        <td>
                          <input type="text"
                            name="url"
                            value={this.state.url}
                            placeholder=" " /><br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Position:</td>
                        <td>
                          <input type="text"
                            name="position"
                            value={this.state.position}
                            placeholder=" " 
                            required/><br/>
                        </td>
                      </tr>
                      <tr>
                        <td>City:</td>
                        <td>
                          <input type="text"
                            name="city"
                            value={this.state.city}
                            placeholder=" "/> <br/>
                        </td>
                        <td>State:</td>
                        <td>
                          <input type="text"
                            name="state"
                            value={this.state.state}
                            placeholder=" "/> <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Started:</td>
                        <td>
                          <input type="text"
                            name="started"
                            value={this.state.started}
                            placeholder=" " 
                            required/> <br/>
                        </td>
                        <td>Finished:</td>
                        <td>
                          <input type="text"
                            name="finished"
                            value={this.state.finished}
                            placeholder=" " /> <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Description:</td>
                        <td>
                          <textarea type="text"
                            name="description"
                            value={this.state.description}
                            placeholder=" " 
                            required/><br/>
                            <input type="submit" value="Save" className="pull-right"/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
              <div id="editJobs">
                { this.state.jobs.map((job, index) => 
                  {
                    return (
                      <div key={index}>
                        <div className="col-md-12">
                          <div className="col-md-8">
                            <a href='{job.url}'>{ job.name }</a>
                            <button onClick={ () => this.handleClick('edit', job) }>Edit</button>
                            <button onClick={ () => this.handleSubmit('delete', job) }>Delete</button>
                          </div>
                          { job.show
                            ? <form onSubmit={this.handleSubmit}>
                                <div className="col-md-8">
                                      <input type="hidden" name="index" value={index} />
                                      <input type="hidden" name="id" value={job.id} />
                                      Employer Name: <input
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        defaultValue={job.name} /><br/>
                                      Employer Url: <input
                                        name="url"
                                        value={this.state.url}
                                        onChange={this.handleChange}
                                        defaultValue={job.url} /><br/>
                                      Position: <input
                                        name="position"
                                        value={this.state.position}
                                        onChange={this.handleChange}
                                        defaultValue={job.position} /><br/>
                                      Description: <textarea
                                        name="description"
                                        value={this.state.description}
                                        onChange={this.handleChange}
                                        defaultValue={job.description} />
                                      <input type="submit" value="Save" className="pull-right" />
                                </div>
                                <div className="col-md-4">
                                      City: <input
                                        name="city"
                                        value={this.state.city}
                                        onChange={this.handleChange}
                                        defaultValue={job.city} /><br/>
                                      State: <input
                                        name="state"
                                        value={this.state.state}
                                        onChange={this.handleChange}
                                        defaultValue={job.state} /><br/>
                                      From: <input
                                        name="started"
                                        value={this.state.started}
                                        onChange={this.handleChange}
                                        defaultValue={job.started} /><br/>
                                      To: <input
                                        name="finished"
                                        value={this.state.finished}
                                        onChange={this.handleChange}
                                        defaultValue={job.finished} /><br/>
                                      
                                </div>
                              </form>
                            : <div> 
                              <div className="col-md-8">
                                <b>{job.position}</b> <br/>
                                {job.description}
                              </div>
                              <div className="col-md-4">
                                {job.city}, {job.state}<br/>
                                From {job.started} to {job.finished}
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
            // PUBLIC VIEW
            : <div>
                <table className="col-md-12">
                  <tbody>
                  {
                    this.state.jobs.map((job, index) => 
                    {
                      return (
                        <tr key={index}>
                          <td className="col-md-8">
                            <b>{job.position}</b> <br/>
                            <a href={job.url}> {job.name} </a><br/>
                            {job.description}
                          </td>
                          <td id="stats" className="col-md-4">
                            {job.city}, {job.state}<br/>
                            From {job.started} to {job.finished}
                          </td>
                        </tr>
                      );
                    })
                  }
                  </tbody>
                </table>
              </div>
          }
        </div>
      )
    }
  }
}
import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import config from './config';

export default class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: undefined
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);    
  }
  getProjects() {
    var self = this;
    axios.get(`${config.server}/projects`)
      .then(res => {
        self.setState({
          init: true,
          projects: res.data
        });
      });
  }
  handleChange(e, project) {
    const projects = this.state.projects;
    const key = e.target.name;
    const val = e.target.value;
    const index = e.target.parentElement.querySelector('[name="index"]').value;
    projects[index][key] = val;
    this.setState({ projects });
    
  }
  handleClick(e, project) {
    var newState = this.state;
    if(e === 'edit'){
      newState.show = !this.state.show;
      newState.projects.forEach(_projects => {
        if (_projects.id === project.id) {
          _projects.show = !this.state.show;
        }

      })
    }
    this.setState(newState);
  }
  handleSubmit(e, project) {
    var projects = this.state.projects;
    var self = this;
    var newState = this.state;
    // removes the 'show' attribute from the inquiry else it errors when referenced in the db.
    projects = projects.map(_project => {
      delete _project.show;
      return _project;
    })
    var projectsPromise;
      if(e === 'delete') {
        projects.forEach((_project, index) => {
          if(_project.id === project.id) {
            projects.splice(index, 1);
            projectsPromise = axios.delete(config.server + '/projects', {
              params: { 'id': project.id },
              headers: {'Authorization': localStorage.token }
            });
          }
        });
      } else if(e && e.target && e.target.name === 'add') {
        e.preventDefault();
        var newprojects = {
          title: e.target.querySelector('input[name="title"]') && e.target.querySelector('input[name="title"]').value,
          body: e.target.querySelector('textarea[name="body"]') && e.target.querySelector('textarea[name="body"]').value,
          url: e.target.querySelector('input[name="url"]') && e.target.querySelector('input[name="url"]').value,
          tags: e.target.querySelector('input[name="tags"]') && e.target.querySelector('input[name="tags"]').value
        };
        projectsPromise = axios.post(config.server + '/project',
          [newprojects], {
          headers: {'Authorization': localStorage.token}
        })
        .then(serverResponse => {
          newState.projects.push(newprojects) 
        })
      } else {
        if (e.preventDefault) { e.preventDefault(); }
        projectsPromise = axios.post(config.server + '/projects',
          projects, {
          headers: {'Authorization': localStorage.token}
        })
      }  
      projectsPromise = projectsPromise || Promise.reject('No promise provided..')    
      projectsPromise.then(function successcallback(response){
        self.forceUpdate();
      })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    if (!this.state.projects) {
      this.getProjects();
      return (
        <div id="projects">Getting projects..</div>
      )
    } else {
      const loggedIn = this.props.loggedIn;
      // const preview = this.state.show;
      // can see _ONLY_ edit view while logged in
      const editView = loggedIn;
      return (
        <div id="projects">
          { editView 
            ? <div>
              <div id="addProject" key="index" className="jumbotron">
                <form name="add" onSubmit={this.handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>
                          <h3> New Entry </h3>
                        </td>
                      </tr>
                      <tr>
                        <td>Title:<input type="hidden" name="index" /></td>
                        <td>
                          <input type="text"
                            name="title"
                            value={this.state.title}
                            placeholder=" " 
                            required/> <br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Url:</td>
                        <td>
                          <input type="text"
                            name="url"
                            value={this.state.url}
                            placeholder=" " /><br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Tags:</td>
                        <td>
                          <input type="text"
                            name="tags"
                            value={this.state.tags}
                            placeholder=" " /><br/>
                        </td>
                      </tr>
                      <tr>
                        <td>Body:</td>
                        <td>
                          <textarea type="text"
                            name="body"
                            value={this.state.body}
                            placeholder=" " 
                            required/><br/>
                            <input type="submit" value="Save" className="pull-right" 
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
              <div id="editProjects">
                { this.state.projects.map((project, index) => 
                  {
                    return (
                      <div key={index} >
                        <div className="panel panel-default">
                          <div className="panel-heading">
                            <h3 className="panel-title">
                              {project.title} <button onClick={ () => this.handleClick('edit', project) }>Edit</button>
                              <button onClick={ () => this.handleSubmit('delete', project) }>Delete</button>
                            </h3>
                          </div>
                          { project.show
                            ? <form onSubmit={this.handleSubmit}>
                              <div>
                                <input type="hidden" name="index" value={index} />
                                <input type="hidden" name="id" value={project.id} />
                                Title: <input
                                  name="title"
                                  value={this.state.title}
                                  onChange={this.handleChange}
                                  defaultValue={project.title} /><br/>
                                Body: <textarea
                                  name="body"
                                  value={this.state.body}
                                  onChange={this.handleChange}
                                  defaultValue={project.body} /><br/>
                                Url: <input
                                  name="url"
                                  value={this.state.url}
                                  onChange={this.handleChange}
                                  defaultValue={project.url} /><br/>
                                Tags: <input
                                  name="tags"
                                  value={this.state.tags}
                                  onChange={this.handleChange}
                                  defaultValue={project.tags} /><br/>
                                <input type="submit" value="Save" className="pull-right" />
                              </div>
                              </form>
                            : <div>
                                <div className="panel-body"> {project.body} </div>
                                <div className="panel-footer">Logged: {project.date} Tags: {project.tags} </div>
                              </div>
                          }
                        </div>
                      </div>
                    );
                  })
                }        
              </div></div>

            // non-editview. this implies not logged in also
            : <div>
                <div id="latestProjects" className="jumbotron">
                <h2> Latest Entry</h2><br/>
                  {
                    this.state.projects.slice(0,1).map((project, index) => 
                    {
                      return (
                        <div key={index}>
                          <div className="panel panel-default">
                            <div className="panel-heading">
                            <h3 className="panel-title">
                            <a href={project.url}>{project.title}</a>
                          </h3>
                            </div>
                            <div className="panel-body"> 
                              <p>{project.body}</p> 
                              URL: <a href="{project.url}">{project.url}</a> 
                            </div>
                            <div className="panel-footer">Logged: {project.date} | Tags: {project.tags} </div>
                          </div>
                        </div>
                      );
                    })
                  }     
                  </div>
                  <div id="allProjects" className="row">
                  {
                    this.state.projects.slice(1,25).map((project, index) => 
                    {
                      return (
                        <div key={index}>
                          <div className="panel panel-default">
                            <div className="panel-heading">
                              <h3 className="panel-title">
                                <a href={project.url}>{project.title}</a>
                              </h3>
                            </div>
                            <div className="panel-body"> 
                              <p>{project.body}</p>
                              <p>URL: <a href="{project.url}">{project.url}</a> </p>
                              <div className="panel-footer">Logged: {project.date} | Tags: {project.tags}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>   
              </div>
          }
        </div>
      )
    }
  }
}



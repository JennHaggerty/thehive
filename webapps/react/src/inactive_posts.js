import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import config from './config';

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: undefined
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);    
  }
  getPosts() {
    var self = this;
    axios.get(`${config.server}/posts`)
      .then(res => {
        self.setState({
          init: true,
          posts: res.data
        });
      });
  }
  handleChange(e, post) {
    const posts = this.state.posts;
    const key = e.target.name;
    const val = e.target.value;
    const index = e.target.parentElement.querySelector('[name="index"]').value;
    posts[index][key] = val;
    this.setState({ posts });
  }
  handleClick(e, post) {
    var newState = this.state;
    if(e === 'edit'){
      newState.show = !this.state.show;
      newState.posts.forEach(_post => {
        if (_post.id === post.id) {
          _post.show = !this.state.show;
        }
      })
    }
    this.setState(newState);
  }
  handleSubmit(e, post) {
    var posts = this.state.posts;
    var self = this;
    var newState = this.state;
    // removes the 'show' attribute from the inquiry else it errors when referenced in the db.
    posts = posts.map(_post => {
      delete _post.show;
      return _post;
    })
    var postsPromise;
      if(e === 'delete') {
        posts.forEach((_post, index) => {
          if(_post.id === post.id) {
            posts.splice(index, 1);
            postsPromise = axios.delete(config.server + '/posts', {
              params: { 'id': post.id },
              headers: {'Authorization': localStorage.token }
            });
          }
        });
      } else if(e && e.target && e.target.name === 'add') {
        e.preventDefault();
        var newpost = {
          title: e.target.querySelector('input[name="title"]') && e.target.querySelector('input[name="title"]').value,
          body: e.target.querySelector('textarea[name="body"]') && e.target.querySelector('textarea[name="body"]').value,
          url: e.target.querySelector('input[name="url"]') && e.target.querySelector('input[name="url"]').value,
          tags: e.target.querySelector('input[name="tags"]') && e.target.querySelector('input[name="tags"]').value
        };
        postsPromise = axios.post(config.server + '/post',
          [newpost], {
          headers: {'Authorization': localStorage.token}
        })
        .then(serverResponse => {
          newState.posts.push(newpost) 
        })
      } else {
        if (e.preventDefault) { e.preventDefault(); }
        postsPromise = axios.post(config.server + '/posts',
          posts, {
          headers: {'Authorization': localStorage.token}
        })
      }  
      postsPromise = postsPromise || Promise.reject('No promise provided..')
      postsPromise.then(function successcallback(response){
        self.forceUpdate();
      })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {
    if (!this.state.posts) {
      this.getPosts();
      return (
        <div id="posts">Getting posts..</div>
      )
    } else {
      const loggedIn = this.props.loggedIn;
      // const preview = this.state.show;
      // can see _ONLY_ edit view while logged in
      const editView = loggedIn;
      return (
        <div id="posts" >
          { editView 
            ? <div>
              <div id="addPost" key="index" className="jumbotron">
                <form name="add" onSubmit={this.handleSubmit}>
                  <table>
                    <tbody>
                      <tr>
                        <td></td>
                        <td>
                          <h3> New Post </h3>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <input type="hidden" name="index" />
                          Title: 
                        </td>
                        <td>
                          <input type="text"
                            name="title"
                            value={this.state.title}
                            placeholder=" " 
                            required />
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
                        <td>
                          Tags: 
                        </td>
                        <td>
                          <input type="text"
                            name="tags"
                            value={this.state.tags}
                            placeholder=" " />
                        </td>
                      </tr>
                      <tr>
                        <td>
                          Body: 
                        </td>
                        <td>
                          <textarea type="text"
                            name="body"
                            value={this.state.body}
                            placeholder=" " 
                            required /><br/>
                          <input type="submit" value="Save" className="pull-right"/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </form>
              </div>
              <div id="editPosts">
                { this.state.posts.map((post, index) => 
                  {
                    return (
                      <div key={index} >
                        <div className="panel panel-default col-md-4">
                          <div className="panel-heading">
                            <h3 className="panel-title">
                              {post.title} <button onClick={ () => this.handleClick('edit', post) }>Edit</button>
                              <button onClick={ () => this.handleSubmit('delete', post) }>Delete</button>
                            </h3>
                          </div>
                          { post.show
                            ? <form onSubmit={this.handleSubmit}>
                              <div>
                                <input type="hidden" name="index" value={index} />
                                <input type="hidden" name="id" value={post.id} />
                                Title: <input
                                  name="title"
                                  value={this.state.title}
                                  onChange={this.handleChange}
                                  defaultValue={post.title} /><br/>
                                Body: <textarea
                                  name="body"
                                  value={this.state.body}
                                  onChange={this.handleChange}
                                  defaultValue={post.body} /><br/>
                                Url: <input
                                  name="url"
                                  value={this.state.url}
                                  onChange={this.handleChange}
                                  defaultValue={post.url} /><br/>
                                Tags: <input
                                  name="tags"
                                  value={this.state.tags}
                                  onChange={this.handleChange}
                                  defaultValue={post.tags} /><br/>
                                <input type="submit" value="Save" className="pull-right" />
                              </div>
                              </form>
                            : <div>
                                <div className="panel-body"> {post.body} </div>
                                <div className="panel-footer">Logged: {post.date} Tags: {post.tags} </div>
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
                <div id="latestPost" className="jumbotron">
                <h2> Latest Entry</h2><br/>
                  {
                    this.state.posts.slice(0,1).map((post, index) => 
                    {
                      return (
                        <div key={index}>
                          <div className="panel panel-default">
                            <div className="panel-heading">
                              <h3 className="panel-title">
                                {post.title}
                              </h3>
                            </div>
                            <div className="panel-body"> 
                            <p>{post.body}</p>
                            <p>URL: <a href="{post.url}">{post.url}</a> </p>
                          </div>
                            <div className="panel-footer">Logged: {post.date} | Tags: {post.tags} </div>
                          </div>
                        </div>
                      );
                    })
                  }     
                  </div>
                  <div id="allPosts"  className="row match-my-cols">
                  {
                    this.state.posts.slice(1,25).map((post, index) => 
                    {
                      return (
                        <div key={index}>
                          <div className="panel panel-default">
                            <div className="panel-heading">
                              <h3 className="panel-title">
                                {post.title}
                              </h3>
                            </div>
                            <div className="panel-body"> 
                              <p>{post.body}</p>
                              <p>URL: <a href="{post.url}">{post.url}</a> </p>
                            </div>
                            <div className="panel-footer">Logged: {post.date} | Tags: {post.tags} </div>
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
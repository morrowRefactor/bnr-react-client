import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Homepage from '../Homepage/Homepage';
import BrowseVideos from '../BrowseVideos/BrowseVideos';
import MainVideoPage from '../MainVideoPage/MainVideoPage';
import AddVideos from '../AddVideos/AddVideos';
import APIContext from '../APIContext';
import config from '../config';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navbar: 'hidden',
      videos: [],
      vidResources: [],
      comments: [],
      users: [],
      tagsRef: [],
      vidTags: []
    };
  };

  updateState = () => {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/videos`),
      fetch(`${config.API_ENDPOINT}/api/vid-resources`),
      fetch(`${config.API_ENDPOINT}/api/comments`),
      fetch(`${config.API_ENDPOINT}/api/users`),
      fetch(`${config.API_ENDPOINT}/api/tags`),
      fetch(`${config.API_ENDPOINT}/api/vid-tags`)
    ])
    .then(([vidRes, vidResoRes, commRes, userRes, tagsRes, vidTagsRes]) => {
      if (!vidRes.ok)
        return vidRes.json().then(e => Promise.reject(e));
      if (!vidResoRes.ok)
        return vidResoRes.json().then(e => Promise.reject(e));
      if (!commRes.ok)
        return commRes.json().then(e => Promise.reject(e));
      if (!userRes.ok)
        return userRes.json().then(e => Promise.reject(e));
      if (!tagsRes.ok)
        return tagsRes.json().then(e => Promise.reject(e));
      if (!vidTagsRes.ok)
        return vidTagsRes.json().then(e => Promise.reject(e));
      return Promise.all([vidRes.json(), vidResoRes.json(), commRes.json(), userRes.json(), tagsRes.json(), vidTagsRes.json()]);
    })
    .then(([videos, vidResources, comments, users, tags, vidTags]) => {
      this.setState({
        videos: videos,
        vidResources: vidResources,
        comments: comments,
        users: users,
        tagsRef: tags,
        vidTags: vidTags
      })
    })
    .catch(error => {
      console.error({error});
    });
  }

  componentDidMount() {
    this.updateState();
  }

  // toggle visibility of navbar
  toggleNav = () => {
    const css = (this.state.navbar === 'hidden') ? 'show' : 'hidden';
    this.setState({
      navbar: css
    });
  };

  render() {
    const value = {
      navbar: this.state.navbar,
      videos: this.state.videos,
      vidResources: this.state.vidResources,
      comments: this.state.comments,
      users: this.state.users,
      tagsRef: this.state.tagsRef,
      vidTags: this.state.vidTags,
      refreshState: this.updateState,
      toggleNav: this.toggleNav
    };

    return (
      <APIContext.Provider value={value}>
        <div className="App">
          <NavBar />
          <Route
            path='/videos/:vid'
            component={MainVideoPage}
          />
          <Route
            exact
            path='/browse-videos'
            component={BrowseVideos}
          />
          <Route
            exact
            path='/add-video'
            component={AddVideos}
          />
          <Route 
            exact
            path='/'
            component={Homepage}
          />
        </div>
      </APIContext.Provider>
    );
  };
};

export default App;

import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Homepage from '../Homepage/Homepage';
import Footer from '../Footer/Footer';
import BrowseVideos from '../BrowseVideos/BrowseVideos';
import MainVideoPage from '../MainVideoPage/MainVideoPage';
import AddVideos from '../AddVideos/AddVideos';
import EditVideos from '../EditVideos/EditVideos';
import UserLogin from '../UserLogin/UserLogin';
import CreateUser from '../CreateUser/CreateUser';
import UserProfile from '../UserProfile/UserProfile';
import EditUser from '../EditUser/EditUser';
import ResetPassword from '../ResetPassword/ResetPassword';
import TempPasswordConfirm from '../TempPasswordConfirm/TempPasswordConfirm';
import ChangePassword from '../ChangePassword/ChangePassword';
import PrivateRoute from '../Utils/PrivateRoute';
import PublicOnlyRoute from '../Utils/PublicOnlyRoute';
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
            path='/edit-video/:vid'
            component={EditVideos}
          />
          <Route
            exact
            path='/create-account'
            component={CreateUser}
          />
          <Route
            exact
            path='/login'
            component={UserLogin}
          />
          <PrivateRoute
            path='/my-account/:uid'
            component={UserProfile}
          />
          <PrivateRoute
            path='/edit-account/:uid'
            component={EditUser}
          />
          <PublicOnlyRoute
            exact
            path='/reset-password'
            component={ResetPassword}
          />
          <PublicOnlyRoute
            path='/reset-password-confirm/:id'
            component={TempPasswordConfirm}
          />
          <PrivateRoute
            path='/change-password/:uid'
            component={ChangePassword}
          />
          <Route 
            exact
            path='/'
            component={Homepage}
          />
          <Footer />
        </div>
      </APIContext.Provider>
    );
  };
};

export default withRouter(App);

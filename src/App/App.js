import React, { Component } from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import NavBar from '../NavBar/NavBar';
import Homepage from '../Homepage/Homepage';
import About from '../About/About';
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
import AdminPortal from '../AdminPortal/AdminPortal';
import EditSiteText from '../EditSiteText/EditSiteText';
import NotFound from '../NotFound/NotFound';
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
      vidTags: [],
      siteText: [],
      isAdmin: '',
      loading: true
    };
  };

  updateState = () => {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/videos`),
      fetch(`${config.API_ENDPOINT}/api/vid-resources`),
      fetch(`${config.API_ENDPOINT}/api/comments`),
      fetch(`${config.API_ENDPOINT}/api/users`),
      fetch(`${config.API_ENDPOINT}/api/tags`),
      fetch(`${config.API_ENDPOINT}/api/vid-tags`),
      fetch(`${config.API_ENDPOINT}/api/site-text`)
    ])
    .then(([vidRes, vidResoRes, commRes, userRes, tagsRes, vidTagsRes, siteTextRes]) => {
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
      if (!siteTextRes.ok)
        return siteTextRes.json().then(e => Promise.reject(e));
      return Promise.all([vidRes.json(), vidResoRes.json(), commRes.json(), userRes.json(), tagsRes.json(), vidTagsRes.json(), siteTextRes.json()]);
    })
    .then(([videos, vidResources, comments, users, tags, vidTags, siteText]) => {
      this.setState({
        videos: videos,
        vidResources: vidResources,
        comments: comments,
        users: users,
        tagsRef: tags,
        vidTags: vidTags,
        siteText: siteText,
        loading: false
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

  setAdmin = () => {
    this.setState({
      isAdmin: true
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
      siteText: this.state.siteText,
      isAdmin: this.state.isAdmin,
      refreshState: this.updateState,
      toggleNav: this.toggleNav,
      setAdmin: this.setAdmin
    };

    return (
      <APIContext.Provider value={value}>
        <div className="App">
          <NavBar />
          <Switch>
            <Route 
              path='/about'
              component={About}
            />
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
            <PrivateRoute
              path='/admin'
              component={AdminPortal}
            />
            <PrivateRoute
              path='/edit-site-text'
              component={EditSiteText}
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
            <Route
              component={NotFound}
            />
          </Switch>
          {this.state.loading === true ? 
            <Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
            />
            : ''
          }
        </div>
      </APIContext.Provider>
    );
  };
};

export default withRouter(App);

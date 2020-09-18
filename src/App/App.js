import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Homepage from '../Homepage/Homepage';
import MainVideoPage from '../MainVideoPage/MainVideoPage';
import APIContext from '../APIContext';
import config from '../config';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navbar: 'hidden',
      videos: [],
      vidResources: []
    };
  };

  updateState = () => {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/videos`),
      fetch(`${config.API_ENDPOINT}/api/vid-resources`)
    ])
    .then(([vidRes, vidResoRes]) => {
      if (!vidRes.ok)
        return vidRes.json().then(e => Promise.reject(e));
      if (!vidResoRes.ok)
        return vidResoRes.json().then(e => Promise.reject(e));
      return Promise.all([vidRes.json(), vidResoRes.json()]);
    })
    .then(([videos, vidResources]) => {
      this.setState({
        videos: videos,
        vidResources: vidResources
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
            path='/'
            component={Homepage}
          />
        </div>
      </APIContext.Provider>
    );
  };
};

export default App;

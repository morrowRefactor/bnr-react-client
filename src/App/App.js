import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';
import Homepage from '../Homepage/Homepage';
import APIContext from '../APIContext';
import config from '../config';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      navbar: 'hidden',
      videos: []
    };
  };

  updateState = () => {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/videos`)
    ])
    .then(([vidRes]) => {
      if (!vidRes.ok)
        return vidRes.json().then(e => Promise.reject(e));
      return Promise.all([vidRes.json()]);
    })
    .then(([videos]) => {
      this.setState({
        videos: videos
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
      toggleNav: this.toggleNav
    };

    return (
      <APIContext.Provider value={value}>
        <div className="App">
          <NavBar />
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

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import TokenService from '../services/token-service';
import APIContext from '../APIContext';
import './NavBar.css';

class Navbar extends Component {
    static contextType = APIContext;

    handleLogoutClick = () => {
        TokenService.clearAuthToken()
    };

    renderLogoutLink() {
        return (
          <li className='topNavLink'>
            <Link
              onClick={this.handleLogoutClick}
              to='/'>
              Logout
            </Link>
          </li>
        );
    };

    renderAccountLink() {
      const token = TokenService.getAuthToken();
      const user = jwt_decode(token);
      const link = `/my-account/${user.id}`;
      
        return (
          <li className='topNavLink'>
            <Link
              to={link}>
              My Account
            </Link>
          </li>
        );
    };

    renderPlaceholder() {
      return (
        <span></span>
      );
    };
    
    renderCreateLink() {
        return (
          <li>
            <Link
              to='/create-account'
              className='topNavLink'>
              Create Account
            </Link>
          </li>
        );
    };

    renderLoginLink() {
      return (
        <li>
          <Link
            to='/login'
            className='topNavLink'>
            Log in
          </Link>
        </li>
      );
  };

    render() {
        return (
            <nav className='Topnav'>
                <div className='topNavHeader'><Link className='topnavHeaderLink' to='/'>Beer and News Report</Link></div>
                <div className='hamburger'><button className='hamburgerButton' onClick={() => {this.context.toggleNav()}}>&#9776;</button></div>
                <div className='break'></div>
                <ul className={this.context.navbar}>
                    <li><Link className='topNavLink' to='/browse-videos'>Videos</Link></li>
                    <li><Link className='topNavLink' to='/about'>About</Link></li>
                    {TokenService.hasAuthToken()
                        ? this.renderAccountLink()
                        : this.renderPlaceholder()
                    }
                    {TokenService.hasAuthToken()
                        ? this.renderLogoutLink()
                        : this.renderCreateLink()
                    }
                    {TokenService.hasAuthToken()
                        ? this.renderPlaceholder()
                        : this.renderLoginLink()
                    }
                    <li><Link className='topNavLink' to='/add-video'>Admin</Link></li>
                </ul>
            </nav>
        );
    };
};

export default Navbar;
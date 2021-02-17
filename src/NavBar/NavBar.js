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
      const link = user.id === 1 ? `/add-video` : `/my-account/${user.id}`;
      const text = user.id === 1 ? 'Admin' : 'My Account';
      
        return (
          <li className='topNavLink'>
            <Link
              to={link}>
              {text}
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
                <div className='topNavLogo'><img className='topNavLogoImage' src='https://user-images.githubusercontent.com/58446465/107416221-15b3ae80-6ac9-11eb-8174-17dadab597d2.png' alt='Beer and News Report Logo' title='Beer and News Report' /></div>
                <div className='topNavHeader'><Link className='topnavHeaderLink' to='/'>Beer and News Report</Link></div>
                <div className='hamburger'><button className='hamburgerButton' onClick={() => {this.context.toggleNav()}}>&#9776;</button></div>
                <div className='break'></div>
                <section className={this.context.navbar}>
                  <section className='TopNav_contentContainer'>
                    <ul>
                        <li><Link className='topNavLink' to='/browse-videos'>Videos</Link></li>
                        <li><Link className='topNavLink' to='/about'>About/Contact</Link></li>
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
                    </ul>
                    <section className='TopNav_socialIcons'>
                        <div className='topNavSocialIcon'>
                            <a href='https://www.youtube.com/channel/UCZlO4MI8tj0kwA_gOXsdVFQ'><img className='topNavSocialImage' alt='YouTube Social Link' src='https://user-images.githubusercontent.com/58446465/104520663-585c9680-55b0-11eb-8d93-0c41407cfffb.png' /></a>
                        </div>
                        <div className='topNavSocialIcon'>
                            <a href='https://www.linkedin.com/in/amaurice/'><img className='topNavSocialImage' alt='LinkedIn Social Link' src='https://user-images.githubusercontent.com/58446465/104520660-55fa3c80-55b0-11eb-8ef8-848dc218f040.png' /></a>
                        </div>
                        <div className='topNavSocialIcon'>
                            <a href='https://www.facebook.com/beerandnewsreport/'><img className='topNavSocialImage' alt='Facebook Social Link' src='https://user-images.githubusercontent.com/58446465/104520653-5397e280-55b0-11eb-9fad-887eee046c98.png' /></a>
                        </div>
                    </section>
                  </section>
                </section>
            </nav>
        );
    };
};

export default Navbar;
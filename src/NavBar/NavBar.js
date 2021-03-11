import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import TokenService from '../services/token-service';
import APIContext from '../APIContext';
import './NavBar.css';

class Navbar extends Component {
    static contextType = APIContext;

    handleLogoutClick = () => {
        TokenService.clearAuthToken()
        this.handleMenuToggle();
    };

    handleMenuToggle = () => {
        if(window.innerWidth < 1200) {
            this.context.toggleNav()
        }
    };

    homeMenuToggle = () => {
      if(this.context.navbar === 'show') {
        this.context.toggleNav();
      }
    };

    renderLogoutLink() {
        return (
          <li>
            <Link
              className='topNavLink'
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
      const link = user.id === 1 ? `/admin` : `/my-account/${user.id}`;
      const text = user.id === 1 ? 'Admin' : 'My Account';
      
        return (
          <li>
            <Link
              className='topNavLink'
              to={link}
              onClick={() => {this.handleMenuToggle()}}>
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
              className='topNavLink'
              onClick={() => {this.handleMenuToggle()}}>
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
            className='topNavLink'
            onClick={() => {this.handleMenuToggle()}}>
            Log in
          </Link>
        </li>
      );
  };

    render() {
      const classAdj = this.props.location.pathname.includes('browse-videos') ? 'Topnav browseVids' : 'Topnav';
        return (
            <nav className={classAdj}>
                <div className='topNavLogo'><img className='topNavLogoImage' src='https://user-images.githubusercontent.com/58446465/107416221-15b3ae80-6ac9-11eb-8174-17dadab597d2.png' alt='Beer and News Report Logo' title='Beer and News Report' /></div>
                <div className='topNavHeader'><Link className='topnavHeaderLink' to='/' onClick={() => {this.homeMenuToggle()}}>Beer and News Report</Link></div>
                <div className='hamburger'><button className='hamburgerButton' onClick={() => {this.context.toggleNav()}}>&#9776;</button></div>
                <div className='break'></div>
                <section className={this.context.navbar}>
                  <section className='TopNav_contentContainer'>
                    <ul>
                        <li><Link className='topNavLink' to='/browse-videos' onClick={() => {this.handleMenuToggle()}}>Videos</Link></li>
                        <li><Link className='topNavLink' to='/about' onClick={() => {this.handleMenuToggle()}}>About/Contact</Link></li>
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
                            <a href='https://www.youtube.com/channel/UCZlO4MI8tj0kwA_gOXsdVFQ'><img className='topNavSocialImage' alt='YouTube Social Link' src='https://user-images.githubusercontent.com/58446465/110840664-dad4a000-8259-11eb-89b4-f440d92f335c.png' /></a>
                        </div>
                        <div className='topNavSocialIcon'>
                            <a href='https://www.linkedin.com/in/amaurice/'><img className='topNavSocialImage' alt='LinkedIn Social Link' src='https://user-images.githubusercontent.com/58446465/110840663-da3c0980-8259-11eb-865f-b4ed1b6276d3.png' /></a>
                        </div>
                        <div className='topNavSocialIcon'>
                            <a href='https://www.facebook.com/beerandnewsreport/'><img className='topNavSocialImage' alt='Facebook Social Link' src='https://user-images.githubusercontent.com/58446465/110840665-dad4a000-8259-11eb-9061-b1cda4086eec.png' /></a>
                        </div>
                    </section>
                  </section>
                </section>
            </nav>
        );
    };
};

export default withRouter(Navbar);
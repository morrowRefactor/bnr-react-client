import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './NavBar.css';

class Navbar extends Component {
    static contextType = APIContext;

    render() {
        return (
            <nav className='Topnav'>
                <div className='topNavHeader'><Link className='topnavHeaderLink' to='/'>Beer and News Report</Link></div>
                <div className='hamburger'><button className='hamburgerButton' onClick={() => {this.context.toggleNav()}}>&#9776;</button></div>
                <div className='break'></div>
                <ul className={this.context.navbar}>
                    <li><Link className='topNavLink' to='/browse-videos'>Videos</Link></li>
                    <li><Link className='topNavLink' to='/about'>About</Link></li>
                </ul>
            </nav>
        );
    };
};

export default Navbar;
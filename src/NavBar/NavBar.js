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
                    <li><a className='topNavLink' href='https://github.com/morrowRefactor' target='_blank' title='Kurt Morrow GitHub' rel='noopener noreferrer'>Videos</a></li>
                    <li><Link className='topNavLink' to='/about'>About</Link></li>
                </ul>
            </nav>
        );
    };
};

export default Navbar;
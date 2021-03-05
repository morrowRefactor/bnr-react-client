import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './AdminPortal.css';

class AdminPortal extends Component {
    static contextType = APIContext;

    render() {
        return (
            <section className='AdminPortal'>
                <h1>Admin Features</h1>
                <Link to='/add-video' className='adminLink'>Add New Video</Link>
                <Link to='/edit-site-text' className='adminLink'>Edit Site Text</Link>
                <Link to='/my-account/1' className='adminLink'>Edit Profile</Link>
            </section>
        );
    }
}

export default AdminPortal;
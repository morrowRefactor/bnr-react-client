import React, { Component } from 'react';
import APIContext from '../APIContext';
import './NotFound.css';

class NotFound extends Component {
    static contextType = APIContext;

    render() {
        
        return (
            <section className='NotFound'>
                <p>Oops! Looks like there's nothing here.</p>
            </section>
        );
    }
}

export default NotFound;
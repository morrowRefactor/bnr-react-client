import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './VideoBlock.css';

class VideoBlock extends Component {
    static contextType = APIContext;

    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    }

    render() {
        const linkText = this.props.title.replace(/\s+/g, '-').toLowerCase();

        return (
            <section className='VideoBlock'>
                <div className='videoBlockImage'></div>
                <section className='VideoBlock_details'>
                    <Link 
                        className='videoBlockLink' 
                        to={`/videos/${this.props.vid}/${linkText}`}
                    >
                        <h3 className='videoBlockTitle'>{this.props.title}</h3>
                    </Link>
                    <p className='videoBlockDesc'>{this.props.description}</p>
                    <p className='videoBlockPostDate'>Posted: {this.getCleanDate(this.props.date_posted)}</p>
                </section>
            </section>
        );
    }
}

export default VideoBlock;
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
        const thumbnail = 'https://img.youtube.com/vi/' + this.props.youtube_id + '/hqdefault.jpg';

        return (
            <section className='VideoBlock'>
                <img className='videoBlockImage' src={thumbnail} alt={this.props.title} />
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
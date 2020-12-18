import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './RelatedVidBlock.css';

class RelatedVidBlock extends Component {
    static contextType = APIContext;

    truncate = str => {
        return (str.length > 75) ? str.substr(0, 74) + '... ' : str;
    };

    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    }

    render() {
        const linkText = this.props.title.replace(/\s+/g, '-').toLowerCase();
        const thumbnail = 'https://img.youtube.com/vi/' + this.props.youtube_id + '/hqdefault.jpg';

        return (
            <section className='RelatedVidBlock'>
                <img className='relatedVidBlockImage' src={thumbnail} alt={this.props.title} />
                <section className='RelatedVidBlock_details'>
                    <Link 
                        className='relatedVidBlockLink' 
                        to={`/videos/${this.props.vid}/${linkText}`}
                    >
                        <h3 className='relatedVidBlockTitle'>{this.props.title}</h3>
                    </Link>
                    <p className='relatedVidBlockDesc'>{this.truncate(this.props.description)}</p>
                    <p className='relatedVidBlockPostDate'>Posted: {this.getCleanDate(this.props.date_posted)}</p>
                </section>
            </section>
        );
    }
}

export default RelatedVidBlock;
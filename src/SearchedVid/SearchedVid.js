import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './SearchedVid.css';

class SearchedVid extends Component {
    static contextType = APIContext;

    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    };

    scrollUp = () => {
        window.scrollTo(0, 0)
    };

    render() {
        const linkText = this.props.title.replace(/\s+/g, '-').toLowerCase();
        const thumbnail = 'https://img.youtube.com/vi/' + this.props.youtube_id + '/hqdefault.jpg';

        return (
            <section className='SearchedVid'>
                <div className='searchedVidClear'>
                    <button onClick={() => this.props.clearSearch()}>Clear</button>
                </div>
                <section className='SearchedVid_content'>
                    <Link 
                        className='searchedVidLink'
                        onClick={() => this.scrollUp()} 
                        to={`/videos/${this.props.vid}/${linkText}`}
                    >
                        <img className='searchedVidImage' src={thumbnail} alt={this.props.title} />
                    </Link>
                    <section className='SearchedVid_details'>
                        <Link 
                            className='searchedVidLink'
                            onClick={() => this.scrollUp()} 
                            to={`/videos/${this.props.vid}/${linkText}`}
                        >
                            <h3 className='searchedVidTitle'>{this.props.title}</h3>
                        </Link>
                        <p className='searchedVidDesc'>{this.props.description}</p>
                        <p className='searchedVidPostDate'>Posted: {this.getCleanDate(this.props.date_posted)}</p>
                    </section>
                </section>
            </section>
        );
    }
}

export default SearchedVid;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VideoResources from '../VideoResources/VideoResources';
import VideoBlock from '../VideoBlock/VideoBlock';
import APIContext from '../APIContext';
import './MainVideoPage.css';

class MainVideoPage extends Component {
    static contextType = APIContext;

    getVideos() {
        this.context.refreshState();
    }

    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    }

    render() {
        let video = {
            id: this.props.match.params.vid,
            title: '',
            description: '',
            embed_code: '',
            date_posted: ''
        };

        let vidResources = [];

        // since component is stateless, check context to fetch data if needed
        if(this.context.videos.length < 1 || this.context.vidResources.length < 1) {
            this.getVideos();
        }
        else {
            const thisVid = this.context.videos.find(({id}) => id === parseInt(this.props.match.params.vid));
            video = {
                id: thisVid.id,
                title: thisVid.title,
                description: thisVid.description,
                embed_code: thisVid.embed_code,
                date_posted: thisVid.date_posted
            }
            const param = parseInt(this.props.match.params.vid);
            const thisVidReso = this.context.vidResources.filter(function(vid) {
                return vid.vid_id === param
            });
            if(thisVidReso.length > 0) {
                vidResources = thisVidReso
            }
        }

        function resourcesHeader() {
            if(vidResources.length > 0) {
                return (
                    <h3>Resources for this Video</h3>
                )
            }
        }

        function resourcesList() {
            if(vidResources.length > 0) {
                return vidResources.map(res =>
                    <VideoResources
                        key={res.id}
                        description={res.description}
                        link={res.link}
                    />
                );
            }
        }

        return (
            <section className='MainVideoPage'>
                <h1 className='mainVideoPageTitle'>{video.title}</h1>
                <p className='mainVideoDesc'>{video.description}</p>
                <p className='mainVideoDate'>{this.getCleanDate(video.date_posted)}</p>
                {resourcesHeader()}
                {resourcesList()}
            </section>
        );
    }
}

export default MainVideoPage;
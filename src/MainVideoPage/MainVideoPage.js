import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VideoResources from '../VideoResources/VideoResources';
import Comments from '../Comments/Comments';
import VideoBlock from '../VideoBlock/VideoBlock';
import APIContext from '../APIContext';
import config from '../config';
import './MainVideoPage.css';

class MainVideoPage2 extends Component {
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
        let video = { id: this.props.match.params.vid, title: '', description: '', embed_code: '', date_posted: '' };
        let vidResources = [];
        let comments = [];

        // since component is stateless, check context to fetch data if needed
        if(this.context.videos.length < 1) {
            this.getVideos();
        }
        else {
            const thisVid = this.context.videos.find(({id}) => id === parseInt(this.props.match.params.vid));
            video = thisVid;

            const param = parseInt(this.props.match.params.vid);
            const thisVidReso = this.context.vidResources.filter(function(vid) {
                return vid.vid_id === param;
            });
            if(thisVidReso.length > 0) {
                vidResources = thisVidReso;
            }

            const vidComments = this.context.comments.filter(function(comm) {
                return comm.vid_id === param;
            });
            
            if(vidComments.length > 0) {
                const sortDates = vidComments.sort(function(a,b){
                    return new Date(b.date_posted) - new Date(a.date_posted);
                });
                comments = sortDates;
            }
        }

        function renderResourcesHeader() {
            if(vidResources.length > 0) {
                return (
                    <h3>Resources for this Video</h3>
                )
            }
        }

        function renderResourcesList() {
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

        function renderComments() {
            if(comments.length > 0) {
                return comments.map(comm =>
                    <Comments
                        key={comm.id}
                        uid={comm.uid}
                        comment={comm.comment}
                        date_posted={comm.date_posted}
                    />
                );
            }
        }

        return (
            <section className='MainVideoPage'>
                <h1 className='mainVideoPageTitle'>{video.title}</h1>
                <p className='mainVideoDesc'>{video.description}</p>
                <p className='mainVideoDate'>{this.getCleanDate(video.date_posted)}</p>
                {renderResourcesHeader()}
                {renderResourcesList()}
                <h3>Comments</h3>
                {renderComments()}
            </section>
        );
    }
}

export default MainVideoPage2;
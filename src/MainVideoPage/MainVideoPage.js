import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {FacebookShareButton, FacebookIcon, LinkedinShareButton, LinkedinIcon, TwitterShareButton, TwitterIcon} from "react-share";
import VideoResources from '../VideoResources/VideoResources';
import AddComment from '../AddComment/AddComment';
import Comments from '../Comments/Comments';
import RelatedVidBlock from '../RelatedVidBlock/RelatedVidBlock';
import TokenService from '../services/token-service';
import jwt_decode from 'jwt-decode';
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

    renderShareButtons = title => {
        const linkText = title.replace(/\s+/g, '-').toLowerCase();
        const url = `http://www.beerandnewsreport.com/videos/${this.props.match.params.vid}/${linkText}`;
        return (
            <p className='mainVideoShareIcons'>
                    <FacebookShareButton 
                        url={url}
                        quote={`${title} - Beer and News Report`}
                        hashtag="#beerandnewsreport"
                        className='socialShareButton'>
                        <FacebookIcon size={20} />
                    </FacebookShareButton>
                    <TwitterShareButton 
                        url={url}
                        quote={`${title} - Beer and News Report`}
                        hashtag="#beerandnewsreport"
                        className='socialShareButton'>
                        <TwitterIcon size={20} />
                    </TwitterShareButton>
                    <LinkedinShareButton 
                        url={url}
                        quote={`${title} - Beer and News Report`}
                        hashtag="#beerandnewsreport"
                        className='socialShareButton'>
                        <LinkedinIcon size={20} />
                    </LinkedinShareButton>
            </p>
        )
    }

    render() {
        const vidCheck = this.context.videos.find( ({ id }) => id === parseInt(this.props.match.params.vid));
        let video = { id: this.props.match.params.vid, title: '', description: '', youtube_id: '', date_posted: '' };
        let vidResources = [];
        let comments = [];
        let vidTags = [];
        let relatedVideos;
        let extraVideos;
        let vidLink;
        let userID;

        // check for logged in users and admin
        const loggedInUser = TokenService.hasAuthToken();
        if(loggedInUser) {
            const token = TokenService.getAuthToken();
            const user = jwt_decode(token);
            userID = user.user_id;
        }

        // since component is stateless, check context to fetch data if needed
        if(this.context.videos.length < 1 || !vidCheck) {
            this.getVideos();
        }
        else {
            // populate video object
            const thisVid = this.context.videos.find(({id}) => id === parseInt(this.props.match.params.vid));
            video = thisVid;

            //populate video resources object
            const param = parseInt(this.props.match.params.vid);
            const thisVidReso = this.context.vidResources.filter(function(vid) {
                return vid.vid_id === param;
            });
            if(thisVidReso.length > 0) {
                vidResources = thisVidReso;
            }

            // populate video tags object
            const tags = this.context.vidTags.filter(function(vid) {
                return vid.vid_id === param;
            });
            vidTags = tags;

            // get list of tags for the video, then push all videos matching those tags to new array
            const tagList = vidTags.map(t => t.tag_id);
            let vidTagMatches = [];
            tagList.forEach(tag => 
                vidTagMatches.push(
                    this.context.vidTags.filter(function(t) {
                        return t.tag_id === tag
                    })
                )
            );

            // take list of matching vidTags and create clean array of unique video IDs
            let fullVidIDList = [];
            for (let i = 0; i < vidTagMatches.length; i++) {
                let arr = vidTagMatches[i].map(v => v.vid_id);
                arr.forEach(id => fullVidIDList.push(id))
            };
            const uniqueVidIDs = [...new Set(fullVidIDList)];
            const index = uniqueVidIDs.indexOf(video.id);
            if (index > -1) {
                uniqueVidIDs.splice(index, 1);
            }

            // use clean list of unique video IDs to create array of related video objects
            let relatedVids = [];
            uniqueVidIDs.forEach(vid => 
                relatedVids.push(
                    this.context.videos.find(({id}) => id === vid)
                )
            );
            const sortRelatedVids = relatedVids.sort(function(a,b){
                return new Date(b.date_posted) - new Date(a.date_posted);
            });

            const getRecents = sortRelatedVids.slice(0, 5);

            relatedVideos = getRecents.map(vid => 
                <RelatedVidBlock
                    key={vid.id}
                    vid={vid.id}
                    title={vid.title}
                    description={vid.description}
                    date_posted={vid.date_posted}
                    youtube_id={vid.youtube_id}
                />
            );

            // add more videos if needed to Related Videos section
            if(getRecents.length < 10) {
                let allVids = this.context.videos.sort(function(a,b){
                    return new Date(b.date_posted) - new Date(a.date_posted);
                });
                let allOtherVids = allVids.filter(function(e) {
                    return e.id !== video.id;
                })
        
                uniqueVidIDs.forEach(e => {
                    let index;
                    for(let i = 0; i < allOtherVids.length; i++) {
                        if(allOtherVids[i].id === e) {
                            index = allOtherVids.indexOf(allOtherVids[i]);
                            allOtherVids.splice(index, 1);
                        }
                    }}
                )

                const delta = allOtherVids.slice(0, (10 - getRecents.length));
                extraVideos = delta.map(vid => 
                    <RelatedVidBlock
                        key={vid.id}
                        vid={vid.id}
                        title={vid.title}
                        description={vid.description}
                        date_posted={vid.date_posted}
                        youtube_id={vid.youtube_id}
                    />
                );
            }
            
            // populate comments object and render
            const vidComments = this.context.comments.filter(function(comm) {
                return comm.vid_id === param;
            });
            
            if(vidComments.length > 0) {
                const sortDates = vidComments.sort(function(a,b){
                    return new Date(b.date_posted) - new Date(a.date_posted);
                });
                comments = sortDates;
            }

            // insert video iframe
            vidLink = 'https://www.youtube.com/embed/' + video.youtube_id;
        }

        function renderResourcesHeader() {
            if(vidResources.length > 0) {
                return (
                    <h3 className='mainVideoPage_resourcesHeader'>Video Links &amp; Resources</h3>
                )
            }
        }

        function renderResourcesList() {
            if(vidResources.length > 0) {
                return vidResources.map(res =>
                    <VideoResources
                        key={res.id}
                        className='mainVideoPage_resourcesFeat'
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
                        id={comm.id}
                        uid={comm.uid}
                        comment={comm.comment}
                        date_posted={comm.date_posted}
                    />
                );
            }
            else {
                return <p className='firstToComment'>Be the first to comment!</p>
            }
        }

        
        function renderAdminOptions() {
            const link = `/edit-video/${video.id}`;
            return (
                <div className='MainVideoPage_admin'>
                    <Link to={link}>Edit/Delete Video</Link>
                </div>
            )
        }

        return (
            <section className='MainVideoPage'>
                <section className='MainVideoPage_feature'>
                    <div className='mainVideoPageVideo' id='iframe'>
                        <iframe src={vidLink} title={video.title} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    </div>
                    <div className='mainVideoDetails'>
                            <p className='mainVideoDate'>Date posted: {this.getCleanDate(video.date_posted)}</p>
                            <p className='mainVideoShare'>Share:</p>
                            {this.renderShareButtons(video.title)}
                        </div>
                    <section className='mainVideoPage_featureAbout'>
                        <h1 className='mainVideoPageTitle'>{video.title}</h1>
                        {userID === 1
                            ? renderAdminOptions()
                            : ''
                        }
                        <p className='mainVideoDesc'>{video.description}</p>
                    </section>
                    <div className={vidResources.length > 0 ? 'MainVideoPage_resources' : 'MainVideoPage_noResos'}>
                        {renderResourcesHeader()}
                        {renderResourcesList()}
                    </div>
                    <div className='MainVideoPage_comments'>
                        <h3 className='mainVideoPage_commentsHeader'>Comments</h3>
                        {renderComments()}
                        {loggedInUser
                            ? <AddComment videoID={video.id} uid={userID} />
                            : <p className='mainVideoPageLoginPrompt'><Link to={{ pathname: '/login', state: { vid: this.props.match.params.vid}}}>Log in</Link> or <Link to={{ pathname: '/create-account', state: { vid: this.props.match.params.vid}}}>create account</Link> to post a comment</p>
                        }
                    </div>
                </section>
                <div className='MainVideoPage_relatedVids'>
                    <h3 className='mainVideoPage_relatedVidsHeader'>Related Videos</h3>
                    {relatedVideos}
                    {extraVideos}
                    <p className='mainVideoPage_relatedVidsMore'><Link to='/browse-videos'>Browse all videos</Link></p>
                </div>
            </section>
        );
    }
}

export default withRouter(MainVideoPage);
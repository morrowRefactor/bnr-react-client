import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VideoResources from '../VideoResources/VideoResources';
import Comments from '../Comments/Comments';
import VideoBlock from '../VideoBlock/VideoBlock';
import APIContext from '../APIContext';
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
        const vidCheck = this.context.videos.find( ({ id }) => id === parseInt(this.props.match.params.vid));
        let video = { id: this.props.match.params.vid, title: '', description: '', embed_code: `https://www.youtube.com/embed/cywyb3Y6Qxg`, date_posted: '' };
        let vidResources = [];
        let comments = [];
        let vidTags = [];
        let relatedVideos;
        let extraVideos;
        let vidLink;

        // since component is stateless, check context to fetch data if needed
        if(this.context.comments.length < 1 || !vidCheck) {
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
                <VideoBlock
                    key={vid.id}
                    vid={vid.id}
                    title={vid.title}
                    description={vid.description}
                    date_posted={vid.date_posted}
                />
            );

            // add more videos if needed to Related Videos section
            if(getRecents.length < 5) {
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

                const delta = allOtherVids.slice(0, (5 - getRecents.length));
                extraVideos = delta.map(vid => 
                    <VideoBlock
                        key={vid.id}
                        vid={vid.id}
                        title={vid.title}
                        description={vid.description}
                        date_posted={vid.date_posted}
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
            vidLink = `https://www.youtube.com/embed/cywyb3Y6Qxg`
        }

        function renderResourcesHeader() {
            if(vidResources.length > 0) {
                return (
                    <h3 className='mainVideoPage_resourcesHeader'>Resources for this Video</h3>
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
                        uid={comm.uid}
                        comment={comm.comment}
                        date_posted={comm.date_posted}
                    />
                );
            }
            else {
                return <p>No comments</p>
            }
        }

        return (
            <section className='MainVideoPage'>
                <h1 className='mainVideoPageTitle'>{video.title}</h1>
                <div className='mainVideoPageVideo' id='iframe'><iframe width="300" src={vidLink} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe></div>
                <p className='mainVideoDesc'>{video.description}</p>
                <p className='mainVideoDate'>{this.getCleanDate(video.date_posted)}</p>
                <div className='MainVideoPage_resources'>
                    {renderResourcesHeader()}
                    {renderResourcesList()}
                </div>
                <div className='MainVideoPage_comments'>
                    <h3 className='mainVideoPage_commentsHeader'>Comments</h3>
                    {renderComments()}
                </div>
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

export default MainVideoPage2;
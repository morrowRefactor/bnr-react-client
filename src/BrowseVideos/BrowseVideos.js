import React, { Component } from 'react';
import VideoBlock from '../VideoBlock/VideoBlock';
import APIContext from '../APIContext';
import './BrowseVideos.css';

class BrowseVideos extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props);
        this.state = {
            filteredVids: { value: [], touched: false }
        }
    };

    componentDidMount() {
        if(this.context.videos.length < 1) {
            this.context.refreshState();
        }
    }

    updateFilter = e => {
        if(e === 'all') {
            this.setState({
                filteredVids: { value: this.context.videos, touched: true }
            })
        }
        else {
            // get list of video IDs that match tag ID
            const tagMatches = this.context.vidTags.filter(function(vid) {
                return vid.tag_id === parseInt(e);
            });
            
            // pull list of videos matching video ID array
            const vidIDs = tagMatches.map(t => t.vid_id);
            let vidIDArr = [];
            vidIDs.forEach(vid => 
                vidIDArr.push(
                    this.context.videos.filter(function(v) {
                        return v.id === vid
                    })
                )
            );
            let videoMatches = [];
            vidIDArr.forEach(vid =>
                videoMatches.push(vid[0])
            )

            this.setState({
                filteredVids: { value: videoMatches, touched: true }
            })
        }
    }

    render() {
        // populate all videos by default
        if (this.context.videos.length > 1 && this.state.filteredVids.touched === false) {
            this.setState({
                filteredVids: { value: this.context.videos, touched: true }
            })
        }

        const tagsRef = this.context.tagsRef;
        const recentVids = this.state.filteredVids.value.sort(function(a,b){
            return new Date(b.date_posted) - new Date(a.date_posted);
        });
        const videos = recentVids.map(vid => 
            <VideoBlock
                key={vid.id}
                vid={vid.id}
                title={vid.title}
                description={vid.description}
                date_posted={vid.date_posted}
                youtube_id={vid.youtube_id}
            />
        );

        return (
            <section className='BrowseVideos'>
                <section className='BrowseVideos_formInfo'>
                    <section className='browseVideos_desktopAdj'>
                        <h1 className='browseVideosHeader'>Browse Videos</h1>
                        <form 
                            className='BrowseVideos_form'
                        >
                            <label htmlFor='tagsRef'>
                                Filter by content:
                            </label>
                            <select
                                name='tagsRef'
                                aria-labelledby='tagsRef'
                                id='tagsRef'
                                onChange={e => this.updateFilter(e.target.value)}
                                required
                            >
                                <option value='all'>All</option>
                                {tagsRef.map(type =>
                                    <option value={type.id} key={type.id}>
                                        {type.tag}
                                    </option>
                                )}
                            </select>
                        </form>
                    </section>
                </section>
                <section className='BrowseVideos_videos'>
                    {videos}
                </section>
            </section>
        );
    }
}

export default BrowseVideos;
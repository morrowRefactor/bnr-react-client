import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Select from 'react-select';
import VideoBlock from '../VideoBlock/VideoBlock';
import VideoGrid from '../VideoGrid/VideoGrid';
import SearchedVid from '../SearchedVid/SearchedVid';
import APIContext from '../APIContext';
import './BrowseVideos.css';

class BrowseVideos extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props);
        this.state = {
            filteredVids: { value: [], touched: false },
            searchedVid: { value: '', touched: false },
            foundVid: false,
            filterVal: 'all',
            viewOption: 'showDetails'
        }
    };

    componentDidMount() {
        if(this.context.videos.length < 1) {
            this.context.refreshState();
        }
    }

    handleSearch = searchTitle => {
        const searchedVid = this.context.videos.find(({ title }) => title === searchTitle.value);

        if(searchedVid) {
            this.setState({
                searchedVid: { value: searchTitle.value, touched: true },
                foundVid: true
            }); 
        }
        else{
            this.setState({
                searchedVid: { value: searchTitle.value, touched: true }
            });
        }
    };

    clearSearch = () => {
        this.setState({
            searchedVid: { value: '', touched: false },
            foundVid: false
        });
    };

    updateFilter = e => {
        if(e === 'all') {
            this.setState({
                filteredVids: { value: this.context.videos, touched: true },
                filterVal: 'all'
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
                filteredVids: { value: videoMatches, touched: true },
                filterVal: e
            })
        }
    };

    renderSearchedVid = () => {
        const searchedVid = this.context.videos.find(({ title }) => title === this.state.searchedVid.value);

        if(searchedVid) {
            return (
                <SearchedVid
                    key={searchedVid.id}
                    vid={searchedVid.id}
                    title={searchedVid.title}
                    description={searchedVid.description}
                    date_posted={searchedVid.date_posted}
                    youtube_id={searchedVid.youtube_id}
                    clearSearch={this.clearSearch}
                />
            )
        }
    };

    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    };

    changeView = view => {
        this.setState({
            viewOption: view
        });
    };

    render() {
        const sortDates = this.context.videos.sort(function(a,b){
            return new Date(b.date_posted) - new Date(a.date_posted);
        });
        const latestVid = sortDates[0] || {};
        const latestVidText = latestVid.title ? latestVid.title.replace(/\s+/g, '-').toLowerCase() : '';
        const latestVidThumb = 'https://img.youtube.com/vi/' + latestVid.youtube_id + '/hqdefault.jpg';
        const latestVidDesc = latestVid.description ? latestVid.description.substring(0, 200) : '';

        // populate all videos by default
        if (this.context.videos.length > 1 && this.state.filteredVids.touched === false) {
            this.setState({
                filteredVids: { value: this.context.videos, touched: true }
            })
        }

        // populate search options with video titles
        let vidTitles = [];
        this.context.videos.forEach(vid => {
            let thisVid = {};
            thisVid.value = vid.title;
            thisVid.label = vid.title;
            vidTitles.push(thisVid);
        });

        // array of videos to display based on filter criteria
        const recentVids = this.state.filteredVids.value.sort(function(a,b){
            return new Date(b.date_posted) - new Date(a.date_posted);
        });
        const filteredVids = this.state.filterVal === 'all' && window.innerWidth > 1199 ? recentVids.slice(1, recentVids.length) : recentVids;
        const videoDetails = filteredVids.map(vid => 
            <VideoBlock
                key={vid.id}
                vid={vid.id}
                title={vid.title}
                description={vid.description}
                date_posted={vid.date_posted}
                youtube_id={vid.youtube_id}
            />
        );

        const videoGrids = filteredVids.map(vid => 
            <VideoGrid
                key={vid.id}
                vid={vid.id}
                title={vid.title}
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
                            <label htmlFor='search'>
                                Search by Title:
                            </label>
                            <Select
                                id='search'
                                options={vidTitles}
                                onChange={e => this.handleSearch(e)}
                                value={vidTitles.filter(obj => obj.value === this.state.searchedVid.value)}
                                required
                            />
                            <label htmlFor='tagsRef' className='browseVidsFilter'>
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
                                {this.context.tagsRef.map(type =>
                                    <option value={type.id} key={type.id}>
                                        {type.tag}
                                    </option>
                                )}
                            </select>
                        </form>
                        <section className='BrowseVideos_desktopFeature'>
                        <h2>Latest Video</h2>
                        <h3>
                            <Link 
                                className='browseVideosVidLink' 
                                to={`/videos/${latestVid.id}/${latestVidText}`}>
                                    {latestVid.title}
                            </Link>
                        </h3>
                        <Link 
                                className='browseVideosVidLink' 
                                to={`/videos/${latestVid.id}/${latestVidText}`}><img className='browseVideosLatestVidThumb' src={latestVidThumb} alt={latestVid.title} />
                        </Link>
                        <p className='browseVidsLatestVidDate'>Date posted: {this.getCleanDate(latestVid.date_posted)}</p>
                        <p className='browseVidsLatestVidDesc'>{latestVidDesc}...</p>
                    </section>
                    </section>
                </section>
                <section className='BrowseVideos_videos'>
                    <div className={window.innerWidth > 767 ? 'browseVideosFilterOptions' : 'hidden'}>
                        <p className='filterOptionsText'>SELECT VIEW:</p>
                        <div className='filterOptionButton' onClick={() => this.changeView('showDetails')}>
                            <img className='filterOptionImage' src='https://user-images.githubusercontent.com/58446465/113230817-b400fc80-924e-11eb-8d6f-a5e78fff6a0e.png' alt='Detailed Video View' />
                        </div>
                        <div className='filterOptionButton' onClick={() => this.changeView('showGrid')}>
                            <img className='filterOptionImage' src='https://user-images.githubusercontent.com/58446465/113230818-b4999300-924e-11eb-96ae-2f76970f9348.png' alt='Grid Video View' />
                        </div>
                    </div>
                    {this.state.foundVid
                        ? <h3 className='browseVideos_subHeader'>Your search</h3>
                        : ''
                    }
                    {this.renderSearchedVid()}
                    {this.state.foundVid
                        ? <h3 className='browseVideos_subHeader'>All videos</h3>
                        : ''
                    }
                    <section className={this.state.viewOption}>
                        {this.state.viewOption === 'showDetails' ? videoDetails : videoGrids}
                        {this.context.loading === true && window.innerWidth > 767 ? 
                            <Loader
                                type="Puff"
                                color="#00BFFF"
                                height={200}
                                width={200}
                                />
                                : ''
                        }
                    </section>
                </section>
            </section>
        );
    }
}

export default BrowseVideos;
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VideoBlock from '../VideoBlock/VideoBlock';
import APIContext from '../APIContext';
import './Homepage.css';

class Homepage extends Component {
    static contextType = APIContext;

    render() {
        const sortDates = this.context.videos.sort(function(a,b){
            return new Date(b.date_posted) - new Date(a.date_posted);
        });

        const getRecents = window.innerWidth >= 1200 ? sortDates.slice(1, 6) : sortDates.slice(0, 5);
        const latestVid = sortDates[0] || {};
        const latestVidText = latestVid.title ? latestVid.title.replace(/\s+/g, '-').toLowerCase() : '';
        const latestVidThumb = 'https://img.youtube.com/vi/' + latestVid.youtube_id + '/hqdefault.jpg';
        
        const recentVids = getRecents.map(vid => 
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
            <section className='Homepage'>
                <section className='homepage_aboutDesktopAdj'>
                    <section className='Homepage_background'>
                        <p className='homepageBannerText'>With this news,<br/>you need a beer!</p>
                    </section>
                    <section className='Homepage_about'>
                        <img className='homepageImage' alt='Beer and News Report' src='https://img1.wsimg.com/isteam/ip/e5e48fd9-dca1-4bb0-a3e0-ccda5f5780e0/Cheers%202.png/:/' />
                        <div className='homepageAbout'>
                            <p>See the news from a different aspect.</p>
                            <p>Check it out.</p>
                        </div>
                    </section>
                    <section className='Homepage_desktopFeature'>
                        <h2>Latest Video</h2>
                        <h3>
                            <Link 
                                className='homepageVidLink' 
                                to={`/videos/${latestVid.id}/${latestVidText}`}>
                                    {latestVid.title}
                            </Link>
                        </h3>
                        <Link 
                                className='homepageVidLink' 
                                to={`/videos/${latestVid.id}/${latestVidText}`}><img className='homepageLatestVidThumb' src={latestVidThumb} alt={latestVid.title} /></Link>
                        <p>{latestVid.description}</p>
                    </section>
                </section>
                <div className='homepageSpacer'></div>
                <section className='RecentVideos'>
                    <h3 className='recentVideosTitle'><span>Recent Videos</span></h3>
                    {recentVids}
                </section>
            </section>
        );
    }
}

export default Homepage;
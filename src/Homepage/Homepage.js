import React, { Component } from 'react';
import VideoBlock from '../VideoBlock/VideoBlock';
import APIContext from '../APIContext';
import './Homepage.css';

class Homepage extends Component {
    static contextType = APIContext;

    render() {
        const sortDates = this.context.videos.sort(function(a,b){
            return new Date(b.date_posted) - new Date(a.date_posted);
        });

        const getRecents = sortDates.slice(0, 5);

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
                <section className='Homepage_about'>
                    <img className='homepageImage' alt='Beer and News Report' src='https://img1.wsimg.com/isteam/ip/e5e48fd9-dca1-4bb0-a3e0-ccda5f5780e0/Cheers%202.png/:/' />
                    <div className='homepageAbout'>
                        <p>With this news, you need a beer!</p>
                        <p>See the news from a different aspect.  Check it out.</p>
                    </div>
                </section>
                <section className='RecentVideos'>
                    <h3 className='recentVideosTitle'><span>Recent Videos</span></h3>
                    {recentVids}
                </section>
            </section>
        );
    }
}

export default Homepage;
import React, { Component } from 'react';
import './VideoResources.css';

class VideoResources extends Component {

    render() {
        return (
            <section className='VideoResources'>
                <p className='videoResourcesDesc'>{this.props.description}</p>
                <p className='videoResourcesLink'>{this.props.link}</p>
            </section>
        );
    }
}

export default VideoResources;
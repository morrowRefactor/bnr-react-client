import React, { Component } from 'react';
import './VideoResources.css';

class VideoResources extends Component {

    render() {
        return (
            <section className='VideoResources'>
                <p className='videoResourcesDesc'>{this.props.description}</p>
                <p className='videoResourcesLink'><a href={this.props.link} title={this.props.description}>{this.props.link}</a></p>
            </section>
        );
    }
}

export default VideoResources;
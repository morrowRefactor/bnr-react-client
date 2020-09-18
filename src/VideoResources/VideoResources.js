import React, { Component } from 'react';
import './VideoResources.css';

class VideoResources extends Component {

    render() {
        return (
            <section className='VideoResources'>
                <p>{this.props.description}</p>
                <p>{this.props.link}</p>
            </section>
        );
    }
}

export default VideoResources;
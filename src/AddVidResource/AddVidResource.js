import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import APIContext from '../APIContext';
import './AddVidResource.css';

class AddVidResource extends Component {
    static contextType = APIContext;

    render() {
        const descId = 'resDesc' + `[${this.props.id}]`;
        const linkId = 'resLink' + `[${this.props.id}]`;

        return (
            <section className='AdminVideos_formResources'>
                <label htmlFor='vidResourcesDesc'>
                    Description
                </label>
                <input
                    type='text'
                    id={descId}
                    placeholder='This article is extremely relevant and insightful'
                    required
                />
                <label htmlFor='vidResourcesLink'>
                    Link
                </label>
                <input
                    type='text'
                    id={linkId}
                    placeholder='http://www.google.com'
                    required
                />
                <button className='vidResoRemoveButton' onClick={() => this.props.removeReso(this.props.id)}>X   Delete resource</button>
            </section>
        );
    }
}

export default AddVidResource;
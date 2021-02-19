import React, { Component } from 'react';
import APIContext from '../APIContext';
import './AddVidTag.css';

class AddVidTag extends Component {
    static contextType = APIContext;

    render() {
        const tagId = 'newTag' + `[${this.props.id}]`;

        return (
            <section className='AdminVideos_formTags'>
                <label htmlFor='vidTags'>
                    New Tag
                </label>
                <input
                    type='text'
                    id={tagId}
                    placeholder='Global Chinchilla Policy'
                    required
                />
            </section>
        );
    }
}

export default AddVidTag;
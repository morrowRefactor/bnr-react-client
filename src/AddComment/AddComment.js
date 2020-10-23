import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import AuthApiService from '../services/auth-api-service';
import APIContext from '../APIContext';
import config from '../config';
import './AddComment.css';

class AddComment extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          comment: { value: '', touched: false },
        };
    };

    handleSubmit = e => {
        e.preventDefault()
        const videoID = this.props.videoID;
        const comment = this.state.comment.value;

        AuthApiService.postComment(videoID, comment)
          .then(this.context.addComment)
          .then(() => {
            text.value = ''
          })
          .catch(this.context.setError)
      }

    validateComment() {
        const comment = this.state.comment.value.trim();

        if (comment.length === 0) {
          return 'A comment is required';
        };
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };

      
    render() {
        const commError = this.validateComment();

        return (
            <section className='AddComment'>
                <form 
                    className='AddComment_form'
                    onSubmit={this.handleSubmit}
                >
                    <label htmlFor='comment'>
                        Add a comment
                    </label>
                    <input
                        type='text'
                        id='comment'
                        placeholder='Now that is some news. I need a beer!'
                        onChange={e => this.updateTitle(e.target.value)}
                        required
                    />
                    {this.state.comment.touched && (
                        <ValidationError message={commError} />
                    )}
                    <div className='AddCommentForm_buttons'>
                        <button 
                            type='submit'
                        >
                            Submit
                        </button>
                        {' '}
                        <button type='button' onClick={this.handleClickCancel}>
                            Cancel
                        </button>
                    </div>
                </form>
            </section>
        );
    }

}

export default withRouter(AddComment);
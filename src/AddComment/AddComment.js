import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import TokenService from '../services/token-service';
import APIContext from '../APIContext';
import config from '../config';
import './AddComment.css';

class AddComment extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          comment: { value: '', touched: false },
          errorText: { value: '', status: false }
        };
    };

    handleSubmit = e => {
        e.preventDefault();

        // clear any previous errors
        const commentVal = this.state.comment.value.trim();
        if(this.state.errorText.status === true && commentVal.length > 0) {
            this.setState({
                errorText: { value: '', status: false }
            });
        }

        if(commentVal.length < 1) {
            this.setState({
                comment: { value: '', touched: false },
                errorText: { value: 'Text is required to submit a comment', status: true }
            });
        }
        else {
            this.postComment();
        }
    };

    postComment = () => {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed).toISOString();
        const newComment = {
            uid: this.props.uid,
            vid_id: this.props.videoID,
            comment: this.state.comment.value,
            date_posted: today
        };
        
        fetch(`${config.API_ENDPOINT}/api/comments`, {
            method: 'POST',
            body: JSON.stringify(newComment),
            headers: {
              'content-type': 'application/json',
              'authorization': `bearer ${TokenService.getAuthToken()}`
            }
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    throw error
                })
            }

            const field = document.getElementById('comment');
            field.value = '';
            this.setState({comment: { value: '', touched: false }});
            this.context.refreshState();
            window.scrollTo(0, 0);
        })
        .catch(error => {
            this.setState({ error })
        })
    };

    updateComment(comm) {
        this.setState({comment: {value: comm, touched: true}});
    };

    validateComment() {
        const comment = this.state.comment.value.trim();

        if(this.state.errorText.status === true && comment.length > 0) {
            this.setState({
                errorText: { value: '', status: false }
            });
        }

        if (comment.length === 0) {
          return 'A comment is required';
        };
    };

    handleClickCancel = () => {
        const field = document.getElementById('comment');
        field.value = '';
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
                    <textarea
                        id='comment'
                        placeholder='Now that is some news. I need a beer!'
                        onChange={e => this.updateComment(e.target.value)}
                        required
                    />
                    {this.state.comment.touched && (
                        <ValidationError message={commError} />
                    )}
                    {this.state.errorText.status === true ? <p id='commentError'>{this.state.errorText.value}</p> : ''}
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
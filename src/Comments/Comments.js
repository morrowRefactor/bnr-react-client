import React, { Component } from 'react';
import TokenService from '../services/token-service';
import jwt_decode from 'jwt-decode';
import Popup from 'reactjs-popup';
import APIContext from '../APIContext';
import config from '../config';
import './Comments.css';

class Comments extends Component {
    static contextType = APIContext;    
    
    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    }

    handleDelete = () => {
        fetch(`${config.API_ENDPOINT}/api/comments/${this.props.id}`, {
            method: 'DELETE',
            body: JSON.stringify(),
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

            this.context.refreshState();
            this.props.history.push(`/videos/${this.props.match.params.vid}`)
        })
        .catch(error => {
            this.setState({ error })
        })
    };

    deletePopup = () => (
        <Popup trigger={<button className='userProfileDelete'> Delete comment </button>} modal nested>
          {close => (
            <div className="modal">
                <button className="close" onClick={close}>
                &times;
                </button>
                <div className="header"> Delete Comment </div>
                <div className="content">
                 {' '}
                    Are you sure you want to delete this comment?
                </div>
                <div className="actions">
                    <button 
                        className="button" 
                        onClick={() => this.handleDelete()}
                    > 
                            Yes, delete 
                    </button>
                    <button
                        className="button"
                        onClick={() => close()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
            )}
        </Popup>
    );

    render() {
        const user = this.context.users.find(({id}) => id === this.props.uid);

        return (
            <section className='Comments'>
                <p className='commentsText'>{this.props.comment}</p>
                <p className='commentsDetails'>{user.name}, {this.getCleanDate(this.props.date_posted)}</p>
                {this.context.isAdmin === true ? this.deletePopup() : ''}
            </section>
        );
    }
}

export default Comments;
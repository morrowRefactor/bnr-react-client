import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import TokenService from '../services/token-service';
import Popup from 'reactjs-popup';
import APIContext from '../APIContext';
import config from '../config';
import 'reactjs-popup/dist/index.css';
import './UserProfile.css';

class UserProfile extends Component {
    static contextType = APIContext;

    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    };

    handleDelete = () => {
        fetch(`${config.API_ENDPOINT}/api/users/${this.props.match.params.uid}`, {
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

            TokenService.clearAuthToken();
            this.props.history.push(`/`);
        })
        .catch(error => {
            this.setState({ error })
        })
    };

    deletePopup = () => (
        <Popup trigger={<button className='userProfileDelete'> Delete account </button>} modal nested>
          {close => (
            <div className="modal">
                <button className="close" onClick={close}>
                &times;
                </button>
                <div className="header"> Delete Account </div>
                <div className="content">
                 {' '}
                    Are you sure you want to delete your account?
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
        // check for user data
        const user = this.context.users.find(({ id }) => id === parseInt(this.props.match.params.uid)) || {};
        if(this.context.users.length < 1 || !user) {
            this.context.refreshState();
        }

        const passwordLink = `/change-password/${user.id}`;
        const editLink = `/edit-account/${user.id}`;

        return (
            <section className='UserProfile'>
                <section className='UserProfile_info'>
                    <h3>{user.name}</h3>
                    <p className='userProfileSubHeader'>Info</p>
                    <p>
                        Joined: {this.getCleanDate(user.joined_date)}<br/>
                        Email: {user.email}<br/>
                        About: {user.about}
                    </p>
                    <Link className='userProfileLink' to={editLink}>Edit info</Link>
                </section>
                <section className='UserProfile_manage'>
                    <p className='userProfileSubHeader'>Manage your account</p>
                    <Link className='userProfileLink' to={passwordLink}>Change password</Link>
                    <p></p>
                    {this.deletePopup()}
                </section>
            </section>
        );
    }

}

export default withRouter(UserProfile);
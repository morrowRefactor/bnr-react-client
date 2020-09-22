import React, { Component } from 'react';
import APIContext from '../APIContext';
import './Comments.css';

class Comments extends Component {
    static contextType = APIContext;    
    
    getCleanDate = (dte) => {
        const date = new Date(dte);
        const cleanDate = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();

        return cleanDate;
    }

    render() {
        const user = this.context.users.find(({id}) => id === this.props.uid);

        return (
            <section className='Comments'>
                <p className='commentsUserName'>{user.name}</p>
                <p className='commentsText'>{this.props.comment}</p>
                <p className='commentsDate'>{this.getCleanDate(this.props.date_posted)}</p>
            </section>
        );
    }
}

export default Comments;
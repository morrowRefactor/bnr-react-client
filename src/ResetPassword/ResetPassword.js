import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import APIContext from '../APIContext';
import './ResetPassword.css';

class ResetPassword extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          email: { value: '', touched: false },
          emailError: { value: '', status: false }
        };
    };

    randomString = (length, chars) => {
        let result = '';
        for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }
    

    handleSubmit = e => {
        e.preventDefault();
        
        const checkEmail = this.context.users.find(({ email }) => email === this.state.email.value);
        if(!checkEmail) {
            this.setState({
                emailError: { value: 'An account with this email address does not exist', status: true }
            });
        }
        else {
            if(this.state.emailError.status === true) {
                this.setState({
                    emailError: { value: '', status: false }
                });
            }
            
            const tempPass = this.randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            
        }
    }

    updateEmail = email => {
        this.setState({email: {value: email, touched: true}});
    };

    validateUserEmail = () => {
        const email = this.state.email.value.trim();

        if (email.length === 0) {
          return 'A valid email is required';
        };
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };

      
    render() {
        if(this.context.users.length < 1) {
            this.context.refreshState();
        }

        const emailError = this.validateUserEmail();

        return (
            <section className='ResetPassword'>
                <h1 className='ResetPasswordHeader'>Reset your password</h1>
                <div className='resetPasswordText'>
                    <p>Forgot your password? No problem!</p>
                    <p>Enter your email address below and we'll send you a temporary login code.</p>
                </div>
                <form 
                    className='ResetPassword_form'
                    onSubmit={this.handleSubmit}
                >
                    <section className='ResetPassword_formField'>
                        <label htmlFor='userEmail'>
                            Email address
                        </label>
                        <input
                            type='text'
                            id='userEmail'
                            placeholder='jane-doe@gmail.com'
                            onChange={e => this.updateEmail(e.target.value)}
                            required
                        />
                        {this.state.emailError.status
                            ? <p className='errorText'>{this.state.emailError.value}</p>
                            : ''
                        }
                        {this.state.email.touched && (
                            <ValidationError message={emailError} />
                        )}
                    </section>
                    <div className='ResetPasswordForm_buttons'>
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

export default withRouter(ResetPassword);
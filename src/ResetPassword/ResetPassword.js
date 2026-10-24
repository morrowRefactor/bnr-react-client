import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import APIContext from '../APIContext';
import AuthApiService from '../services/auth-api-service';
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

    handleSubmit = e => {
        e.preventDefault();
        const email = this.state.email.value.trim();

        // The server creates the temporary password and emails it; it responds the same way
        // whether or not the email has an account
        AuthApiService.requestPasswordReset(email)
            .then(() => {
                this.props.history.push({
                    pathname: '/reset-password-confirm/sent',
                    state: { email }
                });
            })
            .catch(error => {
                this.setState({
                    emailError: { value: 'Something went wrong. Please try again.', status: true }
                });
            })
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
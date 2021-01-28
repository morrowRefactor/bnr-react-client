import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import AuthApiService from '../services/auth-api-service';
import TokenService from '../services/token-service';
import APIContext from '../APIContext';
import config from '../config';
import './UserLogin.css';

class UserLogin extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          email: { value: '', touched: false },
          password: { value: '', touched: false }
        };
    };

    handleSubmit = e => {
        e.preventDefault();
        
        AuthApiService.postLogin({
            email: this.state.email.value,
            password: this.state.password.value,
        })
        .then(res => {
            if(!res.ok) {
                this.setState({ 
                    error: 'User Name or Password is incorrect.'
                })
            }
            
            TokenService.saveAuthToken(res.authToken)
            this.props.history.push(`/`);
        })
        .catch(res => {
            this.setState({ error: res.error })
        })
    }

    updateEmail(email) {
        this.setState({email: {value: email, touched: true}});
    };

    updatePass(pass) {
        this.setState({password: {value: pass, touched: true}});
    };

    validateUserEmail = () => {
        const email = this.state.email.value.trim();

        if (email.length === 0) {
          return 'A valid email is required';
        };
    };

    validateUserPass = () => {
        const pass = this.state.password.value.trim();

        if (pass.length === 0) {
          return 'A valid password is required';
        };
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };

      
    render() {
        const emailError = this.validateUserEmail();
        const passError = this.validateUserPass();

        return (
            <section className='UserLogin'>
                <h1 className='UserLoginHeader'>Login to your account</h1>
                <form 
                    className='UserLogin_form'
                    onSubmit={this.handleSubmit}
                >
                    <section className='UserLogin_formField'>
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
                        {this.state.email.touched && (
                            <ValidationError message={emailError} />
                        )}
                    </section>
                    <section className='UserLogin_formField'>
                        <label htmlFor='userPass'>
                            Password
                        </label>
                        <input
                            type='text'
                            id='userPass'
                            placeholder='Letmein123!'
                            onChange={e => this.updatePass(e.target.value)}
                            required
                        />
                        <p><Link className='userLoginForgotPassword' to='/reset-password'>Forgot password?</Link></p>
                        {this.state.password.touched && (
                            <ValidationError message={passError} />
                        )}
                        <div className='userLogin_formCredError'>
                            {this.state.error
                                ? this.state.error
                                : ''
                            }
                        </div>
                    </section>
                    <div className='UserLoginForm_buttons'>
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

export default withRouter(UserLogin);
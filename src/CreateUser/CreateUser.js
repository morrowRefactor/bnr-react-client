import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import AuthApiService from '../services/auth-api-service';
import TokenService from '../services/token-service';
import APIContext from '../APIContext';
import './CreateUser.css';

class CreateUser extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          name: { value: '', touched: false },
          email: { value: '', touched: false },
          password: { value: '', touched: false },
          confirmPassword: { value: '', touched: false },
          passwordError: { value: '', status: false },
          confirmPassError: { value: '', status: false }
        };
    };

    handleSubmit = e => {
        e.preventDefault();
    }

    updateUserName(name) {
        this.setState({name: {value: name, touched: true}});
    };

    updateEmail(email) {
        this.setState({email: {value: email, touched: true}});
    };

    updatePass(pass) {
        if(this.state.passwordError.value) {
            this.setState({
                password: {value: pass, touched: true},
                passwordError: { value: '', status: false }
            })
        }
        else {
            this.setState({password: {value: pass, touched: true}});
        }
    };

    updatePassConfirm(pass) {
        if(this.state.confirmPassError.value) {
            this.setState({
                confirmPassword: {value: pass, touched: true},
                confirmPassError: { value: '', status: false }
            })
        }
        else {
            this.setState({confirmPassword: {value: pass, touched: true}});
        }
    };

    validateUserName() {
        const name = this.state.name.value.trim();

        if (name.length === 0) {
          return 'Your name is required';
        };
    };

    validateUserEmail() {
        const email = this.state.email.value.trim();

        if (email.length === 0) {
          return 'A valid email is required';
        };
    };

    handleSubmit = e => {
        e.preventDefault();
        
        // validate that password has required characters
        const regexPasswordCheck = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
        if(!regexPasswordCheck.test(this.state.password.value)) {
            this.setState({
                passwordError: { 
                    value: 'Password must contain at least one capital letter, one number, one special character, and be at least 8 characters long'},
                    status: true
            });
        }
        if(this.state.password.value !== this.state.confirmPassword.value) {
            this.setState({
                confirmPassError: { 
                    value: 'Passwords must be an identical character match'},
                    status: true
            });
        }
        else {
            AuthApiService.postUser({
                name: this.state.name.value,
                email: this.state.email.value,
                password: this.state.password.value,
                joined_date: new Date()
            })
            .then(res => {
                TokenService.saveAuthToken(res.authToken);
                this.props.history.push(`/`);
            })
            .catch(res => {
                this.setState({ error: res.error })
            })
        }
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };

      
    render() {
        const nameError = this.validateUserName();
        const emailError = this.validateUserEmail();

        return (
            <section className='CreateUser'>
                <h1 className='createUserHeader'>Create an Account</h1>
                <form 
                    className='CreateUser_form'
                    onSubmit={this.handleSubmit}
                >
                    <label htmlFor='userName'>
                        Name
                    </label>
                    <input
                        type='text'
                        id='userName'
                        placeholder='Jane Doe'
                        onChange={e => this.updateUserName(e.target.value)}
                        required
                    />
                    {this.state.name.touched && (
                        <ValidationError message={nameError} />
                    )}
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
                    <label htmlFor='userPass'>
                        Password
                    </label>
                    <input
                        type='password'
                        id='userPass'
                        onChange={e => this.updatePass(e.target.value)}
                        required
                    />
                    {this.state.passwordError.value
                        ? <div className='passwordError'>{this.state.passwordError.value}</div>
                        : ''
                    }
                    <label htmlFor='userPassConfirm'>
                        Confirm Password
                    </label>
                    <input
                        type='password'
                        id='userPassConfirm'
                        onChange={e => this.updatePassConfirm(e.target.value)}
                        required
                    />
                    {this.state.confirmPassError.value
                        ? <div className='passwordError'>{this.state.cofirmPassError.value}</div>
                        : ''
                    }
                    <div className='CreateUserForm_buttons'>
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

export default withRouter(CreateUser);
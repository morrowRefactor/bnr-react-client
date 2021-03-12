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
          confirmPassError: { value: '', status: false },
          emailError: { value: '', status: false },
          showChar: false
        };
    };

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
        let flagged = 0;

        // clear any previous error messages
        if(this.state.emailError.status === true || this.state.passwordError.status === true || this.state.confirmPassError.status === true) {
            this.setState({
                emailError: { value: '', status: false},
                passwordError: { value: '', status: false},
                confirmPassError: { value: '', status: false},
            })
        }

        // check that email address doesn't already exist
        const dupeCheck = this.context.users.find(({ email }) => email === this.state.email.value);
        if(dupeCheck) {
            flagged++;
            this.setState({
                emailError : {
                    value: 'An account with this email address already exists',
                    status: true
                }
            });
        }
        
        // validate that email and password have required characters
        const emailCheck1 = this.state.email.value.indexOf('@');
        const emailCheck2 = this.state.email.value.indexOf('.');
        const regexPasswordCheck = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
        
        if(emailCheck1 === -1 || !emailCheck2 == -1) {
            flagged++;
            this.setState({
                emailError : {
                    value: 'A valid email address is required',
                    status: true
                }
            });
        }
        else if(!regexPasswordCheck.test(this.state.password.value) || this.state.password.value.length < 8) {
            flagged++;
            this.setState({
                passwordError: { 
                    value: 'Password must contain at least one capital letter, one number, one special character, and be at least 8 characters long',
                    status: true
                }
            });
        }
        else if(this.state.password.value !== this.state.confirmPassword.value) {
            flagged++;
            this.setState({
                confirmPassError: { 
                    value: 'Passwords must be an identical character match',
                    status: true
                }
            });
        }
        else {
            if(flagged === 0) {
                this.postUser();
            }     
        }
    };

    postUser = () => {
        const timeElapsed = Date.now();
        const today = new Date(timeElapsed).toISOString();
        
        AuthApiService.postUser({
            name: this.state.name.value,
            email: this.state.email.value,
            password: this.state.password.value,
            joined_date: today
        })
        .then(res => {
            if(res.authToken) {
                TokenService.saveAuthToken(res.authToken);
                this.context.refreshState();
                if(!this.props.location.state) {
                    this.props.history.push(`/my-account/${res.id}`);
                    
                }
                else {
                    this.props.history.push(`/videos/${this.props.location.state.vid}`)
                }
            }
        })
        .catch(res => {
            this.setState({ error: res.error })
        })
    }

    toggleChars = () => {
        this.setState({ showChar: this.state.showChar ? false : true });
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };

      
    render() {
        const nameError = this.validateUserName();
        const emailError = this.validateUserEmail();
        const showChar = this.state.showChar ? 'text' : 'password';

        return (
            <section className='CreateUser'>
                <h1 className='createUserHeader'>Create an Account</h1>
                <form 
                    className='CreateUser_form'
                    onSubmit={this.handleSubmit}
                >
                    <section className='CreateUser_formField'>
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
                    </section>
                    <section className='CreateUser_formField'>
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
                        {this.state.emailError.status
                            ? <div className='createUserError'>{this.state.emailError.value}</div>
                            : ''
                        }
                    </section>
                    <section className='CreateUser_formField'>
                        <label htmlFor='userPass'>
                            Password
                        </label>
                        <input
                            type={showChar}
                            id='userPass'
                            onChange={e => this.updatePass(e.target.value)}
                            required
                        />
                        <br/>
                        <button className='createUserToggleChar' onClick={() => this.toggleChars()}>Show characters</button>
                        {this.state.passwordError.status
                            ? <div className='createUserError'>{this.state.passwordError.value}</div>
                            : ''
                        }
                    </section>
                    <section className='CreateUser_formField'>
                        <label htmlFor='userPassConfirm'>
                            Confirm Password
                        </label>
                        <input
                            type={showChar}
                            id='userPassConfirm'
                            onChange={e => this.updatePassConfirm(e.target.value)}
                            required
                        />
                        {this.state.confirmPassError.status
                            ? <div className='createUserError'>{this.state.confirmPassError.value}</div>
                            : ''
                        }
                    </section>
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
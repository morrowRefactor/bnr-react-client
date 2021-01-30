import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import APIContext from '../APIContext';
import ValidationError from '../ValidationError/ValidationError';
import TokenService from '../services/token-service';
import config from '../config';
import './EditUser.css';

class EditUser extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          name: { value: '', touched: false },
          email: { value: '', touched: false },
          about: { value: '', touched: false },
          emailError: { value: '', status: false }
        };
    };
    
    handleSubmit = e => {
        e.preventDefault();

        // clear any previous errors
        if(this.state.emailError.status === true) {
            this.setState({ emailError: { value: '', status: false }});
        }
        
        if(this.state.email.touched) {
            // validate required characters in email address
            const emailCheck1 = this.state.email.value.indexOf('@');
            const emailCheck2 = this.state.email.value.indexOf('.');
            if(emailCheck1 === -1 || emailCheck2 === -1) {
                this.setState({
                    emailError : {
                        value: 'A valid email address is required',
                        status: true
                    }
                });
            }
            else {
                this.updateUser();
            }   
        }
        else {
            this.updateUser();
        }
    }

    updateUser = () => {
        const currInfo = this.context.users.find(({ id }) => id === parseInt(this.props.match.params.uid));
        const updatedInfo = {
            id: currInfo.id,
            name: this.state.name.touched ? this.state.name.value : currInfo.name,
            email: this.state.email.touched ? this.state.email.value : currInfo.email,
            about: this.state.about.touched ? this.state.about.value : currInfo.about
        };
        
        fetch(`${config.API_ENDPOINT}/api/users/${this.props.match.params.uid}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedInfo),
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

            this.props.history.push(`/my-account/${currInfo.id}`);
        })
        .catch(error => {
            this.setState({ error })
        })
    }

    updateName = name => {
        this.setState({name: {value: name, touched: true}});
    };

    updateEmail = email => {
        this.setState({email: {value: email, touched: true}});
    };

    updateAbout = text => {
        this.setState({about: {value: text, touched: true}});
    };

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
          return 'A valid user name is required';
        };
    };

    validateEmail() {
        const email = this.state.email.value.trim();
        if (email.length === 0) {
          return 'A valid email address is required';
        };
    };

    handleClickCancel = () => {
        this.props.history.push(`/my-account/${this.props.match.params.uid}`);
    };
  
    render() {
        if(this.context.users.length < 1) {
            this.context.refreshState();
        }

        const user = this.context.users.find(({ id }) => id === parseInt(this.props.match.params.uid)) || {};
        const nameError = this.validateName();
        const emailError = this.validateEmail();

        return (
            <section className='EditUser'>
                <h1 className='EditUserHeader'>Edit your info</h1>
                <form 
                    className='EditUser_form'
                    onSubmit={this.handleSubmit}
                >
                    <section className='EditUser_formField'>
                        <label htmlFor='name'>
                            Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            placeholder={user.name}
                            onChange={e => this.updateName(e.target.value)}
                        />
                        {this.state.name.touched && (
                            <ValidationError className='editUserValidError' message={nameError} />
                        )}
                    </section>
                    <section className='EditUser_formField'>
                        <label htmlFor='email'>
                            Email address
                        </label>
                        <input
                            type='text'
                            id='email'
                            placeholder={user.email}
                            onChange={e => this.updateEmail(e.target.value)}
                        />
                        {this.state.emailError.status
                            ? <p className='errorText'>{this.state.emailError.value}</p>
                            : ''
                        }
                        {this.state.email.touched && (
                            <ValidationError className='editUserValidError' message={emailError} />
                        )}
                    </section>
                    <section className='EditUser_formField'>
                        <label htmlFor='about'>
                            About
                        </label>
                        <input
                            type='textarea'
                            id='about'
                            placeholder={user.about}
                            onChange={e => this.updateAbout(e.target.value)}
                        />
                    </section>
                    <div className='EditUserForm_buttons'>
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

export default withRouter(EditUser);
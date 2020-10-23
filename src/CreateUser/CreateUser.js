import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import APIContext from '../APIContext';
import config from '../config';
import './CreateUser.css';

class CreateUser extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          name: { value: '', touched: false },
          email: { value: '', touched: false },
          password: { value: '', touched: false }
        };
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

    validateUserPass() {
        const pass = this.state.password.value.trim();

        if (pass.length === 0) {
          return 'A valid password is required';
        };
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };

      
    render() {
        const nameError = this.validateUserName();
        const emailError = this.validateUserEmail();
        const passError = this.validateUserPass();

        return (
            <section className='CreateUser'>
                <h1 className='createUserHeader'>Create an Account</h1>
                <form 
                    className='CreateUser_form'
                    onSubmit={this.validateInput}
                >
                    <label htmlFor='userName'>
                        Name
                    </label>
                    <input
                        type='text'
                        id='userName'
                        placeholder='Jane Doe'
                        onChange={e => this.updateTitle(e.target.value)}
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
                        type='text'
                        id='userPass'
                        placeholder='Letmein123!'
                        onChange={e => this.updatePass(e.target.value)}
                        required
                    />
                    {this.state.password.touched && (
                        <ValidationError message={passError} />
                    )}
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
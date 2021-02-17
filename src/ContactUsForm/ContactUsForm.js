import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import TokenService from '../services/token-service';
import jwt_decode from 'jwt-decode';
import config from '../config';
import APIContext from '../APIContext';
import './ContactUsForm.css';

class ContactUsForm extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          name: { value: '', touched: false },
          email: { value: '', touched: false },
          message: { value: '', touched: false },
          emailError: { value: '', status: false },
          sendConfirm: false
        };
    };

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    };

    updateEmail(email) {
        this.setState({email: {value: email, touched: true}});
    };

    updateMessage(content) {
        if(this.state.emailError.value) {
            this.setState({
                message: { value: content, touched: true },
                emailError: { value: '', status: false }
            })
        }
        else {
            this.setState({message: {value: content, touched: true}});
        }
    };

    validateName() {
        const name = this.state.name.value.trim();

        if (name.length === 0) {
          return 'Your name is required';
        };
    };

    validateEmail() {
        const email = this.state.email.value.trim();

        if (email.length === 0) {
          return 'A valid email is required';
        };
    };

    validateMessage() {
        const email = this.state.email.value.trim();

        if (email.length === 0) {
          return 'A message is required';
        };
    };

    handleSubmit = e => {
        e.preventDefault();

        // clear any previous error messages
        if(this.state.emailError.status === true) {
            this.setState({
                emailError: { value: '', status: false}
            })
        }
        
        // validate that email and password have required characters
        const emailCheck1 = this.state.email.value.indexOf('@');
        const emailCheck2 = this.state.email.value.indexOf('.');
        if(emailCheck1 === -1 || !emailCheck2 == -1) {
            this.setState({
                emailError : {
                    value: 'A valid email address is required',
                    status: true
                }
            });
        }
        else {
            const contactMessage = {
                name: this.state.name.value,
                email: this.state.email.value,
                message: this.state.message.value
            };

            fetch(`${config.API_ENDPOINT}/api/contact-us`, {
                method: 'POST',
                body: JSON.stringify(contactMessage),
                headers: {
                  'content-type': 'application/json'
                }
              })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(error => {
                        throw error
                    })
                }
                else {
                    this.setState({
                        sendConfirm: true
                    });
                }
            })
            .catch(error => {
                this.setState({ error })
            })
        }
    };

    confirmationText = () => {
        return (
            <div className='contactUsConfirmSend'>Your message has been sent successfully.  Thank you!</div>
        )
    }

    handleClickCancel = () => {
        this.setState({
            name: { value: '', touched: false },
            email: { value: '', touched: false },
            message: { value: '', touched: false },
            emailError: { value: '', status: false }
        });
    };

      
    render() {
        if(this.context.users.length < 1) {
            this.context.refreshState();
        }
        const nameError = this.validateName();
        const emailError = this.validateEmail();
        const messageError = this.validateMessage();

        return (
            <section className='ContactUsForm'>
                <h1 className='contactUsFormHeader'>Contact Me</h1>
                <form 
                    className='ContactUsForm_form'
                    onSubmit={this.handleSubmit}
                >
                    <section className='ContactUsForm_formField'>
                        <label htmlFor='name'>
                            Name
                        </label>
                        <input
                            type='text'
                            id='name'
                            placeholder='Jane Doe'
                            onChange={e => this.updateName(e.target.value)}
                            required
                        />
                        {this.state.name.touched && (
                            <ValidationError message={nameError} />
                        )}
                    </section>
                    <section className='ContactUsForm_formField'>
                        <label htmlFor='email'>
                            Email Address
                        </label>
                        <input
                            type='text'
                            id='email'
                            placeholder='jane-doe@gmail.com'
                            onChange={e => this.updateEmail(e.target.value)}
                            required
                        />
                        {this.state.email.touched && (
                            <ValidationError message={emailError} />
                        )}
                        {this.state.emailError.status
                            ? <div className='contactEmailError'>{this.state.emailError.value}</div>
                            : ''
                        }
                    </section>
                    <section className='ContactUsForm_formField'>
                        <label htmlFor='message'>
                            Message
                        </label>
                        <textarea
                            type='text'
                            id='cmessage'
                            className='contactUsMessage'
                            onChange={e => this.updateMessage(e.target.value)}
                            required
                        />
                        {this.state.message.touched && (
                            <ValidationError message={messageError} />
                        )}
                    </section>
                    <div className='ContactUsFormForm_buttons'>
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
                    {this.state.sendConfirm ?  this.confirmationText() : ''}
                </form>
            </section>
        );
    }

}

export default withRouter(ContactUsForm);
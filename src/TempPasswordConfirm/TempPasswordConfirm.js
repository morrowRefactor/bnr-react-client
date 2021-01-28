import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import APIContext from '../APIContext';
import TokenService from '../services/token-service';
import config from '../config';
import './TempPasswordConfirm.css';

class TempPasswordConfirm extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          email: '',
          password: { value: '', touched: true },
          emailError: { value: '', status: false },
          validError: { value: '', status: false }
        };
    };
    
    handleSubmit = e => {
        e.preventDefault();
        
        const checkEmail = this.context.users.find(({ email }) => email === this.state.email);
        if(!checkEmail) {
            this.setState({
                emailError: { value: 'An account with this email address does not exist', status: true }
            });
        }
        else {
            if(this.state.emailError.status === true || this.state.validError.status === true) {
                this.setState({
                    emailError: { value: '', status: false },
                    validError: { value: '', status: false }
                });
            }

            const tempLogin = {
                id: this.props.match.params.id,
                uid: checkEmail.id,
                email: this.state.email,
                password: this.state.password.value
            };

            fetch(`${config.API_ENDPOINT}/api/reset-password/${this.props.match.params.id}`, {
                method: 'POST',
                body: JSON.stringify(tempLogin),
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

                  return res.json().then(newPass => {
                    TokenService.saveAuthToken(newPass.authToken);
                    this.props.history.push(`/change-password/${tempLogin.uid}`);
                  }) 
                })
                .catch(error => {
                  this.setState({ error })
                })
        }
    }

    getEmail = () => {
        fetch(`${config.API_ENDPOINT}/api/reset-password/${this.props.match.params.id}`, {
            method: 'GET',
            body: JSON.stringify(),
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

              return res.json().then(newPass => {
                this.setState({
                    email: newPass.email
                });
              }) 
            })
            .catch(error => {
              this.setState({ error })
            })
    }

    updateTempPass = pass => {
        this.setState({password: {value: pass, touched: true}});
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };
  
    render() {
        if(this.state.email.length < 2) {
            this.getEmail();
        }

        if(this.context.users.length < 1) {
            this.context.refreshState();
        }

        return (
            <section className='TempPasswordConfirm'>
                <h1 className='TempPasswordConfirmHeader'>Enter temporary password</h1>
                <div className='tempPasswordConfirmText'>
                    <p>You should have received an email with your temporary password.  Enter it below and you will be prompted to create a new password.</p>
                </div>
                <form 
                    className='TempPasswordConfirm_form'
                    onSubmit={this.handleSubmit}
                >
                    <section className='TempPasswordConfirm_formField'>
                        <label htmlFor='email'>
                            Email address
                        </label>
                        <input
                            type='text'
                            id='email'
                            defaultValue={this.state.email}
                        />
                    </section>
                    <section className='TempPasswordConfirm_formField'>
                        <label htmlFor='tempPass'>
                            Temporary password
                        </label>
                        <input
                            type='text'
                            id='tempPass'
                            onChange={e => this.updateTempPass(e.target.value)}
                            required
                        />
                        {this.state.validError.status
                            ? <p className='errorText'>{this.state.validError.value}</p>
                            : ''
                        }
                    </section>
                    <div className='TempPasswordConfirmForm_buttons'>
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

export default withRouter(TempPasswordConfirm);
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import APIContext from '../APIContext';
import TokenService from '../services/token-service';
import config from '../config';
import './ChangePassword.css';

class ChangePassword extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          newPass: { value: '', touched: false },
          confirmPass: { value: '', touched: true },
          passwordError: { value: '', status: false },
          showChar: false
        };
    };
    
    handleSubmit = e => {
        e.preventDefault();
        
        // validate that password has required characters
        const regexPasswordCheck = /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/;
        if(!regexPasswordCheck.test(this.state.newPass.value) || this.state.newPass.value.length < 8) {
            this.setState({
                passwordError: { 
                    value: 'Password must contain at least one capital letter, one number, one special character, and be at least 8 characters long',
                    status: true
                }
            });
        }
        else if(this.state.newPass.value !== this.state.confirmPass.value) {
            this.setState({
                passwordError: { 
                    value: 'Passwords must be an identical character match',
                    status: true
                }
            });
        }
        else {
            const user = this.context.users.find(({ id }) => id === parseInt(this.props.match.params.uid));
            const newPassword = {
                id: user.id,
                name: user.name,
                email: user.email,
                password: this.state.newPass.value
            };

            fetch(`${config.API_ENDPOINT}/api/users/${user.id}`, {
                method: 'PATCH',
                body: JSON.stringify(newPassword),
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
    
                console.log('good')
            })
            .catch(error => {
                this.setState({ error })
            })
        }
    }

    updateNewPass = pass => {
        this.setState({newPass: {value: pass, touched: true}});
    };

    updateConfirmPass = pass => {
        this.setState({confirmPass: {value: pass, touched: true}});
    };

    toggleField = () => {
        const toggle = this.state.showChar ? false : true;
        this.setState({
            showChar: toggle
        });
    }

    handleClickCancel = () => {
        this.props.history.push('/');
    };
  
    render() {
        const passField = this.state.showChar ? 'text' : 'password';

        return (
            <section className='ChangePassword'>
                <h1 className='ChangePasswordHeader'>Change your password</h1>
                <form 
                    className='ChangePassword_form'
                    onSubmit={this.handleSubmit}
                >
                    <section className='ChangePassword_formField'>
                        <label htmlFor='newPass'>
                            New password
                        </label>
                        <input
                            type={passField}
                            id='newPass'
                            onChange={e => this.updateNewPass(e.target.value)}
                            required
                        />
                        <button className='changePasswordFieldToggle' onClick={() => this.toggleField()}>Show characters</button>
                    </section>
                    <section className='ChangePassword_formField'>
                        <label htmlFor='confirmPass'>
                            Confirm password
                        </label>
                        <input
                            type={passField}
                            id='confirmPass'
                            onChange={e => this.updateConfirmPass(e.target.value)}
                            required
                        />
                        {this.state.passwordError.status
                            ? <p className='errorText'>{this.state.passwordError.value}</p>
                            : ''
                        }
                    </section>
                    <div className='ChangePasswordForm_buttons'>
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

export default withRouter(ChangePassword);
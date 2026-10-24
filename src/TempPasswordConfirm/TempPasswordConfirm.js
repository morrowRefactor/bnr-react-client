import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import APIContext from '../APIContext';
import TokenService from '../services/token-service';
import AuthApiService from '../services/auth-api-service';
import './TempPasswordConfirm.css';

class TempPasswordConfirm extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          email: (props.location.state && props.location.state.email) || '',
          password: { value: '', touched: true },
          validError: { value: '', status: false }
        };
    };
    
    handleSubmit = e => {
        e.preventDefault();
        this.setState({ validError: { value: '', status: false } });

        AuthApiService.postTempLogin({
            email: this.state.email.trim(),
            password: this.state.password.value
        })
            .then(res => {
                TokenService.saveAuthToken(res.authToken);
                this.props.history.push(`/change-password/${res.uid}`);
            })
            .catch(() => {
                this.setState({
                    validError: { value: 'Incorrect email or temporary password', status: true }
                });
            })
    };

    updateEmail = email => {
        this.setState({ email });
    };

    updateTempPass = pass => {
        this.setState({password: {value: pass, touched: true}});
    };

    handleClickCancel = () => {
        this.props.history.push('/');
    };
  
    render() {
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
                            value={this.state.email}
                            onChange={e => this.updateEmail(e.target.value)}
                            required
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
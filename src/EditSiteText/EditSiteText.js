import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import APIContext from '../APIContext';
import ValidationError from '../ValidationError/ValidationError';
import TokenService from '../services/token-service';
import config from '../config';
import './EditSiteText.css';

class EditSiteText extends Component {
    static contextType = APIContext;

    constructor(props) {
        super(props)
        this.state = {
          homepage: { value: '', touched: false },
          about_intro: { value: '', touched: false },
          about_mission: { value: '', touched: false },
          about_company: { value: '', touched: false },
          about_disclaimer: { value: '',  touched: false }
        };
    };
    
    handleSubmit = e => {
        e.preventDefault();

        let updatedFields = [];
        if(this.state.homepage.touched === true) {
            const currField = this.context.siteText.find(({ field }) => field === 'homepage');
            const newField = {
                id: currField.id,
                field: currField.field,
                body: this.state.homepage.value
            };
            updatedFields.push(newField);
        }
        if(this.state.about_intro.touched === true) {
            const currField = this.context.siteText.find(({ field }) => field === 'about_intro');
            const newField = {
                id: currField.id,
                field: currField.field,
                body: this.state.about_intro.value
            };
            updatedFields.push(newField);
        }
        if(this.state.about_mission.touched === true) {
            const currField = this.context.siteText.find(({ field }) => field === 'about_mission');
            const newField = {
                id: currField.id,
                field: currField.field,
                body: this.state.about_mission.value
            };
            updatedFields.push(newField);
        }
        if(this.state.about_company.touched === true) {
            const currField = this.context.siteText.find(({ field }) => field === 'about_company');
            const newField = {
                id: currField.id,
                field: currField.field,
                body: this.state.about_company.value
            };
            updatedFields.push(newField);
        }
        if(this.state.about_disclaimer.touched === true) {
            const currField = this.context.siteText.find(({ field }) => field === 'about_disclaimer');
            const newField = {
                id: currField.id,
                field: currField.field,
                body: this.state.about_disclaimer.value
            };
            updatedFields.push(newField);
        }
        
        fetch(`${config.API_ENDPOINT}/api/site-text`, {
            method: 'PATCH',
            body: JSON.stringify(updatedFields),
            headers: {
              'content-type': 'application/json',
              'authorization': `bearer ${TokenService.getAuthToken()}`
            }
          })
          .then(() => {
              this.props.history.push(`/admin`);
          })
          .catch(error => {
              this.setState({ error })
          })

          this.context.refreshState();
          this.props.history.push(`/admin`);
    }

    updateHomepage = text => {
        this.setState({homepage: {value: text, touched: true}});
    };

    updateAboutIntro = text => {
        this.setState({about_intro: {value: text, touched: true}});
    };

    updateAboutMission = text => {
        this.setState({about_mission: {value: text, touched: true}});
    };

    updateAboutCompany = text => {
        this.setState({about_company: {value: text, touched: true}});
    };

    updateAboutDisclaimer = text => {
        this.setState({about_disclaimer: {value: text, touched: true}});
    };

    validateHomepage() {
        const text = this.state.homepage.value.trim();
        if (text.length === 0) {
          return 'Text is required';
        };
    };

    validateAboutIntro() {
        const text = this.state.about_intro.value.trim();
        if (text.length === 0) {
          return 'Text is required';
        };
    };

    validateAboutMission() {
        const text = this.state.about_mission.value.trim();
        if (text.length === 0) {
          return 'Text is required';
        };
    };

    validateAboutCompany() {
        const text = this.state.about_company.value.trim();
        if (text.length === 0) {
          return 'Text is required';
        };
    };

    validateAboutDisclaimer() {
        const text = this.state.about_disclaimer.value.trim();
        if (text.length === 0) {
          return 'Text is required';
        };
    };

    handleClickCancel = () => {
        this.props.history.push(`/my-account/${this.props.match.params.uid}`);
    };
  
    render() {
        const currHomepageText = this.context.siteText.find(({ field }) => field === 'homepage') || {};
        const currAboutIntroText = this.context.siteText.find(({ field }) => field === 'about_intro') || {};
        const currAboutMissionText = this.context.siteText.find(({ field }) => field === 'about_mission') || {};
        const currAboutCompanyText = this.context.siteText.find(({ field }) => field === 'about_company') || {};
        const currAboutDisclaimerText = this.context.siteText.find(({ field }) => field === 'about_disclaimer') || {};
        const homepageError = this.validateHomepage();
        const aboutIntroError = this.validateAboutIntro();
        const aboutMissionError = this.validateAboutMission();
        const aboutCompanyError = this.validateAboutCompany();
        const aboutDisclaimerError = this.validateAboutDisclaimer();

        return (
            <section className='EditSiteText'>
                <h1 className='EditSiteTextHeader'>Edit Site Text</h1>
                <form 
                    className='EditSiteText_form'
                    onSubmit={this.handleSubmit}
                >
                    <h3>Homepage</h3>
                    <section className='EditSiteText_formField'>
                        <label htmlFor='hoomepage'>
                            Homepage Text
                        </label>
                        <p className='currTextHeader'>Current text:</p>
                        <p className='currText'>"{currHomepageText.body}"</p>
                        <textarea
                            type='text'
                            id='homepage'
                            onChange={e => this.updateHomepage(e.target.value)}
                        />
                        {this.state.homepage.touched && (
                            <ValidationError className='editSiteTextValidError' message={homepageError} />
                        )}
                    </section>
                    <h3>About/Contact Page</h3>
                    <section className='EditSiteText_formField'>
                        <label htmlFor='about-intro'>
                            Intro Text
                        </label>
                        <p className='currTextHeader'>Current text:</p>
                        <p className='currText'>"{currAboutIntroText.body}"</p>
                        <textarea
                            type='text'
                            id='about-intro'
                            onChange={e => this.updateAboutIntro(e.target.value)}
                        />
                        {this.state.about_intro.touched && (
                            <ValidationError className='editSiteTextValidError' message={aboutIntroError} />
                        )}
                    </section>
                    <section className='EditSiteText_formField'>
                        <label htmlFor='about-mission'>
                            "My Mission" Text
                        </label>
                        <p className='currTextHeader'>Current text:</p>
                        <p className='currText'>"{currAboutMissionText.body}"</p>
                        <textarea
                            type='text'
                            id='about-mission'
                            onChange={e => this.updateAboutMission(e.target.value)}
                        />
                        {this.state.about_mission.touched && (
                            <ValidationError className='editSiteTextValidError' message={aboutMissionError} />
                        )}
                    </section>
                    <section className='EditSiteText_formField'>
                        <label htmlFor='about-company'>
                            "My Company" Text
                        </label>
                        <p className='currTextHeader'>Current text:</p>
                        <p className='currText'>"{currAboutCompanyText.body}"</p>
                        <textarea
                            type='text'
                            id='about-company'
                            onChange={e => this.updateAboutCompany(e.target.value)}
                        />
                        {this.state.about_company.touched && (
                            <ValidationError className='editSiteTextValidError' message={aboutCompanyError} />
                        )}
                    </section>
                    <section className='EditSiteText_formField'>
                        <label htmlFor='about-disclaimer'>
                            "My Disclaimer" Text
                        </label>
                        <p className='currTextHeader'>Current text:</p>
                        <p className='currText'>"{currAboutDisclaimerText.body}"</p>
                        <textarea
                            type='text'
                            id='about-disclaimer'
                            onChange={e => this.updateAboutDisclaimer(e.target.value)}
                        />
                        {this.state.about_disclaimer.touched && (
                            <ValidationError className='editSiteTextValidError' message={aboutDisclaimerError} />
                        )}
                    </section>
                    <div className='EditSiteTextForm_buttons'>
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

export default withRouter(EditSiteText);
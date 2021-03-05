import React, { Component } from 'react';
import ContactUsForm from '../ContactUsForm/ContactUsForm';
import APIContext from '../APIContext';
import './About.css';

class About extends Component {
    static contextType = APIContext;

    render() {
        if(this.context.siteText.length < 1) {
            this.context.refreshState();
        }
        const introText = this.context.siteText.find(({ field }) => field === 'about_intro') || {};
        const missionText = this.context.siteText.find(({ field }) => field === 'about_mission') || {};
        const companyText = this.context.siteText.find(({ field }) => field === 'about_company') || {};
        const disclaimerText = this.context.siteText.find(({ field }) => field === 'about_disclaimer') || {};
        
        return (
            <section className='About'>
                <div className='About_introHeader'>
                    <img className='aboutImage' alt='Beer and News Report' src='https://img1.wsimg.com/isteam/ip/e5e48fd9-dca1-4bb0-a3e0-ccda5f5780e0/Cheers%202.png/:/' />
                    <p className='aboutFieldText'>{introText.body}</p>
                </div>
                <section className='About_info'>
                    <div className='aboutInfoMission'>
                        <h3 className='aboutInfoHeader'>My Mission</h3>
                        <p className='aboutFieldText'>{missionText.body}</p>
                    </div>
                    <div className='aboutInfoCompany'>
                        <h3 className='aboutInfoHeader'>My Company</h3>
                        <p className='aboutFieldText'>{companyText.body}</p>
                    </div>
                    <div className='aboutInfoDisclaimer'>
                        <h3 className='aboutInfoHeader'>My Disclaimer</h3>
                        <p className='aboutFieldText'>{disclaimerText.body}</p>
                    </div>
                </section>
                <ContactUsForm />
            </section>
        );
    }
}

export default About;
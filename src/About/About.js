import React, { Component } from 'react';
import ContactUsForm from '../ContactUsForm/ContactUsForm';
import APIContext from '../APIContext';
import './About.css';

class About extends Component {
    static contextType = APIContext;

    render() {
        
        return (
            <section className='About'>
                <div className='About_introHeader'>
                    <img className='aboutImage' alt='Beer and News Report' src='https://img1.wsimg.com/isteam/ip/e5e48fd9-dca1-4bb0-a3e0-ccda5f5780e0/Cheers%202.png/:/' />
                    <p>We believe that the world has become too serious and we need to have a beer and a couple laughs. If you agree, please <a className='aboutEmailLink' href='mailto:beerandnewsreport@gmail.com'>email me</a> and let me know.  If not, have a beer anyway.</p>
                </div>
                <section className='About_info'>
                    <div className='aboutInfoMission'>
                        <h3 className='aboutInfoHeader'>My Mission</h3>
                        <p>To take a news topic and try to find the underlying effects that might not have been considered.  I will be drinking a beer to make the discussion more relaxed and comical.</p>
                    </div>
                    <div className='aboutInfoCompany'>
                        <h3 className='aboutInfoHeader'>My Company</h3>
                        <p>All the shows produced here were mainly done at the CreaTV studios in San Jose, CA.  This is a public access studio so all the actors, including myself, were not paid.  It is truly working for the joy of it...and of course beer.</p>
                    </div>
                    <div className='aboutInfoDisclaimer'>
                        <h3 className='aboutInfoHeader'>My Disclaimer</h3>
                        <p>All the topics I talk about are either my opinion or obvious parody.  I do not claim to be an expert on anything and that includes beer drinking.  Any discussion or argument that uses my news as its basis is doomed to failure for which I am not responsible for.</p>
                    </div>
                </section>
                <ContactUsForm />
            </section>
        );
    }
}

export default About;
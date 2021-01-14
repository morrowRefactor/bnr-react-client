import React, { Component } from 'react';
import './Footer.css';

class Footer extends Component {
    render() {
        return (
            <section className='Footer'>
                <p className='footerHeader'>
                    Check us out on social
                </p>
                <section className='Footer_socialIcons'>
                    <div>
                        <a href='https://www.youtube.com/channel/UCZlO4MI8tj0kwA_gOXsdVFQ'><img className='socialImage' alt='YouTube Social Link' src='https://user-images.githubusercontent.com/58446465/104520663-585c9680-55b0-11eb-8d93-0c41407cfffb.png' /></a>
                    </div>
                    <div>
                        <a href='https://www.linkedin.com/in/amaurice/'><img className='socialImage' alt='LinkedIn Social Link' src='https://user-images.githubusercontent.com/58446465/104520660-55fa3c80-55b0-11eb-8ef8-848dc218f040.png' /></a>
                    </div>
                    <div>
                        <a href='https://www.facebook.com/beerandnewsreport/'><img className='socialImage' alt='Facebook Social Link' src='https://user-images.githubusercontent.com/58446465/104520653-5397e280-55b0-11eb-9fad-887eee046c98.png' /></a>
                    </div>
                </section>
            </section>
        );
    }
}

export default Footer;
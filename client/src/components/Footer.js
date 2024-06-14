import React from "react";

const Footer = () => (
    <div className="CFfooter CFpinkBackground">
    <div className="contentContainer">
      <div className="footerColumn">
        <div className='footerHead'>Support</div>
        <div className='footerLink'><a href="support-report-issue">Report issue</a></div>
        <div className='footerLink'><a href="support-advisor">Connect with advisor</a></div>
        <div className='footerLink'><a href="support-suggestion">Make a suggestion</a></div>
      </div>
      <div className="footerColumn">
        <div className='footerHead'><a href="care-provider">Care Provider</a></div>
        <div className='footerLink'><a href="claim-profile">List your AFH</a></div>
        <div className='footerLink'><a href="care-provider">Become a member</a></div>
      </div>
      <div className="footerColumn">
        <div className='footerHead'><a href="/">Carefinder</a></div>
        <div className='footerLink'><a href="join-team">Join our team</a></div>
        <div className='footerLink'><a href="contact-us">Contact us</a></div>
        <div className='footerLink'><a href="###">[Support chat?]</a></div>

      </div>
      <div className="clear"></div>
      <p className="copyright">Copyright © 2024, Carefinder.  |  <a href="sitemap">Sitemap</a>  |  <a href="privacy-policy">Privacy Policy</a> | <a href="terms-of-service">Terms of Service</a></p>
    </div>
  </div>

);

export default Footer;

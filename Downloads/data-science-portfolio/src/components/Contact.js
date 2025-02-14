import React, { useEffect } from 'react';
import './Contact.css';

const Contact = ({ isVisible }) => {
  useEffect(() => {
    console.log(`🔍 Contact section rendered. isVisible: ${isVisible}`);
  }, [isVisible]);

  return (
    <section id="contact" className={`contact ${isVisible ? 'visible' : ''}`}>
      <h2>Contact Me</h2>
      <p>Email: siliconvalley21@gmail.com</p>
      <div className="social-links">
        <a 
          href="https://www.linkedin.com/in/mikky-chilaka-002852166/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-button linkedin"
        >
          LinkedIn
        </a>
        <a 
          href="https://github.com/MIKKY-ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-button github"
        >
          GitHub
        </a>
      </div>
    </section>
  );
};

export default Contact;

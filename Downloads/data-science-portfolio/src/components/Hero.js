import React from 'react';
import './Hero.css';

function Hero({ isVisible }) {
  console.log("Hero section rendered"); // Debugging log

  return (
    <section id="hero" className={`hero ${isVisible ? 'visible' : ''}`}>
      <div className="hero-text">
        <h1>Hi, Welcome to my portfolio. I'm Mikky Chilaka.</h1>
        <p>Explore my work and experience in data science and more.</p>
      </div>
    </section>
  );
}

export default Hero;

import React from 'react';
import './About.css';

const About = ({ isVisible }) => {
  console.log("About section isVisible:", isVisible); // Debugging log

  return (
    <section id="about" className={`about ${isVisible ? 'visible' : ''}`}>
      <div className="about-content">
        <h2>About Me</h2>
        <p className="typing-effect">
          Hello! I'm Mikky, I specialize in Data Science and Machine Learning.
        </p>
        <p>
          My journey started with curiosity about how technology impacts lives, and I take pride in crafting software that solves complex problems. When I'm not coding, you'll find me exploring AI innovations and brainstorming new project ideas.
        </p>
      </div>
    </section>
  );
};

export default About;
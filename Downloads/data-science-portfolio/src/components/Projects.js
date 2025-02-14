import React from 'react';
import './Projects.css';

const Projects = ({ isVisible }) => {
  // Define the projects array
  const projects = [
    {
      title: "Customer Segmentation with K-Means",
      description: "A machine learning project to segment customers into different groups based on their purchasing behavior using K-Means clustering.",
      link: "https://github.com/MIKKY-ai/customer-segmentation"
    },
    {
      title: "Predictive Analytics for Sales Forecasting",
      description: "A predictive model that uses historical sales data to forecast future sales trends.",
      link: "https://github.com/MIKKY-ai/sales-forecasting"
    },
    {
      title: "NLP Chatbot for Customer Service",
      description: "An NLP-based chatbot built to provide automatic responses to customer queries using deep learning techniques.",
      link: "https://github.com/MIKKY-ai/nlp-chatbot"
    },
    {
      title: "Stock Price Prediction using LSTM",
      description: "A time series forecasting model using Long Short Term Memory (LSTM) to predict future stock prices based on historical data.",
      link: "https://github.com/MIKKY-ai/stock-price-prediction"
    }
  ];

  return (
    <section id="projects" className={`projects ${isVisible ? 'visible' : ''}`}>
      <h2>My Projects</h2>
      <div className="project-list">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <a 
              href={project.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="project-link"
            >
              View Project
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
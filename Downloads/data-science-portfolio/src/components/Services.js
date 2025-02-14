import React from 'react';
import './Services.css';

const Services = ({ isVisible }) => {
  // Define the services array
  const services = [
    {
      title: "Data Analytics",
      description: "Transform raw data into actionable insights for business decision-making using statistical techniques and visualizations."
    },
    {
      title: "Machine Learning",
      description: "Develop machine learning models to solve real-world problems, from classification to regression tasks."
    },
    {
      title: "Data Visualization",
      description: "Create interactive dashboards and visual reports using tools like Tableau, Power BI, and Python libraries such as Matplotlib and Seaborn."
    },
    {
      title: "Deep Learning",
      description: "Build and deploy deep learning models for complex tasks like image recognition, NLP, and time-series forecasting."
    },
    {
      title: "Cloud Solutions",
      description: "Leverage cloud platforms such as AWS, Google Cloud, and Azure for scalable data processing and deployment of machine learning models."
    }
  ];

  return (
    <section id="services" className={`services ${isVisible ? 'visible' : ''}`}>
      <h2>What I Offer</h2>
      <div className="service-list">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <div className="card-header">
              <h3>{service.title}</h3>
            </div>
            <div className="card-content">
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
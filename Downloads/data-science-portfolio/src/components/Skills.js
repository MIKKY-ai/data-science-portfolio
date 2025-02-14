import React from 'react';
import './Skills.css';

const Skills = ({ isVisible }) => {
  // Define the skills array
  const skills = [
    { name: "Python", level: "Advanced" },
    { name: "SQL", level: "Intermediate" },
    { name: "Machine Learning", level: "Advanced" },
    { name: "Data Visualization", level: "Intermediate" },
    { name: "Deep Learning", level: "Intermediate" },
    { name: "AWS", level: "Intermediate" }
  ];

  // Define the getSkillLevelPercentage function
  const getSkillLevelPercentage = (level) => {
    switch (level) {
      case "Advanced":
        return 100;
      case "Intermediate":
        return 60;
      case "Beginner":
        return 30;
      default:
        return 0;
    }
  };

  return (
    <section id="skills" className={`skills ${isVisible ? 'visible' : ''}`}>
      <h2>Skills</h2>
      <div className="skill-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill">
            <h3>{skill.name}</h3>
            <p>{skill.level}</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${getSkillLevelPercentage(skill.level)}%`,
                  backgroundColor: "#4caf50",
                }}
              />
            </div>
            <p className="skill-level">
              {getSkillLevelPercentage(skill.level)}%
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
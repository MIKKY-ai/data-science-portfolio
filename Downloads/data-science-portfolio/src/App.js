import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';
import './App.css';

function App() {
  const [visibleSection, setVisibleSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2;

        console.log(`Checking section: ${section.id}, Top: ${sectionTop}, ScrollPos: ${scrollPosition}`);

        if (scrollPosition > sectionTop && scrollPosition < sectionTop + sectionHeight) {
          setVisibleSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container">
      <Navbar />
      <Hero isVisible={visibleSection === 'hero'} />
      <About isVisible={visibleSection === 'about'} />
      <Services isVisible={visibleSection === 'services'} />
      <Projects isVisible={visibleSection === 'projects'} />
      <Skills isVisible={visibleSection === 'skills'} />
      <Contact isVisible={visibleSection === 'contact'} />
    </div>
  );
}

export default App;

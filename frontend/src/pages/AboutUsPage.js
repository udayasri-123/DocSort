import React from 'react';
import './AboutUsPage.css';

const AboutUsPage = () => {
  return (
    <div className="about-container">
      <h2>About Us</h2>
      <p className="about-description">
        Welcome to **AutoSort**, an automatic document classification and filing system designed to streamline your document management process.
        <br />
        Our system automatically sorts incoming documents into predefined categories (e.g., Legal, Finance, Marketing) to make organizing and accessing your files much easier and faster.
      </p>
      <p className="about-goal">
        **Our Goal:** To provide a smart solution that can handle large amounts of documents in real-time with precision, security, and efficiency.
      </p>

      <h3>Our Team</h3>
      <ul className="team-list">
        <li>John Doe - Project Lead</li>
        <li>Jane Smith - Developer</li>
        <li>Alice Brown - Data Scientist</li>
        <li>Bob Johnson - UI/UX Designer</li>
      </ul>

      <div className="back-btn">
        <a href="/home">Back to Home</a>
      </div>
    </div>
  );
};

export default AboutUsPage;

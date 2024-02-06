// Logon.js
import React from 'react';
import Sidebar from './Sidebar';
import './CSS/Logon.css';
import SecurityBadgeImage from './Images/SecurityBadge.png';
import SecurityBadgeImage2 from './Images/SecurityBadge2.png';

const LogOn = () => {
  // Dummy articles data
  const articles = [
    { id: 1, title: 'Introduction to Web Security', content: 'Learn the basics of web security, including common threats and protective measures.', image: SecurityBadgeImage, link: 'https://www.mimecast.com/content/web-security/' },
    { id: 2, title: 'Common Web Vulnerabilities', content: 'Explore prevalent web vulnerabilities such as XSS and CSRF, and understand how to mitigate them.', image: SecurityBadgeImage2, link: 'https://www.checkpoint.com/cyber-hub/cloud-security/what-is-application-security-appsec/owasp-top-10-vulnerabilities/' },
    // Add more articles as needed
  ];

  return (
    <div className="logon-page">
      <Sidebar />
      <div className="logon-content">
        <h1>Welcome to SurfSafe!</h1>
        <h2>Featured Articles</h2>
        <ul>
          {articles.map(article => (
            <li key={article.id}>
              <h3>{article.title}</h3>
              <a href={article.link} target="_blank" rel="noopener noreferrer">
              <img src={article.image} className="article-image"/>
              </a>
              <p>{article.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LogOn;

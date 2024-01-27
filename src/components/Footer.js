import React from 'react';
import styles from '../../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <span className={styles.copyright}>&copy; 2024 Your Website Name</span>
        <span className={styles.ownership}>Group project by Rasayan & Anindya</span>
      </div>
    </footer>
  );
};

export default Footer;
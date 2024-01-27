'use client'

import React, { useState, useEffect } from 'react';
import { FaGithub } from 'react-icons/fa';
import styles from '../../styles/Navbar.module.css';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'k') {
        setIsSearchActive(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchBlur = () => {
    setIsSearchActive(false);
  };

  return (
    <nav className={`${styles.navbar} ${isSearchActive ? styles['search-active'] : ''}`}>
      <div className={styles['navbar-container']}>
        <div className={styles['navbar-left']}>
          <span className={styles['navbar-heading']}>OSMapps</span>
        </div>
        <div className={styles['navbar-center']}>
          <a href="#download">Download</a>
          <a href="#about">About</a>
          <a href="#creator">Creator</a>
        </div>
        <div className={styles['navbar-right']}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            onBlur={handleSearchBlur}
            className={`${styles['search-bar']} ${isSearchActive ? styles.active : ''}`}
          />
          <FaGithub className={styles['github-icon']} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
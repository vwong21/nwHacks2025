import React from 'react';
import './Navbar.css';
import placeholderPfp from '../assets/placeholderPfp.jpg';

const Navbar: React.FC = () => {
  return (
    <nav>
      <div className="menu-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <img
        src={placeholderPfp}
        alt="Profile"
        className="profile-pic"
      />
    </nav>
  );
};

export default Navbar;

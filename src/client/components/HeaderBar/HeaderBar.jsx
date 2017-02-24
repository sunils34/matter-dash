
import React from 'react'
import './HeaderBar.css';

const HeaderBar = () => (

<nav className="matter-navbar navbar navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav">
            <li className="active"><a href="#">Dashboard</a></li>
            <li><a href="#about">My Company</a></li>
            <li><a href="#about">Comparison</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <div className='logo'><img src='/images/matter-logo-square.svg'></img></div>
          </ul>
        </div>
      </div>
    </nav>
);

module.exports = HeaderBar;

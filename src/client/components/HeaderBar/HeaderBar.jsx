
import React from 'react'
import './HeaderBar.css';

const HeaderBar = () => (

<nav className="navbar navbar-default navbar-fixed-top">
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
            <li className="active"><a href="#">Overview</a></li>
            <li><a href="#about">Comparison</a></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <div className='logo'>M</div>
          </ul>
        </div>
      </div>
    </nav>
);

module.exports = HeaderBar;

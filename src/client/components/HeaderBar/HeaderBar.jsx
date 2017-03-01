
import React from 'react';
import { Link } from 'react-router';
import './HeaderBar.css';

const HeaderLink = (props) => {

  let activeClassName = null;
  if(props.location.pathname == props.path) {
    activeClassName = 'active';
  }

  return (
    <li className={activeClassName} ><Link to={props.path}>{props.children}</Link></li>
  )
}

class HeaderBar extends React.Component {

  render() {
    const { pathname } = this.props.location;
    return (
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
        <HeaderLink location={location} path='/dashboard'>Dashboard</HeaderLink>
        <HeaderLink location={location} path='/company'>Company</HeaderLink>
        <HeaderLink location={location} path='/comparison'>Comparison</HeaderLink>
      </ul>
      <ul className="nav navbar-nav navbar-right">
      <div className='logo'><img src='/images/matter-logo-square.svg'></img></div>
      </ul>
      </div>
      </div>
      </nav>
    );
  }
}

module.exports = HeaderBar;

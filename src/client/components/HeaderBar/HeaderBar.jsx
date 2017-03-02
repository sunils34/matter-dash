
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
      <nav className="menu matter-navbar">
        <div className='logo'><img src='/images/matter-logo-square.svg'></img></div>
          <div className='nav-list'>
              <ul className="inline-list">
                  <HeaderLink location={location} path='/dashboard'>Dashboard</HeaderLink>
                  <HeaderLink location={location} path='/reports'>Reports</HeaderLink>
                  <HeaderLink location={location} path='/comparison'>Comparison</HeaderLink>
              </ul>
          </div>
      </nav>
    )
  }
}

module.exports = HeaderBar;

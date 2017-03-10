
import React from 'react';
import { Link } from 'react-router';
import './HeaderBar.css';
import { Column, Row } from '../Grid';

const HeaderLink = (props) => {

  let activeClassName = null;
  if(props.location.pathname == props.path) {
    activeClassName = 'active';
  }

  return (
    <Column className={activeClassName} ><Link to={props.path}>{props.children}</Link></Column>
  )
}

class HeaderBar extends React.Component {

  render() {
    const { pathname } = this.props.location;

    return (
      <nav className="menu matter-navbar row expanded">
        <div className='logo'><img src='/images/matter-logo-square.svg'></img></div>
          <Column className="nav-list small-9 medium-6 large-3">
              <Row center middle className="inline-list">
                  <HeaderLink location={location} path='/dashboard'>Dashboard</HeaderLink>
                  <HeaderLink location={location} path='/reports'>Reports</HeaderLink>
                  <HeaderLink location={location} path='/comparison'>Comparison</HeaderLink>
              </Row>
          </Column>
      </nav>
    )
  }
}

module.exports = HeaderBar;

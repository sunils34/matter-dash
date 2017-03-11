import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import dateformat from 'dateformat';
import './HeaderBar.css';
import { Column, Row } from '../Grid';

let HeaderOrgDetails = ({ id, name, updatedAt }) => {
  if (!id || !name || !updatedAt) return null;
  return (
    <Column className="hide-for-small-only">
      <Row right middle className="org-header">
        <Column>
          <Row className="org-name" right>{name}</Row>
          <Row className="org-updated" right>Last Updated: {dateformat(updatedAt, 'mmmm d, yyyy')}</Row>
        </Column>
        <Column className="large-1 medium-1">
          <Row center><img className="org-avatar img-circle" src={`/images/avatars/${id}.svg`} alt={name} /></Row>
        </Column>
      </Row>
    </Column>
  );
};

HeaderOrgDetails.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  updatedAt: React.PropTypes.string.isRequired,
};


HeaderOrgDetails = connect(state => ({
  id: state.app.organization.id,
  name: state.app.organization.name,
  updatedAt: state.app.organization.updatedAt,
}))(HeaderOrgDetails);

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
      <nav className="menu matter-navbar row expanded align-justify">
          <Column className="nav-list small-9 medium-6 large-4">
              <Row center middle className="inline-list">
                <div className='logo'><img src='/images/matter-logo-square.svg'></img></div>
                <HeaderLink location={location} path='/dashboard'>Dashboard</HeaderLink>
                <HeaderLink location={location} path='/reports'>Reports</HeaderLink>
                <HeaderLink location={location} path='/comparison'>Comparison</HeaderLink>
              </Row>
          </Column>
          <HeaderOrgDetails />
      </nav>
    )
  }
}

module.exports = HeaderBar;

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import dateformat from 'dateformat';
import './HeaderBar.css';
import { Column, Row } from '../Grid';

let HeaderOrgDetails = ({ id, name, updatedAt, logoUrl }) => {
  if (!id || !name || !updatedAt) return null;
  return (
    <Column className="hide-for-small-only">
      <Row right middle className="org-header">
        <Column>
          <Row className="org-name" right>{name}</Row>
          <Row className="org-updated" right>Last Updated: {dateformat(updatedAt, 'mmmm d, yyyy')}</Row>
        </Column>
        <Column className="large-1 medium-1">
          <Row center><img className="org-avatar img-circle" src={logoUrl} alt={name} /></Row>
        </Column>
      </Row>
    </Column>
  );
};

HeaderOrgDetails.propTypes = {
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  updatedAt: React.PropTypes.string.isRequired,
  logoUrl: React.PropTypes.string.isRequired,
};


HeaderOrgDetails = connect(state => ({
  id: state.app.organization.id,
  name: state.app.organization.name,
  updatedAt: state.app.organization.updatedAt,
  logoUrl: state.app.organization.logoUrl,
}))(HeaderOrgDetails);

const HeaderLink = (props) => {

  const {path, activePathInclude, location} = props;

  let activeClassName = null;
  if(location.pathname == path) {
    activeClassName = 'active';
  }

  if (activePathInclude &&
      activePathInclude.indexOf(location.pathname.split('/')[1]) > -1) {
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
          <Column className="nav-list small-12 medium-7 large-5">
              <Row center middle className="inline-list">
                <div className='logo'><img src='/images/matter-logo-square.svg'></img></div>
                <HeaderLink location={location} path='/dashboard'>Dashboard</HeaderLink>
                <HeaderLink location={location} path='/reports' activePathInclude={['report']}>Reports</HeaderLink>
                <HeaderLink location={location} path='/comparison'>Comparison</HeaderLink>
              </Row>
          </Column>
          <HeaderOrgDetails />
      </nav>
    )
  }
}

module.exports = HeaderBar;

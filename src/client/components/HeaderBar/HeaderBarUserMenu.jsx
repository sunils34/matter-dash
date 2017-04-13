import React from 'react';
import DropdownMenu from 'react-dd-menu';

class HeaderBarUserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpen: false,
    };
    this.toggle = this.toggle.bind(this);
    this.close = this.toggle.bind(this);
    this.logout = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ isMenuOpen: !this.state.isMenuOpen });
  }

  close() {
    this.setState({ isMenuOpen: false });
  }

  logout() {
    // logout
    window.location = '/auth/logout';
  }

  render() {
    const { orgName } = this.props;
    const { isMenuOpen } = this.state;
    const c = isMenuOpen ? 'opened' : 'closed';
    const caret = isMenuOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down';

    const menuOptions = {
      isOpen: this.state.isMenuOpen,
      close: this.close,
      className: `header-bar-menu ${c}`,
      toggle: (
        <div className="org-wrap" onClick={this.toggle}>
          <span>{orgName}</span>
          <i className="material-icons">{caret}</i>
        </div>
      ),
    };
    return (
      <DropdownMenu {...menuOptions}>
        <div className="dd-wrap">
          <div className="menu-item logout" onClick={this.logout}>
            <div>Log Out</div>
            <div className="material-icons">exit_to_app</div>
          </div>
        </div>
      </DropdownMenu>
    );
  }
}

HeaderBarUserMenu.propTypes = {
  orgName: React.PropTypes.string.isRequired,
};

export default HeaderBarUserMenu;

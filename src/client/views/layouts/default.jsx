var React = require('react');
var AppHeader = require('../partials/AppHeader')
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';

class DefaultLayout extends React.Component {
  render() {
    return (
      <html>
      <head><title>{this.props.title}</title></head>
      <body>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <AppHeader>t</AppHeader>
        </MuiThemeProvider>
      </body>
      </html>
    );
  }
}

module.exports = DefaultLayout;

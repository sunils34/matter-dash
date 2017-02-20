import React from 'react'
import HeaderBar from '../HeaderBar/HeaderBar.jsx'
import OverviewSection from '../OverviewSection/OverviewSection.jsx'

class App extends React.Component {
  render() {
    return (
      <div>
        <HeaderBar />
        <OverviewSection data={this.props.data}/>
      </div>
    );
  }
} 

module.exports = App;

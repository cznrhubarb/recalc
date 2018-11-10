import React, { Component } from 'react';
import './App.css';
import DealParametersPanel from './views/DealParametersPanel';
import FundingMatrixPanel from './views/FundingMatrixPanel';
import BasicInfoPanel from './views/BasicInfoPanel';
import TimelinePanel from './views/TimelinePanel';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BasicInfoPanel />
        <FundingMatrixPanel />
        <DealParametersPanel />
        <TimelinePanel />
      </div>
    );
  }
}

export default App;

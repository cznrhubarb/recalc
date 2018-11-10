import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel } from 'react-bootstrap';
import './views.css';

const mapStateToProps = state => {
  return { 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // No modifying the state from this component... yet.
  };
};

class TimelinePanel extends Component {
  render() {
    return (
      <Panel className="ViewPanel">
        <Panel.Heading>Timeline</Panel.Heading>
        <Panel.Body>
          Holding off on this for now.
        </Panel.Body>
      </Panel>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelinePanel);

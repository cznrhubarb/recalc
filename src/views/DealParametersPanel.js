import React, { Component } from 'react';
import { Panel, Grid, Col} from 'react-bootstrap';
import VariableSelector from '../components/VariableSelector';
import RequiredInformation from '../components/RequiredInformation';
import MinMaxSelector from '../components/MinMaxSelector';
import './views.css';

class DealParametersPanel extends Component {
  render() {
    return (
      <Panel className="ViewPanel">
        <Panel.Heading>Deal Parameters</Panel.Heading>
        <Panel.Body>
          <Grid>
            <Col md={4}>
              <h4>What do you want to calculate?</h4>
              <VariableSelector />
            </Col>
            <Col md={4}>
              <h4>What are your minimums/maximums?</h4>
              <MinMaxSelector />
            </Col>
            <Col md={4}>
              <h4>Fill out this information:</h4>
              <RequiredInformation />
            </Col>
          </Grid>
        </Panel.Body>
      </Panel>
    );
  }
}

export default DealParametersPanel;

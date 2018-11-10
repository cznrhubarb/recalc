import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Grid, Col} from 'react-bootstrap';
import { updateParameterAmount, setParameterDerived, setParameterType } from '../actions/DealParameterActions';
import VariableSelector from '../components/VariableSelector';
import RequiredInformation from '../components/RequiredInformation';
import MinMaxSelector from '../components/MinMaxSelector';
import { solve } from '../algo/Solve';
import './views.css';

const mapStateToProps = state => {
  return { 
    solvedDealParameters: solve(Object.keys(state.dealParameters).filter((key) => state.dealParameters[key].shouldDerive),
      state.dealParameters, state.fundingMatrices[state.activeFundingMatrix]),
    ...state.dealParameters 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (parameterName, event) => {
      dispatch(updateParameterAmount(parameterName, event.target.value.replace(/\D/g,'')));
    },
    onCheck: (parameterName, event) => {
      dispatch(setParameterDerived(parameterName, event.target.checked));
    },
    onUpdateParameterType: (parameterName, newType) => {
      dispatch(setParameterType(parameterName, newType));
    }
  };
};

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

export default connect(mapStateToProps, mapDispatchToProps)(DealParametersPanel);

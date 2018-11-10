import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Tabs, Tab } from 'react-bootstrap';
import FundingMatrix from '../components/FundingMatrix';
import { addFundingMatrix, setActiveIndex } from '../actions/FundingMatrixActions';
import './views.css';

const mapStateToProps = state => {
  return { tabs: [...state.fundingMatrices], activeKey: state.activeFundingMatrixIndex };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddFundingMatrix: () => {
      dispatch(addFundingMatrix());
    },
    onSetActiveIndex: (newIndex) => {
      dispatch(setActiveIndex(newIndex));
    },
  };
};

class FundingMatrixPanel extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleTabSelect = this.handleTabSelect.bind(this);
  }

  handleTabSelect(key) {
    if (key === 'plus') {
      this.props.onAddFundingMatrix();
      this.props.onSetActiveIndex(this.props.tabs.length);
    } else {
      this.props.onSetActiveIndex(key);
    }
  }
  
  render() {
    return (
      <Panel className="ViewPanel">
        <Panel.Heading>Funding Matrix</Panel.Heading>
        <Panel.Body>
          <Tabs activeKey={this.props.activeKey} onSelect={this.handleTabSelect} id="funding-matrices">
            {
              this.props.tabs.map((tab, index) => 
                <Tab key={index} eventKey={index} title={tab.name || "<untitled>"}>
                  <FundingMatrix 
                    index={index}
                    {...tab}/>
                </Tab>
              )
            }
            <Tab eventKey={'plus'} title="+">
              Not a real tab. Creates a tab.
            </Tab>
          </Tabs>
        </Panel.Body>
      </Panel>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundingMatrixPanel);

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Well } from 'react-bootstrap';
import { setParameterDerived } from '../actions/DealParameterActions';
import $ from 'jquery';
import { AmountTypes } from '../model/Types';
import { solve } from '../algo/Solve';
import '../misc/CheckListBoxSetup';
import './components.css';

const mapStateToProps = state => {
  return { 
    solvedDealParameters: solve(Object.keys(state.dealParameters).filter((key) => state.dealParameters[key].shouldDerive),
      state.dealParameters, state.fundingMatrices[state.activeFundingMatrix]),
    dealParameters: state.dealParameters 
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onCheck: (parameterName, checked) => {
      dispatch(setParameterDerived(parameterName, checked));
    }
  };
};

class VariableSelector extends Component {
  constructor(props) {
    super(props);

    let self = this;
    $(function() {
      $(".var-selector ul.checked-list-box li").on("click", e => {
        self.props.onCheck.call(self, e.target.attributes.tag.nodeValue, Array.from(e.target.classList).includes('active'));
      });
    });

    this.createListItem = this.createListItem.bind(this);
  }

  createListItem(dealParameterName) {
    const fieldData = this.props.dealParameters[dealParameterName];
    const isDollars = fieldData.amountType === AmountTypes.Dollars;
    const solvedAmount = this.props.solvedDealParameters[dealParameterName];
    let displayAmount = solvedAmount || fieldData.amount;
    if (displayAmount) {
      //TODO: Need to add max precision and thousand separator
      if (isDollars) {
        displayAmount = `$${displayAmount}`;
      } else {
        displayAmount = `${displayAmount}%`;
      }
    }

    return (
      <li className="list-group-item" key={dealParameterName} tag={dealParameterName}>
        {dealParameterName} <span style={{float: "right"}}>{displayAmount}</span>
      </li>);
  }

  /*
  <NumberFormat
    thousandSeparator={isDollars ? true : undefined}
    prefix={isDollars ? '$' : undefined}
    suffix={isDollars ? undefined : '%'}
    className="text-right"
    id={dealParameterName}
    type="text"
    decimalScale={3}
    placeholder={placeholder}
    value={fieldData.amount}
  />
  */

  render() {
    return (
      <Well className="var-selector well-sm" style={{maxHeight: "450px", overflow: "auto"}}>
        <ul className="list-group checked-list-box">
          {
            Object.keys(this.props.dealParameters).map(this.createListItem)
          }
        </ul>
      </Well>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VariableSelector);

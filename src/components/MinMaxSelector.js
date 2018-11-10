import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Well } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import { setMinMax } from '../actions/DealParameterActions';
import { AmountTypes } from '../model/Types';
import { solve, getNecessaryValues } from '../algo/Solve';
import '../misc/CheckListBoxSetup';
import './components.css';

const mapStateToProps = state => {
  
  let derivedList = Object.keys(state.dealParameters).filter((key) => state.dealParameters[key].shouldDerive);
  let solved = solve(derivedList, state.dealParameters, state.fundingMatrices[state.activeFundingMatrix]);
  let suppliedList = Object.keys(state.dealParameters).filter((key) => state.dealParameters[key].amount);
  suppliedList.push(...Object.entries(solved));
  let requiredList = getNecessaryValues(derivedList, suppliedList);
  requiredList = requiredList.filter(vn => !derivedList.includes(vn));

  return {
    dealParameters: requiredList.reduce((acc, reqVar) => Object.assign(acc, { [reqVar]: state.dealParameters[reqVar] }), {})
  };

  // return { 
  //   dealParameters: Object.entries(state.dealParameters).reduce((acc, dpEntry) => {
  //     if (dpEntry[1].shouldDerive) {
  //       return Object.assign({[dpEntry[0]]: dpEntry[1]}, acc);
  //     } else {
  //       return acc;
  //     }
  //   }, {})
  // };
};

const mapDispatchToProps = dispatch => {
  return {
    onUpdateMinMax: (parameterName, min, max) => {
      dispatch(setMinMax(parameterName, min, max));
    }
  };
};

class MinMaxSelector extends Component {
  constructor(props) {
    super(props);

    this.createListItem = this.createListItem.bind(this);
  }

  createListItem(dealParameterName) {
    const fieldData = this.props.dealParameters[dealParameterName];
    const isDollars = fieldData.amountType === AmountTypes.Dollars;
    const placeholder = isDollars ? '$0' : '0%';
    const hasMin = fieldData.min !== undefined;
    const hasMax = fieldData.max !== undefined;

    return (
      <li className="list-group-item" key={dealParameterName} tag={dealParameterName}>
        {dealParameterName}
        <table align="center">
          <tbody>
            <tr>
              <th>min</th><th>max</th><th>none</th>
            </tr>
            <tr>
              <td><input type="radio" name={`${dealParameterName}-minmax`} checked={hasMin} onChange={()=>this.props.onUpdateMinMax.call(this, dealParameterName, 0, undefined)}/></td>
              <td><input type="radio" name={`${dealParameterName}-minmax`} checked={hasMax} onChange={()=>this.props.onUpdateMinMax.call(this, dealParameterName, undefined, 0)}/></td>
              <td><input type="radio" name={`${dealParameterName}-minmax`} checked={!hasMin && !hasMax} onChange={()=>this.props.onUpdateMinMax.call(this, dealParameterName, undefined, undefined)}/></td>
            </tr>
          </tbody>
        </table>
        {(hasMin || hasMax) &&
          <NumberFormat
            thousandSeparator={isDollars ? true : undefined}
            prefix={isDollars ? '$' : undefined}
            suffix={isDollars ? undefined : '%'}
            className="text-right"
            id={dealParameterName}
            type="text"
            decimalScale={3}
            placeholder={placeholder}
            value={hasMin ? fieldData.min : fieldData.max}
            onChange={e => {
              let newVal = e.target.value.replace(/\D/g,'');
              hasMin ?
                this.props.onUpdateMinMax.call(this, dealParameterName, newVal, undefined)
                :
                this.props.onUpdateMinMax.call(this, dealParameterName, undefined, newVal);
            }}
            disabled={!hasMin && !hasMax}
          />}
      </li>);
  }

  render() {
    return (
      <Well className="min-max-selector well-sm" style={{maxHeight: "450px", overflow: "auto"}}>
        <ul className="list-group">
          {
            Object.keys(this.props.dealParameters).map(this.createListItem)
          }
        </ul>
      </Well>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MinMaxSelector);

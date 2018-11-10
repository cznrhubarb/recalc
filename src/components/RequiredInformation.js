import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Well } from 'react-bootstrap';
import { updateParameterAmount, setParameterType } from '../actions/DealParameterActions';
import NumberFormat from 'react-number-format';
import { AmountTypes } from '../model/Types';
import { solve, getNecessaryValues } from '../algo/Solve';
import './components.css';

const mapStateToProps = state => {
  let derivedList = Object.keys(state.dealParameters).filter((key) => state.dealParameters[key].shouldDerive);
  let solved = solve(derivedList, state.dealParameters, state.fundingMatrices[state.activeFundingMatrix]);
  let suppliedList = Object.keys(state.dealParameters).filter((key) => state.dealParameters[key].amount);
  suppliedList.push(...Object.entries(solved));
  let requiredList = getNecessaryValues(derivedList, suppliedList);
  // Need to not show anything that is already chosen as derived or has a minimum/maximum
  requiredList = requiredList.filter(vn => !derivedList.includes(vn) && state.dealParameters[vn].min === undefined && state.dealParameters[vn].max === undefined);

  return {
    dealParameters: requiredList.reduce((acc, reqVar) => Object.assign(acc, { [reqVar]: state.dealParameters[reqVar] }), {})
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (parameterName, event) => {
      dispatch(updateParameterAmount(parameterName, event.target.value.replace(/\D/g, '')));
    },
    onUpdateParameterType: (parameterName, newType) => {
      dispatch(setParameterType(parameterName, newType));
    }
  };
};

class RequiredInformation extends Component {
  constructor(props) {
    super(props);

    this.createListItem = this.createListItem.bind(this);
  }

  createListItem(dealParameterName) {
    const fieldData = this.props.dealParameters[dealParameterName];
    const isDollars = fieldData.amountType === AmountTypes.Dollars;
    const placeholder = isDollars ? '$0' : '0%';

    return (
      <li className="list-group-item" key={dealParameterName} tag={dealParameterName}>
        {dealParameterName}
        <span style={{ float: "right" }}>
          <NumberFormat
            style={{width: "100px"}}
            thousandSeparator={isDollars ? true : undefined}
            prefix={isDollars ? '$' : undefined}
            suffix={isDollars ? undefined : '%'}
            className="text-right"
            id={dealParameterName}
            type="text"
            decimalScale={3}
            placeholder={placeholder}
            value={fieldData.amount}
            onChange={this.props.onChange.bind(this, dealParameterName)}
          />
        </span>
      </li>);
  }

  render() {
    return (
      <Well className="req-info well-sm" style={{ maxHeight: "450px", overflow: "auto" }}>
        <ul className="list-group">
          {
            Object.keys(this.props.dealParameters).map(this.createListItem)
          }
        </ul>
      </Well>
    );
  }
}


// {
//   Object.entries(this.props.dealParameters).map(dp => 
//     <li className="list-group-item" key={dp[0]} tag={dp[0]}>
//       <table>
//         <tbody>
//           <td>{dp[0]}</td>
//           <td><input type="text"/></td>
//         </tbody>
//       </table>
//     </li>)
// }
export default connect(mapStateToProps, mapDispatchToProps)(RequiredInformation);

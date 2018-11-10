import React, { Component } from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { Grid, Row, Col, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { AmountTypes } from '../model/Types';
import { updateParameterAmount, setParameterType } from '../actions/DealParameterActions';
import solve from '../algo/Solve';
import './components.css';

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

    this.createField = this.createField.bind(this);
  }

  createField(xs, md, id, label, fieldName) {
    const fieldData = this.props[fieldName];
    const isDollars = fieldData.amountType === AmountTypes.Dollars;
    const solvedAmount = this.props.solvedDealParameters[fieldName];
    const displayAmount = solvedAmount || fieldData.amount;
    const placeholder = isDollars ? '$0' : '0%';

    let bgColor = '#FFFFFF';
    if (fieldData.shouldDerive) {
      bgColor = '#CCCCCC';
    } else if (solvedAmount !== undefined && !fieldData.amount) {
      bgColor = '#FFFF00';
    } else {
      return;
    }

    return (
      <Col xs={xs} md={md} style={{ border: "black solid 1px" }}>
        {label}<br />
        <NumberFormat
          style={{ backgroundColor: bgColor }}
          thousandSeparator={isDollars ? true : undefined}
          prefix={isDollars ? '$' : undefined}
          suffix={isDollars ? undefined : '%'}
          className="text-right"
          id={id}
          type="text"
          decimalScale={3}
          label={label}
          placeholder={placeholder}
          value={displayAmount}
          onChange={this.props.onChange.bind(this, fieldName)}
          disabled={fieldData.shouldDerive}
        />
        {
          fieldData.amountTypeToggleable &&
          <ToggleButtonGroup type="radio" name="amountType" value={fieldData.amountType} onChange={this.props.onUpdateParameterType.bind(this, fieldName)}>
            <ToggleButton value={AmountTypes.Dollars}>$</ToggleButton>
            <ToggleButton value={AmountTypes.Percent}>%</ToggleButton>
          </ToggleButtonGroup>
        }
      </Col>
    );
  }

  render() {
    return (
      <Grid>
        <Row>
          {this.createField(4, 2, "dpEquity", "Equity After Repairs", "equityAfterRepairs")}
          {this.createField(4, 2, "dpPropertyManagement", "Property Management", "propertyManagement")}
          {this.createField(4, 2, "dpMaintenance", "Repairs/Maintenance", "repairsMaintenance")}
          {this.createField(4, 2, "dpCapEx", "Capital Expenditures", "capitalExpenditures")}
        </Row>
        <Row>
          {this.createField(4, 2, "dpExpenses", "Operating Expenses", "operatingExpenses")}
          {this.createField(4, 2, "dpTotalExpenses", "Total Expenses", "totalExpenses")}
          {this.createField(4, 2, "dpHOA", "HOA Fees", "hoaFees")}
          {this.createField(4, 2, "dpNOI", "NOI", "noi")}
        </Row>
        <Row>
          {this.createField(4, 2, "dpRent", "Rent", "rent")}
          {this.createField(4, 2, "dpARV", "ARV", "arv")}
          {this.createField(4, 2, "dpRepairEstimate", "Estimated Repairs", "estimatedRepairs")}
          {this.createField(4, 2, "dpCashOutlay", "Cash Outlay", "cashOutlay")}
        </Row>
        <Row>
          {this.createField(4, 2, "dpVacancy", "Vacancy", "vacancy")}
          {this.createField(4, 2, "dpTaxes", "Taxes", "taxes")}
          {this.createField(4, 2, "dpInsurance", "Insurance", "insurance")}
          {this.createField(4, 2, "dpOtherIncome", "Other Income", "otherIncome")}
        </Row>
        <Row>
          {this.createField(4, 2, "dpPrice", "Purchase Price", "purchasePrice")}
          {this.createField(4, 2, "dpProfitPerMonth", "Profit Per Month", "profitPerMonth")}
          {this.createField(4, 2, "dpCapRate", "Cap Rate", "capRate")}
          {this.createField(4, 2, "dpDebtService", "Debt Service", "debtService")}
        </Row>
        <Row>
          {this.createField(4, 2, "dpOtherExpenses", "Other Expenses", "otherExpenses")}
          {this.createField(4, 2, "dpCoCROI", "Cash on Cash ROI", "cashOnCashRoi")}
          {this.createField(4, 2, "dpClosingCosts", "Closing Costs", "closingCosts")}
        </Row>
      </Grid>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RequiredInformation);

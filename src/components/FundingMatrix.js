import React, { Component } from 'react';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import { Panel, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Glyphicon, Button, Checkbox, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { AmountTypes } from '../model/Types';
import { duplicateFundingMatrix, changeFundingMatrixName, deleteFundingMatrix, addFundingOption, deleteFundingOption, moveFundingOption, updateFundingOptionParam, Direction } from '../actions/FundingMatrixActions';

const mapStateToProps = state => {
  return { ...state.fundingMatrices };
};

const mapDispatchToProps = dispatch => {
  return {
    onDuplicateFundingMatrix: (fundingMatrixIndex) => {
      dispatch(duplicateFundingMatrix(fundingMatrixIndex));
    },
    onNameChange: (fundingMatrixIndex, event) => {
      dispatch(changeFundingMatrixName(fundingMatrixIndex, event.target.value));
    },
    onDeleteFundingMatrix: (fundingMatrixIndex) => {
      dispatch(deleteFundingMatrix(fundingMatrixIndex));
    },
    onAddFundingOption: (fundingMatrixIndex) => {
      dispatch(addFundingOption(fundingMatrixIndex));
    },
    onDeleteFundingOption: (fundingMatrixIndex, fundingOptionIndex) => {
      dispatch(deleteFundingOption(fundingMatrixIndex, fundingOptionIndex));
    },
    onMoveFundingOption: (fundingMatrixIndex, fundingOptionIndex, direction) => {
      dispatch(moveFundingOption(fundingMatrixIndex, fundingOptionIndex, direction));
    },
    onUpdateFundingOptionParam: (fundingMatrixIndex, fundingOptionIndex, paramName, value) => {
      dispatch(updateFundingOptionParam(fundingMatrixIndex, fundingOptionIndex, paramName, value));
    }
  };
};

class FundingMatrix extends Component {
  render() {
    return (
      <div>
        <Panel>
          <Grid>
            <Row>
              <FormGroup controlId="fmPlanName">
                <Col xs={3} md={3}>
                  <ControlLabel>Funding Plan Name</ControlLabel>
                </Col>
                <Col xs={5} md={5}>
                  <FormControl
                    type="text"
                    value={this.props.name}
                    placeholder="Seller Financing, Traditional Mortgage, etc."
                    onChange={this.props.onNameChange.bind(this, this.props.index)}
                  />
                </Col>
                <Col xs={2} md={2}>
                  <Button onClick={this.props.onDeleteFundingMatrix.bind(this, this.props.index)}>
                    <Glyphicon glyph="trash" />
                  </Button>
                  <Button onClick={this.props.onDuplicateFundingMatrix.bind(this, this.props.index)}>
                    <Glyphicon glyph="duplicate" />
                  </Button>
                </Col>
                <Col xs={2} md={2}>
                  <Button onClick={this.props.onAddFundingOption.bind(this, this.props.index)}>
                    Add Funding Option
                  </Button>
                </Col>
              </FormGroup>
            </Row>
            <Row>
              <Col xs={2} md={2}>Source</Col>
              <Col xs={2} md={2}>Amortization (Months)</Col>
              <Col xs={2} md={2}>Amount</Col>
              <Col xs={2} md={2}>$ or %</Col>
              <Col xs={1} md={1}>Cash?</Col>
            </Row>
            {this.props.fundingOptions.map((fo, index) => 
              <Row key={index}>
                <Col xs={2} md={2}>
                  <FormControl
                    type="text"
                    value={fo.name}
                    placeholder="HELOC, Cash, Hard Money, etc."
                    onChange={(e) => this.props.onUpdateFundingOptionParam.call(this, this.props.index, index, 'name', e.target.value)}
                  />
                </Col>
                <Col xs={2} md={2}>
                  <FormControl 
                    className="text-right"
                    type="text"
                    value={fo.amortizationPeriod}
                    placeholder="Interest Only"
                    onChange={(e) => this.props.onUpdateFundingOptionParam.call(this, this.props.index, index, 'amortizationPeriod', e.target.value)}
                  />
                </Col>
                <Col xs={2} md={2}>
                  <NumberFormat
                    thousandSeparator={fo.amountType === AmountTypes.Dollars ? true : undefined}
                    prefix={fo.amountType === AmountTypes.Dollars ? '$' : undefined}
                    suffix={fo.amountType === AmountTypes.Dollars ? undefined : '%'}
                    className="text-right"
                    type="text"
                    value={fo.amount}
                    onChange={(e) => this.props.onUpdateFundingOptionParam.call(this, this.props.index, index, 'amount', e.target.value)}
                  />
                </Col>
                <Col xs={2} md={2}>
                  <ToggleButtonGroup type="radio" name="amountType" value={fo.amountType} onChange={this.props.onUpdateFundingOptionParam.bind(this, this.props.index, index, 'amountType')}>
                    <ToggleButton value={AmountTypes.Dollars}>$</ToggleButton>
                    <ToggleButton value={AmountTypes.Percent}>%</ToggleButton>
                  </ToggleButtonGroup>
                </Col>
                <Col xs={1} md={1}>
                  <Checkbox checked={fo.isCash} onChange={(e) => this.props.onUpdateFundingOptionParam.call(this, this.props.index, index, 'isCash', e.target.checked)} />
                </Col>
                <Col xs={3} md={3}>
                  <Button onClick={this.props.onMoveFundingOption.bind(this, this.props.index, index, Direction.UP)}>
                    <Glyphicon glyph="arrow-up" />
                  </Button>
                  <Button onClick={this.props.onMoveFundingOption.bind(this, this.props.index, index, Direction.DOWN)}>
                    <Glyphicon glyph="arrow-down" />
                  </Button>
                  <Button onClick={this.props.onDeleteFundingOption.bind(this, this.props.index, index)}>
                    <Glyphicon glyph="trash" />
                  </Button>
                </Col>
              </Row>
            )}
          </Grid>
        </Panel>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FundingMatrix);
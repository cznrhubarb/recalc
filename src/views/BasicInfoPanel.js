import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Panel, Grid, Row, Col, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { updateBasicInfoParam } from '../actions/BasicInfoActions';
import './views.css';

const mapStateToProps = state => {
  return { ...state.dealParameters };
};

const mapDispatchToProps = dispatch => {
  return {
    onChange: (parameterName, event) => {
      dispatch(updateBasicInfoParam(parameterName, event.target.value));
    }
  };
};

class BasicInfoPanel extends Component {
  render() {
    return (
      <Panel className="ViewPanel">
        <Panel.Heading>Basic Info</Panel.Heading>
        <Panel.Body>
          <Grid>
            <Row>
              <Col xs={12} md={6}>
                <FieldGroup
                  id="biReportName"
                  type="text"
                  label="Report Name"
                  placeholder="My Super Report"
                  value={this.props.reportName}
                  onChange={this.props.onChange.bind(this, 'reportName')}
                />
              </Col>
              <Col xs={12} md={6}>
                <FieldGroup
                  id="biAddress"
                  type="text"
                  label="Address"
                  placeholder="123 Main Street"
                  value={this.props.address}
                  onChange={this.props.onChange.bind(this, 'address')}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={4} md={2}>
                <FieldGroup
                  id="biNumUnits"
                  type="text"
                  label="# Units"
                  placeholder="1"
                  value={this.props.numUnits}
                  onChange={this.props.onChange.bind(this, 'numUnits')}
                />
              </Col>
              <Col xs={4} md={2}>
                <FieldGroup
                  id="biBedBath"
                  type="text"
                  label="Beds/Baths"
                  placeholder="1/1"
                  value={this.props.bedBathCount}
                  onChange={this.props.onChange.bind(this, 'bedBathCount')}
                />
              </Col>
              <Col xs={4} md={2}>
                <FieldGroup
                  id="biTotalSqFt"
                  type="text"
                  label="Total Sq Ft"
                  placeholder="1000"
                  value={this.props.totalSqFt}
                  onChange={this.props.onChange.bind(this, 'totalSqFt')}
                />
              </Col>
              <Col xs={6} md={3}>
                <FieldGroup
                  id="biCrimeRating"
                  type="text"
                  label="Crime Rating"
                  placeholder="Very Safe"
                  value={this.props.crimeRating}
                  onChange={this.props.onChange.bind(this, 'crimeRating')}
                />
              </Col>
              <Col xs={6} md={3}>
                <FieldGroup
                  id="biSchoolRating"
                  type="text"
                  label="School Rating"
                  placeholder="The Best"
                  value={this.props.schoolRating}
                  onChange={this.props.onChange.bind(this, 'schoolRating')}
                />
              </Col>
            </Row>
          </Grid>
        </Panel.Body>
      </Panel>
    );
  }
}

function FieldGroup({ id, label, help, ...props }) {
  return (
    <FormGroup controlId={id}>
      <ControlLabel>{label}</ControlLabel>
      <FormControl {...props} />
      {help && <HelpBlock>{help}</HelpBlock>}
    </FormGroup>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BasicInfoPanel);

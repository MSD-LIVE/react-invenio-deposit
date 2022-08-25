// MSD-LIVE CHANGE just changing help text wording (and removed <Trans> wrapper component as we don't need translations)
// copied from:
// react-invenio-deposit\src\lib\components

// This file is part of React-Invenio-Deposit
// Copyright (C) 2021 CERN.
// Copyright (C) 2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SelectField } from 'react-invenio-forms';
import _reduce from 'lodash/reduce';
import _unickBy from 'lodash/unionBy';
// import { i18next } from '@translations/i18next';
import { i18next } from "@translations/invenio_app_rdm/i18next";

export class CreatibutorsIdentifiers extends Component {
  static propTypes = {
    initialOptions: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
      })
    ).isRequired,
    fieldPath: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    fieldPath: 'person_or_org.identifiers',
    // MSD-LIVE CHANGE changed label and placeholder
    label: i18next.t('ORCID'),
    placeholder: i18next.t('https://orcid.org/0000-0012-3456-789X'),
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: props.initialOptions,
    };
  }

  //MSD-LIVE CHANGE this doesn't appear to do anything plus it throws a JS error
  // handleIdentifierAddition = (e, { value }) => {
  //   this.setState((prevState) => ({
  //     selectedOptions: _unickBy(
  //       [
  //         {
  //           text: value,
  //           value: value,
  //           key: value,
  //         },
  //         ...prevState.selectedOptions,
  //       ],
  //       'value'
  //     ),
  //   }));
  // };

  valuesToOptions = (options) =>
    options.map((option) => ({
      text: option,
      value: option,
      key: option,
    }));

  handleChange = ({ data, formikProps }) => {
    this.setState({
      selectedOptions: this.valuesToOptions(data.value),
    });
    // MSD-LIVE CHANGE test the format matches expected for orcid and if not set error
    //format has to be like https://orcid.org/0000-0001-2345-6789 as implemented in RDM
    // see https://support.orcid.org/hc/en-us/articles/360006897674-Structure-of-the-ORCID-Identifier
    const orcid_urls = ["http://orcid.org/", "https://orcid.org/"]
    const valid = _reduce(data.value, (valid, id) => {
      //its a valid orc id if it (optionally) starts with one of the above urls
      //and is 4 sets of digits 4 numbers long with - between
      //OR  is 3 sets of digits 4 numbers long with - between, the 4th is 3 digits plus an X or x
      // const startsWithUrl = id.startsWith(orcid_urls[0]) || id.startsWith(orcid_urls[1]);
      id = id.replace(orcid_urls[0], '');
      id = id.replace(orcid_urls[1], '');
      const isValidNumbers = /^\d{4}-\d{4}-\d{4}-\d{4}$/.test(id)
      const isValidNumbersWithX = /^\d{4}-\d{4}-\d{4}-\d{3}[xX]{1}$/.test(id)
      return valid === false ? false : (isValidNumbers | isValidNumbersWithX)
    }, true);

    valid ? formikProps.form.setFieldError(this.props.fieldPath, undefined) : formikProps.form.setFieldError(this.props.fieldPath, 'Invalid format for ORCID. Should be 0000-0000-0000-0000')
    formikProps.form.setFieldValue(this.props.fieldPath, data.value);
  };

  render() {
    return (
      <SelectField
        fieldPath={this.props.fieldPath}
        label={this.props.label}
        options={this.state.selectedOptions}
        placeholder={this.props.placeholder}
        noResultsMessage={i18next.t('Type the value of an identifier...')}
        search
        multiple
        selection
        allowAdditions
        onChange={this.handleChange}
        // `icon` is set to `null` in order to hide the dropdown default icon
        icon={null}
        // MSD-LIVE CHANGE removed as it wasn't needed and was throwing js errors
        // onAddItem={this.handleIdentifierAddition}
        optimized
      />
    );
  }
}

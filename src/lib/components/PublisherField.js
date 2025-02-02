// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FieldLabel, TextField } from 'react-invenio-forms';

export class PublisherField extends Component {
  render() {
    const { fieldPath, label, labelIcon, placeholder } = this.props;

    return (
      <TextField
        fieldPath={fieldPath}
        // MSD-LIVE CHANGE changed helpText
        helpText={
          'In case your upload was already published elsewhere, please use the publisher of the first publication (e.g., Springer).'
        }
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        placeholder={placeholder}
      />
    );
  }
}

PublisherField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  placeholder: PropTypes.string,
};

PublisherField.defaultProps = {
  fieldPath: 'metadata.publisher',
  label: 'Publisher',
  labelIcon: 'building outline',
  placeholder: 'Publisher',
};

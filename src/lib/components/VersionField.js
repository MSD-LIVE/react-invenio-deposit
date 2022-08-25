// MSD-LIVE CHANGE just changing help text wording (and removed <Trans> wrapper component as we don't need translations)
// copied from:
// react-invenio-deposit\src\lib\components

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
// import { i18next } from '@translations/i18next';
// import { Trans } from '@translations/i18next';
export class VersionField extends Component {
  render() {
    const { fieldPath, label, labelIcon, placeholder } = this.props;
    // MSD-LIVE CHANGE changed helpText
    const helpText = (
      <span>
          All uploads will be assigned a version number.  If you have
a specific version number for your software or dataset, please enter it here.  Otherwise, a version number will be assigned
automatically by the Data Repository.  See
          <a
            href="https://semver.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            semver.org
          </a>
          {' '}for versioning guidance.
      </span>
    );

    return (
      <TextField
        fieldPath={fieldPath}
        helpText={helpText}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        placeholder={placeholder}
      />
    );
  }
}

VersionField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  placeholder: PropTypes.string,
};

VersionField.defaultProps = {
  fieldPath: 'metadata.version',
  label: 'Version',
  labelIcon: 'code branch',
  placeholder: '',
};

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

import { FieldLabel, RichInputField } from 'react-invenio-forms';
//MSD-LIVE CHANGE using our version of add'l descriptions and corrected i18next import
import { AdditionalDescriptionsField } from './AdditionalDescriptionsField';
import { i18next } from "@translations/invenio_app_rdm/i18next";

export class DescriptionsField extends Component {
  render() {
    const { fieldPath, label, labelIcon, options, editorConfig, recordUI } =
      this.props;
    return (
      <>
        <RichInputField
          className="description-field rel-mb-1"
          fieldPath={fieldPath}
          editorConfig={editorConfig}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          optimized
        />
        <AdditionalDescriptionsField recordUI={recordUI} options={options} />
      </>
    );
  }
}

DescriptionsField.propTypes = {
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  editorConfig: PropTypes.object,
  recordUI: PropTypes.object,
};

DescriptionsField.defaultProps = {
  fieldPath: 'metadata.description',
  label: i18next.t('Description'),
  labelIcon: 'pencil',
  editorConfig: {},
  recordUI: {},
};

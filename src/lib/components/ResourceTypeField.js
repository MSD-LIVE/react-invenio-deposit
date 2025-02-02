// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';
import _filter from 'lodash/filter';
import { FieldLabel, SelectField } from 'react-invenio-forms';
import { Icon } from 'semantic-ui-react';
import { i18next } from "@translations/invenio_app_rdm/i18next";

export class ResourceTypeField extends Component {
  groupErrors = (errors, fieldPath) => {
    const fieldErrors = _get(errors, fieldPath);
    if (fieldErrors) {
      return { content: fieldErrors };
    }
    return null;
  };

  /**
   * Generate label value
   *
   * @param {object} option - back-end option
   * @returns {string} label
   */
  _label = (option) => {
    return (
      option.type_name +
      (option.subtype_name ? ' / ' + option.subtype_name : '')
    );
  };

  /**
   * Convert back-end options to front-end options.
   *
   * @param {array} propsOptions - back-end options
   * @returns {array} front-end options
   */
  createOptions = (propsOptions) => {
    //MSD-LIVE CHANGE remove Dataset, Software, and presentation as options because if non of the subtyped
    // ones match what the user has then she should select (e.g.) Dataset / Other instead of just Dataset
    const msdlives_list = _filter(propsOptions, (option) => {
      return !((option.type_name == 'Dataset' && option.subtype_name == '') ||
          (option.type_name == 'Software' && option.subtype_name == '') ||
          (option.type_name == 'Publication' && option.subtype_name == 'Other') ||
          (option.type_name == 'Presentation' && option.subtype_name == '')
      );
    })

    return msdlives_list
      .map((o) => ({ ...o, label: this._label(o) }))
      .sort((o1, o2) => o1.label.localeCompare(o2.label))
      .map((o) => {
        return {
          value: o.id,
          icon: o.icon,
          text: o.label,
        };
      });
  };

  render() {
    const { fieldPath, label, labelIcon, options, ...restProps } = this.props;
    const frontEndOptions = this.createOptions(options);
    return (
      <SelectField
        fieldPath={fieldPath}
        label={
          <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
        }
        optimized={true}
        options={frontEndOptions}
        selectOnBlur={false}
        {...restProps}
      />
    );
  }
}

ResourceTypeField.propTypes = {
  fieldPath: PropTypes.string,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  labelclassname: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string,
      type_name: PropTypes.string,
      subtype_name: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  required: PropTypes.bool,
};

ResourceTypeField.defaultProps = {
  fieldPath: 'metadata.resource_type',
  label: i18next.t('Resource type'),
  labelIcon: 'tag',
  labelclassname: 'field-label-class',
};

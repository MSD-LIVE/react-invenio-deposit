// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2022 Northwestern University.
// Copyright (C) 2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  TextField,
  GroupField,
  ArrayField,
  FieldLabel,
  SelectField,
} from 'react-invenio-forms';
import { Button, Form, Icon } from 'semantic-ui-react';

import { emptyRelatedWork } from '../record';
import { ResourceTypeField } from './ResourceTypeField';
import { i18next } from "@translations/invenio_app_rdm/i18next";

export class RelatedWorksField extends Component {
  render() {
    const { fieldPath, label, labelIcon, required, options } = this.props;

    return (
      <>
        <label className="helptext" style={{ marginBottom: '10px' }}>
            {/* MSD-LIVE Change:  Changed the helper text to be more meaningful. */}
          {i18next.t(
            'Specify other data sets that are related to this work. Related works highlight work done by others that ties in with this data. ' +
              'It can include relationships such as work that this data is derived from or papers that have been written about this data.  ' +
              'Related works can be specified by a variety of unique identifiers including DOI, ARK, PURL, ISSN, ISBN, URN, or URL.  ' +
              'See the dropdown lists for the full list of supported relationships and identifiers.'
          )}
        </label>
        <ArrayField
          addButtonLabel={i18next.t('Add related work')}
          defaultNewValue={emptyRelatedWork}
          fieldPath={fieldPath}
          label={
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
          }
          required={required}
        >
          {({ arrayHelpers, indexPath }) => {
            const fieldPathPrefix = `${fieldPath}.${indexPath}`;

            return (
              <GroupField optimized>
                <SelectField
                  clearable
                  fieldPath={`${fieldPathPrefix}.relation_type`}
                  label={i18next.t('Relation')}
                  optimized
                  options={options.relations}
                  placeholder={i18next.t('Select relation...')}
                  required
                  width={3}
                />

                <TextField
                  fieldPath={`${fieldPathPrefix}.identifier`}
                  label={i18next.t('Identifier')}
                  required
                  width={4}
                />

                <SelectField
                  clearable
                  fieldPath={`${fieldPathPrefix}.scheme`}
                  label={i18next.t('Scheme')}
                  optimized
                  options={options.scheme}
                  required
                  width={2}
                />

                <ResourceTypeField
                  clearable
                  fieldPath={`${fieldPathPrefix}.resource_type`}
                  labelIcon={''} // Otherwise breaks alignment
                  options={options.resource_type}
                  width={7}
                  labelclassname="small field-label-class"
                />

                <Form.Field>
                  <Button
                    className="close-btn"
                    icon 
                    onClick={() => arrayHelpers.remove(indexPath)}
                  >
                    <Icon name="close" />
                  </Button>
                </Form.Field>
              </GroupField>
            );
          }}
        </ArrayField>
      </>
    );
  }
}

RelatedWorksField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string,
  labelIcon: PropTypes.string,
  required: PropTypes.bool,
};

RelatedWorksField.defaultProps = {
  fieldPath: 'metadata.related_identifiers',
  label: i18next.t('Related works'),
  labelIcon: 'barcode',
};

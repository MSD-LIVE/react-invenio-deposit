// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2021 CERN.
// Copyright (C) 2020-2021 Northwestern University.
// Copyright (C)      2021 Graz University of Technology.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { FieldLabel } from 'react-invenio-forms';
import { Card, Divider, Form, Header } from 'semantic-ui-react';
import { i18next } from "@translations/invenio_app_rdm/i18next";
import {
  MetadataAccess,
  FilesAccess,
  EmbargoAccess,
  AccessMessage,
} from './Access';

export class AccessRightFieldCmp extends Component {
  /** Top-level Access Right Component */

  render() {
    const {
      fieldPath,
      formik, // this is our access to the shared current draft
      label,
      labelIcon,
      community,
    } = this.props;

    const communityAccess = community?.access.visibility || 'public';
    const isMetadataOnly = !formik.form.values.files.enabled;

    return (
      <Card className="access-right">
        {/* MSD-LIVE Change:  Got rid of required style since there is no way to not set this field.  It looked wierd
        with the red asterisk. */}
        <Form.Field>

          <Card.Content>
            <Card.Header>
              <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
            </Card.Header>
          </Card.Content>

          <Card.Content>
            {/* MSD-LIVE Change:  Moved the access status message above the toggle buttons. */}
            <AccessMessage
              access={formik.field.value}
              accessCommunity={communityAccess}
              metadataOnly={isMetadataOnly}
            />

            <Divider hidden />

            <MetadataAccess
              recordAccess={formik.field.value.record}
              communityAccess={communityAccess}
            />

            <Divider hidden />

            <FilesAccess
              access={formik.field.value}
              accessCommunity={communityAccess}
              metadataOnly={isMetadataOnly}
            />

            <Divider hidden />
          </Card.Content>
          <Card.Content className='no-border'>
            <Card.Header as={Header} size="tiny">
              {i18next.t('Options')}
            </Card.Header>
          </Card.Content>
          <Card.Content extra className='no-border'>
            <EmbargoAccess
              access={formik.field.value}
              accessCommunity={communityAccess}
              metadataOnly={isMetadataOnly}
            />
          </Card.Content>
        </Form.Field>
      </Card>
    );
  }
}

AccessRightFieldCmp.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string.isRequired,
  community: PropTypes.object,
};

AccessRightFieldCmp.defaultProps = {
  community: undefined,
}

const mapStateToPropsAccessRightFieldCmp = (state) => ({
  community: state.deposit.editorState.selectedCommunity,
});

export const AccessRightFieldComponent = connect(
  mapStateToPropsAccessRightFieldCmp,
  null
)(AccessRightFieldCmp);

export class AccessRightField extends Component {
  render() {
    const { fieldPath } = this.props;

    return (
      <Field name={fieldPath}>
        {(formik) => (
          <AccessRightFieldComponent formik={formik} {...this.props} />
        )}
      </Field>
    );
  }
}

AccessRightField.propTypes = {
  fieldPath: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string,
  isMetadataOnly: PropTypes.bool,
};

AccessRightField.defaultProps = {
  fieldPath: 'access',
};

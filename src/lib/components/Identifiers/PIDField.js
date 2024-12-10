// MSD-LIVE CHANGE these components have been changed a lot in order
// to re-do how the UI was laid out and also to add a third radio option
// of "i do not need a DOI"

// This file is part of React-Invenio-Deposit
// Copyright (C) 2021-2022 CERN.
// Copyright (C) 2021-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import { i18next } from "@translations/invenio_app_rdm/i18next";
import { FastField, Field, getIn } from 'formik';
import _debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FieldLabel } from 'react-invenio-forms';
import { connect } from 'react-redux';
import { Form, Popup, Radio } from 'semantic-ui-react';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../../DepositFormSubmitContext';
import { DISCARD_PID_STARTED, RESERVE_PID_STARTED } from '../../state/types';

const PROVIDER_EXTERNAL = 'external';
const UPDATE_PID_DEBOUNCE_MS = 200;

const getFieldErrors = (form, fieldPath) => {
  return (
    getIn(form.errors, fieldPath, null) ||
    getIn(form.initialErrors, fieldPath, null)
  );
};

/**
 * Button component to reserve a PID.
 */
class ReservePIDBtn extends Component {
  render() {
    const { disabled, handleReservePID, label, loading } = this.props;
    return (
      <Field>
        {({ form: formik }) => (
          <Form.Button
            className="positive"
            size="mini"
            loading={loading}
            disabled={disabled || loading}
            onClick={(e) => handleReservePID(e, formik)}
            content={label}
          />
        )}
      </Field>
    );
  }
}

ReservePIDBtn.propTypes = {
  disabled: PropTypes.bool,
  handleReservePID: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

ReservePIDBtn.defaultProps = {
  disabled: false,
  loading: false,
};

/**
 * Button component to unreserve a PID.
 */
class UnreservePIDBtn extends Component {
  render() {
    const { disabled, handleDiscardPID, label, loading } = this.props;
    return (
      <Popup
        content={label}
        trigger={
          <Field>
            {({ form: formik }) => (
              <Form.Button
                disabled={disabled || loading}
                loading={loading}
                icon="close"
                onClick={(e) => handleDiscardPID(e, formik)}
                size="mini"
              />
            )}
          </Field>
        }
      />
    );
  }
}

UnreservePIDBtn.propTypes = {
  disabled: PropTypes.bool,
  handleDiscardPID: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

UnreservePIDBtn.defaultProps = {
  disabled: false,
  loading: false,
};

/**
 * Manage radio buttons choices between managed
 * and unmanaged PID.
 */
class ManagedUnmanagedSwitch extends Component {
  constructor(props) {
    super(props);
    const initRadioState = props.hasManagedIdentifier ? "need" : props.isManagedSelected ? 'managed' : 'unmanaged';
    this.state = {
      selectedRadio: initRadioState
    }
  }

  handleChange = (e, { value }) => {
    const { onManagedUnmanagedChange } = this.props;
    const isManagedSelected = (value === 'managed' || value === 'need' );
    onManagedUnmanagedChange(isManagedSelected, value);
    this.setState({selectedRadio: value})
  };

  render() {
    const { disabled, isManagedSelected, pidLabel } = this.props;

    return (
      <Form.Group >
        <Form.Field style={{marginBottom: "0rem"}}>
          <Radio
            label={"I do not need a DOI"}
            name="radioGroup"
            value="managed"
            disabled={disabled}
            checked={this.state.selectedRadio === 'managed'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field style={{marginBottom: "0rem"}}>
          <Radio
            label={'I have a DOI already'}
            name="radioGroup"
            value="unmanaged"
            disabled={disabled}
            checked={this.state.selectedRadio === 'unmanaged'}
            onChange={this.handleChange}
          />
        </Form.Field>
        <Form.Field style={{marginBottom: "0rem"}}>
          <Radio
            label={'I need a DOI'}
            name="radioGroup"
            value="need"
            disabled={disabled}
            checked={this.state.selectedRadio === 'need'}
            onChange={this.handleChange}
          />
        </Form.Field>
      </Form.Group>
    );
  }
}

ManagedUnmanagedSwitch.propTypes = {
  disabled: PropTypes.bool,
  hasManagedIdentifier: PropTypes.bool,
  isManagedSelected: PropTypes.bool.isRequired,
  onManagedUnmanagedChange: PropTypes.func.isRequired,
};

ManagedUnmanagedSwitch.defaultProps = {
  disabled: false,
  hasManagedIdentifier: false
};

/**
 * Render identifier field and reserve/unreserve
 * button components for managed PID.
 */
class ManagedIdentifierComponent extends Component {
  static contextType = DepositFormSubmitContext;

  handleReservePID = (event, formik) => {
    const { pidType } = this.props;
    this.context.setSubmitContext(DepositFormSubmitActions.RESERVE_PID, {
      pidType: pidType,
    });
    formik.handleSubmit(event);
  };

  handleDiscardPID = (event, formik) => {
    const { pidType } = this.props;
    this.context.setSubmitContext(DepositFormSubmitActions.DISCARD_PID, {
      pidType: pidType,
    });
    formik.handleSubmit(event);
  };

  render() {
    const {
      actionState,
      actionStateExtra,
      btnLabelDiscardPID,
      btnLabelGetPID,
      disabled,
      helpText,
      identifier,
      pidPlaceholder,
      pidType,
    } = this.props;
    const hasIdentifier = identifier !== '';

    const ReserveBtn = (
      <ReservePIDBtn
        disabled={disabled || hasIdentifier}
        label={btnLabelGetPID}
        loading={
          actionState === RESERVE_PID_STARTED &&
          actionStateExtra.pidType === pidType
        }
        handleReservePID={this.handleReservePID}
      />
    );

    const UnreserveBtn = (
      <UnreservePIDBtn
        disabled={disabled}
        label={btnLabelDiscardPID}
        handleDiscardPID={this.handleDiscardPID}
        loading={
          actionState === DISCARD_PID_STARTED &&
          actionStateExtra.pidType === pidType
        }
        pidType={this.props.pidType}
      />
    );

    return (
      <>
        <Form.Group inline>
          {/*{hasIdentifier ? (*/}
          {/*  <Form.Field>*/}
          {/*    <label>{identifier}</label>*/}
          {/*  </Form.Field>*/}
          {/*) : (*/}
          {/*  <Form.Field width={4}>*/}
          {/*    <Form.Input*/}
          {/*      disabled*/}
          {/*      value=""*/}
          {/*      placeholder={pidPlaceholder}*/}
          {/*      width={16}*/}
          {/*    />*/}
          {/*  </Form.Field>*/}
          {/*)}*/}
          {hasIdentifier &&
            <Form.Field style={{marginBottom: "0rem"}}>
              <label>{identifier}</label>
            </Form.Field>
          }

          <Form.Field>{identifier ? UnreserveBtn : ReserveBtn}</Form.Field>
        </Form.Group>
        {/*use our own help text*/}
        {/*{helpText && <label className="helptext">{helpText}</label>}*/}
        {identifier ? <label className="helptext">The above DOI has been reserved with OSTI and will be registered when your upload is published</label> : <label className="helptext">Reserve a DOI by pressing the button (e.g to include it in publications). The DOI is registered within 24 hours of when your upload is published</label>}
      </>
    );
  }
}

ManagedIdentifierComponent.propTypes = {
  btnLabelGetPID: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  form: PropTypes.object.isRequired,
  helpText: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
  pidType: PropTypes.string.isRequired,
  /* from Redux */
  actionState: PropTypes.string,
  actionStateExtra: PropTypes.object,
};

ManagedIdentifierComponent.defaultProps = {
  disabled: false,
  helpText: null,
  /* from Redux */
  actionState: '',
  actionStateExtra: {},
};

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  actionStateExtra: state.deposit.actionStateExtra,
});

const ManagedIdentifierCmp = connect(
  mapStateToProps,
  null
)(ManagedIdentifierComponent);

/**
 * Render identifier field to allow user to input
 * the unmanaged PID.
 */
class UnmanagedIdentifierCmp extends Component {
  constructor(props) {
    super(props);

    const { identifier } = props;

    this.state = {
      localIdentifier: identifier,
    };
  }

  onChange = (value) => {
    const { onIdentifierChanged } = this.props;
    this.setState({ localIdentifier: value }, () => onIdentifierChanged(value));
  };

  componentDidUpdate(prevProps) {
    // called after the form field is updated and therefore re-rendered.
    if (this.props.identifier !== prevProps.identifier) {
      this.setState({ localIdentifier: this.props.identifier });
    }
  }

  render() {
    const { localIdentifier } = this.state;
    const { form, fieldPath, helpText, pidPlaceholder } = this.props;
    const fieldError = getFieldErrors(form, fieldPath);
    return (
      <>
        <Form.Field width={8} error={fieldError} style={{marginBottom: "2rem"}}>
          <Form.Input
            onChange={(e, { value }) => this.onChange(value)}
            value={localIdentifier}
            placeholder={pidPlaceholder}
            width={16}
            error={fieldError}
          />
        </Form.Field>
        {helpText && <label className="helptext">{helpText}</label>}
      </>
    );
  }
}

UnmanagedIdentifierCmp.propTypes = {
  helpText: PropTypes.string,
  identifier: PropTypes.string.isRequired,
  onIdentifierChanged: PropTypes.func.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
};

UnmanagedIdentifierCmp.defaultProps = {
  helpText: null,
};

/**
 * Render managed or unamanged PID fields and update
 * Formik form on input changed.
 * The field value has the following format:
 * { 'doi': { identifier: '<value>', provider: '<value>', client: '<value>' } }
 */
class CustomPIDField extends Component {
  constructor(props) {
    super(props);

    const { canBeManaged, canBeUnmanaged } = this.props;
    this.canBeManagedAndUnmanaged = canBeManaged && canBeUnmanaged;

    this.state = {
      isManagedSelected: undefined,
      selectedRadio: "managed"
    };
  }

  onExternalIdentifierChanged = (identifier) => {
    const { form, fieldPath } = this.props;

    const pid = {
      identifier: identifier,
      provider: PROVIDER_EXTERNAL,
    };

    this.debounced && this.debounced.cancel();
    this.debounced = _debounce(() => {
      form.setFieldValue(fieldPath, pid);
    }, UPDATE_PID_DEBOUNCE_MS);
    this.debounced();
  };

  render() {
    const { isManagedSelected, selectedRadio } = this.state;
    const {
      btnLabelDiscardPID,
      btnLabelGetPID,
      canBeManaged,
      canBeUnmanaged,
      form,
      fieldPath,
      fieldLabel,
      isEditingPublishedRecord,
      managedHelpText,
      pidLabel,
      pidIcon,
      pidPlaceholder,
      required,
      unmanagedHelpText,
      pidType,
      field,
    } = this.props;

    const value = field.value || {};
    const currentIdentifier = value.identifier || '';
    const currentProvider = value.provider || '';

    let managedIdentifier = '',
      unmanagedIdentifier = '';
    if (currentIdentifier !== '') {
      const isProviderExternal = currentProvider === PROVIDER_EXTERNAL;
      managedIdentifier = !isProviderExternal ? currentIdentifier : '';
      unmanagedIdentifier = isProviderExternal ? currentIdentifier : '';
    }

    const hasManagedIdentifier = managedIdentifier !== '';

    const _isManagedSelected =
      isManagedSelected === undefined
        ? hasManagedIdentifier || currentProvider === '' // i.e pids: {}
        : isManagedSelected;

    const fieldError = getFieldErrors(form, fieldPath);
    return (
      <>
        <Form.Field required={required} error={fieldError}>
          <FieldLabel htmlFor={fieldPath} icon={pidIcon} label={fieldLabel} />


        {this.canBeManagedAndUnmanaged && (
          <ManagedUnmanagedSwitch
            disabled={isEditingPublishedRecord || hasManagedIdentifier}
            isManagedSelected={_isManagedSelected}
            onManagedUnmanagedChange={(userSelectedManaged, selectedRadio) => {
              if (userSelectedManaged) {
                form.setFieldValue('pids', {});
              } else {
                this.onExternalIdentifierChanged('');
              }
              this.setState({
                isManagedSelected: userSelectedManaged,
                selectedRadio
              });
            }}
            pidLabel={pidLabel}
            hasManagedIdentifier={hasManagedIdentifier}
          />
        )}

        {(selectedRadio == 'need' || hasManagedIdentifier) && canBeManaged && _isManagedSelected && (
          <ManagedIdentifierCmp
            disabled={isEditingPublishedRecord}
            btnLabelDiscardPID={btnLabelDiscardPID}
            btnLabelGetPID={btnLabelGetPID}
            form={form}
            identifier={managedIdentifier}
            helpText={managedHelpText}
            pidPlaceholder={pidPlaceholder}
            pidType={pidType}
            pidLabel={pidLabel}
          />
        )}

        {canBeUnmanaged && !_isManagedSelected && (
          <UnmanagedIdentifierCmp
            identifier={unmanagedIdentifier}
            onIdentifierChanged={(identifier) => {
              this.onExternalIdentifierChanged(identifier);
            }}
            form={form}
            fieldPath={fieldPath}
            pidPlaceholder={pidPlaceholder}
            helpText={unmanagedHelpText}
          />
        )}
          </Form.Field>
      </>
    );
  }
}

CustomPIDField.propTypes = {
  btnLabelDiscardPID: PropTypes.string.isRequired,
  btnLabelGetPID: PropTypes.string.isRequired,
  canBeManaged: PropTypes.bool.isRequired,
  canBeUnmanaged: PropTypes.bool.isRequired,
  fieldPath: PropTypes.string.isRequired,
  fieldLabel: PropTypes.string.isRequired,
  isEditingPublishedRecord: PropTypes.bool.isRequired,
  managedHelpText: PropTypes.string,
  pidIcon: PropTypes.string.isRequired,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string.isRequired,
  pidType: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  unmanagedHelpText: PropTypes.string,
};

CustomPIDField.defaultProps = {
  managedHelpText: null,
  unmanagedHelpText: null,
};

/**
 * Render the PIDField using a custom Formik component
 */
export class PIDField extends Component {
  constructor(props) {
    super(props);

    this.validatePropValues();

    this.state = {
      isManagedSelected: false,
    };
  }

  validatePropValues = () => {
    const { canBeManaged, canBeUnmanaged, fieldPath } = this.props;

    if (!canBeManaged && !canBeUnmanaged) {
      throw Error(`${fieldPath} must be managed, unmanaged or both.`);
    }
  };

  render() {
    const { fieldPath } = this.props;

    return (
      <FastField name={fieldPath} component={CustomPIDField} {...this.props} />
    );
  }
}

PIDField.propTypes = {
  btnLabelDiscardPID: PropTypes.string,
  btnLabelGetPID: PropTypes.string,
  canBeManaged: PropTypes.bool,
  canBeUnmanaged: PropTypes.bool,
  fieldPath: PropTypes.string.isRequired,
  fieldLabel: PropTypes.string.isRequired,
  isEditingPublishedRecord: PropTypes.bool.isRequired,
  managedHelpText: PropTypes.string,
  pidIcon: PropTypes.string,
  pidLabel: PropTypes.string.isRequired,
  pidPlaceholder: PropTypes.string,
  pidType: PropTypes.string.isRequired,
  required: PropTypes.bool,
  unmanagedHelpText: PropTypes.string,
};

PIDField.defaultProps = {
  btnLabelDiscardPID: 'Discard',
  btnLabelGetPID: 'Reserve',
  canBeManaged: true,
  canBeUnmanaged: true,
  managedHelpText: null,
  pidIcon: 'barcode',
  pidPlaceholder: '',
  required: false,
  unmanagedHelpText: null,
};

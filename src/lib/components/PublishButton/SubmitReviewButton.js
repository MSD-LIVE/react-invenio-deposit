// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020-2022 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React, { Component } from 'react';
import { i18next } from "@translations/invenio_app_rdm/i18next";
import _get from 'lodash/get';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { connect as connectFormik } from 'formik';
import {
  DepositFormSubmitActions,
  DepositFormSubmitContext,
} from '../../DepositFormSubmitContext';
import { SubmitReviewModal } from './SubmitReviewModal';
import { DepositStatus } from '../../state/reducers/deposit';
import _omit from 'lodash/omit';

class SubmitReviewButtonComponent extends Component {
  static contextType = DepositFormSubmitContext;
  state = { isConfirmModalOpen: false };

  openConfirmModal = () => this.setState({ isConfirmModalOpen: true });

  closeConfirmModal = () => this.setState({ isConfirmModalOpen: false });

  handleSubmitReview = ({ reviewComment }) => {
    const { formik } = this.props;
    const { handleSubmit } = formik;

    this.context.setSubmitContext(DepositFormSubmitActions.SUBMIT_REVIEW, {
      reviewComment,
    });
    handleSubmit();
    this.closeConfirmModal();
  };

  isDisabled = (numberOfFiles, disableSubmitForReviewButton) => {
    const { formik } = this.props;
    const { values, isSubmitting } = formik;

    const filesEnabled = _get(values, 'files.enabled', false);
    const filesMissing = filesEnabled && !numberOfFiles;
    return isSubmitting || filesMissing || disableSubmitForReviewButton;
  };

  render() {
    const {
      actionState,
      actionStateExtra,
      community,
      numberOfFiles,
      disableSubmitForReviewButton,
      isRecordSubmittedForReview,
      formik,
      ...ui
    } = this.props;

    const { isSubmitting } = formik;

    const uiProps = _omit(ui, ['dispatch']);

    const { isConfirmModalOpen } = this.state;

    return (
      <>
        <Button
          disabled={this.isDisabled(
            numberOfFiles,
            disableSubmitForReviewButton
          )}
          name="SubmitReview"
          onClick={this.openConfirmModal}
          positive
          icon="upload"
          loading={
            isSubmitting && actionState === 'DRAFT_SUBMIT_REVIEW_STARTED'
          }
          labelPosition="left"
          content={
            isRecordSubmittedForReview
              ? i18next.t('Submitted for review')
              : i18next.t('Submit for review')
          }
          {...uiProps}
        />
        {isConfirmModalOpen && (
          <SubmitReviewModal
            isConfirmModalOpen={isConfirmModalOpen}
            initialReviewComment={actionStateExtra.reviewComment}
            onSubmit={this.handleSubmitReview}
            community={community}
            onClose={this.closeConfirmModal}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  actionState: state.deposit.actionState,
  actionStateExtra: state.deposit.actionStateExtra,
  community: state.deposit.editorState.selectedCommunity,
  isRecordSubmittedForReview:
    state.deposit.record.status === DepositStatus.IN_REVIEW,
  disableSubmitForReviewButton:
    state.deposit.editorState.ui.disableSubmitForReviewButton,
  numberOfFiles: Object.values(state.files.entries).length,
});

export const SubmitReviewButton = connect(
  mapStateToProps,
  null
)(connectFormik(SubmitReviewButtonComponent));

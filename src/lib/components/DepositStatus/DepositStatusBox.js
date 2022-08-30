// MSD-LIVE CHANGE - wording from community to project:
// react-invenio-deposit\src\lib\components\DepositStatus\DepositStatusBox.js

// This file is part of React-Invenio-Deposit
// Copyright (C) 2022 CERN.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

// MSD-LIVE CHANGE changing how i18next gets imported
// import { i18next } from '@translations/i18next';
import { i18next } from "@translations/invenio_app_rdm/i18next";
import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Icon, Popup } from 'semantic-ui-react';
import { DepositStatus } from '../../state/reducers/deposit';


const STATUSES = {
  [DepositStatus.IN_REVIEW]: {
    color: 'warning',
    title: i18next.t('In review'),
    message: i18next.t(
      'Project curators will review your upload. Once accepted, it will be published.'
    ),
  },
  //MSD-LIVE CHANGE let declined render same status as draft as we add our own red warning message
  [DepositStatus.DECLINED]: {
    color: 'light grey',
    title: i18next.t('Draft'),
    message: i18next.t(
      'Once your upload is complete, you can publish or submit it for review to the project curators.'
    ),
  },
  // [DepositStatus.DECLINED]: {
  //   color: 'negative',
  //   title: i18next.t('Declined'),
  //   message: i18next.t(
  //     'The request to submit this upload to the project was declined.'
  //   ),
  // },
  [DepositStatus.EXPIRED]: {
    color: 'expired',
    title: i18next.t('Expired'),
    message: i18next.t(
      'The request to submit this upload to the project has expired.'
    ),
  },
  [DepositStatus.PUBLISHED]: {
    color: 'positive',
    title: i18next.t('Published'),
    message: i18next.t('Your upload is published.'),
  },
  [DepositStatus.DRAFT_WITH_REVIEW]: {
    color: 'neutral',
    title: i18next.t('Draft'),
    message: i18next.t(
      'Once your upload is complete, you can submit it for review to the project curators.'
    ),
  },
  [DepositStatus.DRAFT]: {
    color: 'neutral',
    title: i18next.t('Draft'),
    message: i18next.t(
      'Once your upload is complete, you can publish or submit it for review to the project curators.'
    ),
  },
  [DepositStatus.NEW_VERSION_DRAFT]: {
    color: 'neutral',
    title: i18next.t('New version draft'),
    message: i18next.t('Once your upload is complete, you can publish it.'),
  },
};

const DepositStatusBoxComponent = ({ depositReview, depositStatus }) => {
  const status = STATUSES[depositStatus];
  if (!status) {
    throw new Error('Status is undefined');
  }
  const isReviewStatus = depositStatus === DepositStatus.IN_REVIEW;

  return (
    <Grid verticalAlign="middle">
      <Grid.Row centered className={`pt-5 pb-5 ${status.color}`}>
        <Grid.Column
          width={isReviewStatus ? 8 : 16}
          textAlign={isReviewStatus ? 'left' : 'center'}
        >
          <span>{status.title}</span>
          <Popup
            trigger={<Icon className="ml-10" name="info circle" />}
            content={status.message}
          />
        </Grid.Column>
        {isReviewStatus && (
          <Grid.Column width={8} textAlign="right">
            <Button
              href={`/me/requests/${depositReview.id}`}
              target="_blank"
              icon="external alternate"
              content={i18next.t('View request')}
              size="mini"
              className="transparent"
              title={i18next.t('Opens in new tab')}
            />
          </Grid.Column>
        )}
      </Grid.Row>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  depositStatus: state.deposit.record.status,
  depositReview:
    state.deposit.record.status !== DepositStatus.DRAFT &&
    state.deposit.record.parent.review,
});

export const DepositStatusBox = connect(
  mapStateToProps,
  null
)(DepositStatusBoxComponent);

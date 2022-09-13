import _isEmpty from 'lodash/isEmpty';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TextAreaField } from 'react-invenio-forms';
import { Divider, Icon, List } from 'semantic-ui-react';
import {
  EmbargoCheckboxField
} from './EmbargoCheckboxField';
import { EmbargoDateField } from './EmbargoDateField';
import { i18next } from "@translations/invenio_app_rdm/i18next";
import { Trans } from "../../../lib/i18next";

export const EmbargoAccess = ({access, accessCommunity, metadataOnly}) => {

  const recordPublic = access.record === 'public';
  const filesPublic = access.files === 'public';
  const communityPublic = accessCommunity === 'public';

  const filesRestricted = !metadataOnly && !filesPublic;

  const embargoActive = access.embargo?.active || false;
  const embargoUntil = access.embargo?.until;
  const embargoReason = access.embargo?.reason;
  const embargoWasLifted = !embargoActive && !_isEmpty(embargoUntil);
  const embargoEnabled = communityPublic && (!recordPublic || filesRestricted);

  const fmtDate = embargoUntil ?
    DateTime.fromISO(embargoUntil).toLocaleString(DateTime.DATE_FULL) : '???';

  return (
    <List>
      <List.Item
        disabled={!embargoEnabled}
        data-testid="option-list-embargo"
      >
        <List.Icon>
          <EmbargoCheckboxField
            fieldPath="access.embargo.active"
            checked={embargoActive}
            disabled={!embargoEnabled}
          />
        </List.Icon>
        <List.Content>
          <List.Header>
            <label
              htmlFor='access.embargo.active'
            >
              {i18next.t('Apply an embargo')} <Icon name="clock outline" />
            </label>
          </List.Header>
          <List.Description>
            <Trans>
              Record or files protection must be <b>restricted</b> to apply an
              embargo.
            </Trans>
          </List.Description>
          {embargoActive && (
            <>
              <Divider hidden />
              <EmbargoDateField fieldPath="access.embargo.until" required />
              <TextAreaField
                label={i18next.t('Embargo reason')}
                fieldPath={'access.embargo.reason'}
                placeholder={i18next.t(
                  'Optionally, describe the reason for the embargo.'
                )}
                optimized="true"
              />
            </>
          )}
          {embargoWasLifted && (
            <>
              <Divider hidden />
              <p>
                {i18next.t(`Embargo was lifted on {{fmtDate}}.`, {
                  fmtDate: fmtDate,
                })}
              </p>
              {embargoReason && (
                <p>
                  <b>{i18next.t('Reason')}</b>:{' '}
                  {embargoReason}.
                </p>
              )}
            </>
          )}
        </List.Content>
      </List.Item>
    </List>
  );
}

EmbargoAccess.propTypes = {
  access: PropTypes.object.isRequired,
  metadataOnly: PropTypes.bool,
  accessCommunity: PropTypes.string.isRequired
}

EmbargoAccess.defaultProps = {
  metadataOnly: false,
}

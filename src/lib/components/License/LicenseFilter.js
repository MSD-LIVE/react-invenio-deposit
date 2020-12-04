// This file is part of React-Invenio-Deposit
// Copyright (C) 2020 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import React from 'react';
import PropTypes from 'prop-types';
import { Menu } from 'semantic-ui-react';

export const LicenseFilter = ({
  updateQueryFilters,
  userSelectionFilters,
  filterValue,
  label,
  title,
}) => {
  const _isChecked = (userSelectionFilters) => {
    const isFilterActive =
      userSelectionFilters.filter((filter) => filter[0] === filterValue[0])
        .length > 0;
    return isFilterActive;
  };

  const onToggleClicked = () => {
    updateQueryFilters(userSelectionFilters.concat([filterValue]));
  };
  var isChecked = _isChecked(userSelectionFilters);
  return (
    <Menu.Item name={label} active={isChecked} onClick={onToggleClicked}>
      {title}
    </Menu.Item>
  );
};

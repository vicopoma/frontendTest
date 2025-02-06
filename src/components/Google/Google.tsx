import React from 'react';
import { Redirect, useLocation } from 'react-router';

import { TOKEN } from '../../constants/constants';

export default () => {
  const location = useLocation();
  const token = location.search.replace('?token=', '');
  localStorage.setItem(TOKEN, token);
  return <Redirect to="/"/>;
}
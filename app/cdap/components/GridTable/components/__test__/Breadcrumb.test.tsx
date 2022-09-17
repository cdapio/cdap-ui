import { render } from '@testing-library/react';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import BreadCrumb from '../Breadcrumb';
import { createBrowserHistory as createHistory } from 'history';

const history = createHistory({
  basename: '/cdap',
});

describe('Test Breadcrumb Component', () => {
  const { getByTestId } = render(
    <Router history={history}>
      <Switch>
        <Route>
          <BreadCrumb datasetName="abc" />
        </Route>
      </Switch>
    </Router>
  );

  it('Should have the Home text in the Breadcrumb', () => {
    expect(getByTestId('breadcrumb-home-text')).toHaveTextContent('Home');
  });
});

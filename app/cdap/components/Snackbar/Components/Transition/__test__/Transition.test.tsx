import React from 'react';
import { render } from '@testing-library/react';
import Transition from 'components/Snackbar/Components/Transition/index';
import { Router, Switch, Route } from 'react-router';
import history from 'app/cdap/services/history';

describe('Test Transition Component', () => {
  it('Should have rendered the component correctly with isSuccess as false', () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <Transition
              handleClose={() => jest.fn()}
              isSuccess={false}
              actionType={''}
              messageToDisplay={''}
            />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });

  it('Should have rendered the component correctly with action type as add', () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <Transition
              handleClose={() => jest.fn()}
              isSuccess={true}
              actionType={'add'}
              messageToDisplay={''}
            />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });
});

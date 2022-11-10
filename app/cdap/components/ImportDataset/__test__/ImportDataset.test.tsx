/*
 *  Copyright © 2022 Cask Data, Inc.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy of
 *  the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations under
 *  the License.
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Route, Router, Switch } from 'react-router';
import DastaSet from 'components/ImportDataset/index';
import history from 'services/history';
import UploadFile from 'services/upload-file';
import namespace from 'api/__mocks__/namespace';
describe('It should test DrawerWidget Component', () => {
  it('Should test whether DrawerWidget Component is rendered', () => {
    const container = render(
      <Router history={history}>
        <Switch>
          <Route>
            <DastaSet
              handleClosePanel={() => {
                jest.fn();
              }}
            />
          </Route>
        </Switch>
      </Router>
    );
    expect(container).toBeDefined();
  });
  it('Should drop a file and trigger onDropHandler', async () => {
    render(<DastaSet handleClosePanel={jest.fn()} />);
    window.URL.createObjectURL = jest.fn().mockImplementation(() => 'url');
    const inputEl = screen.getByTestId('file-drop-zone');
    const file = new File(['file'], 'ping.json', {
      type: 'application/json/text/xml',
    });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
    expect(await screen.findByText('ping.json')).toBeInTheDocument();

    const uploadBtn = screen.getByTestId('upload-button');
    fireEvent.click(uploadBtn);
  });

  test('The observable to Upload a file', (done) => {
    const file = new File(['file'], 'ping.json', {
      type: 'application/json/text/xml',
    });

    const url = `/namespaces/system/apps/dataprep/services/service/methods/v2/contexts/${namespace}/workspaces/upload`;

    const fileName = file.name;
    const headers: Record<string, string> = {
      'Content-Type': 'application/data-prep',
      'X-Archive-Name': fileName,
      file: fileName,
    };
    UploadFile({ url, fileContents: file, headers }).subscribe((data) => {
      expect(data).toBe('');
      done();
    });
  });

  test('trigger closeClickHandler()', () => {
    render(<DastaSet handleClosePanel={jest.fn()} />);
    const closeBtn = screen.getByTestId('drawer-widget-close-round-icon');
    fireEvent.click(closeBtn);
  });

  test('When the size of the file uploaded is > 10MB', () => {
    render(<DastaSet handleClosePanel={jest.fn()} />);
    const inputEl = screen.getByTestId('file-drop-zone');
    const file = new File(['file'], 'ping.json', {
      type: 'application/json/text/xml',
    });
    Object.defineProperty(file, 'size', { value: 10249 * 1024 + 1 });
    Object.defineProperty(inputEl, 'files', {
      value: [file],
    });
    fireEvent.drop(inputEl);
  });
});

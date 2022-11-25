/*
 * Copyright © 2022 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import SendToError from 'components/WranglerGrid/TransformationComponents/SendToError';
describe('It Should test SendToError Component.', () => {
  it('should test whether SendToError component is rendered and in the Document.', () => {
    render(
      <SendToError
        setTransformationComponentsValue={jest.fn()}
        transformationComponentValues={{
          customInput: '',
          ignoreCase: false,
          filterOptionSelected: 'EMPTY',
          filterOptionValue: '',
          filterRadioOption: 'KEEP',
        }}
      />
    );

    const sendToErrorWrapper = screen.getByTestId(/send-to-error-wrapper/i);
    expect(sendToErrorWrapper).toBeInTheDocument();
  });
});

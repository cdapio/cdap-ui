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
import MarkSelection from 'components/WranglerGrid/TransformationComponents/MaskSelection/index';
import T from 'i18n-react';

describe('Testing nested menu component', () => {
  const PREFIX = 'features.WranglerNewUI.GridPage.transformationUI.mask';

  beforeEach(() => {
    render(
      <MarkSelection
        anchorEl={null}
        setAnchorEl={() => jest.fn()}
        textSelectionRange={{ start: null, end: null }}
        columnSelected={'Body_test'}
        applyTransformation={jest.fn()}
        open={true}
        handleClose={jest.fn()}
        rowNumber={1}
      />
    );
  });

  it('should test head font text as expected', () => {
    const headFontElement = screen.getByTestId(/mask-selection-head-font/i);
    expect(headFontElement).toHaveTextContent(`${T.translate(`${PREFIX}.maskHead`)}`);
  });

  it('should test sub title text as expected', () => {
    const subTitleElement = screen.getByTestId(/mask-selection-sub-title/i);
    expect(subTitleElement).toHaveTextContent(`${T.translate(`${PREFIX}.maskAcrossRow`)}`);
  });

  it('should trigger applyMaskTransformation', () => {
    const applyButtonWidget = screen.getByTestId(/apply-mask-button/i);
    expect(applyButtonWidget).toHaveTextContent(`${T.translate(`${PREFIX}.applyMask`)}`);
    fireEvent.click(applyButtonWidget);
    expect(applyButtonWidget).toBeInTheDocument();
  });

  it('should render component when open is false', () => {
    render(
      <MarkSelection
        anchorEl={null}
        setAnchorEl={() => jest.fn()}
        textSelectionRange={{ start: 0, end: 10 }}
        columnSelected={'Body_test'}
        applyTransformation={jest.fn()}
        open={false}
        handleClose={jest.fn()}
        rowNumber={1}
      />
    );

    const parentElement = screen.getByTestId(/mask-selection-parent/i);
    expect(parentElement).toBeInTheDocument();
  });
});

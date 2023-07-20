/*
 * Copyright © 2023 Cask Data, Inc.
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
import { fireEvent, render, screen, within } from '@testing-library/react';
import T from 'i18n-react';
import { DecimalOptions } from 'components/DataPrep/Directives/ChangeDataType/DecimalOptions';

const PREFIX = 'features.DataPrep.Directives.ChangeDataType.decimalConfig';
const ROUNDING_OPTIONS = [
  'CEILING',
  'DOWN',
  'FLOOR',
  'HALF_DOWN',
  'HALF_EVEN',
  'HALF_UP',
  'UNNECESSARY',
  'UP',
];

describe('DecimalOptions component', () => {
  const SCALE_LABEL = T.translate(`${PREFIX}.scaleLabel`).toString();
  const ROUNDING_LABEL = T.translate(`${PREFIX}.roundingLabel`).toString();
  const FLOOR = T.translate(`${PREFIX}.roundingOptions.FLOOR.label`).toString();
  const APPLY = T.translate(`${PREFIX}.applyButton`).toString();

  let submenu;
  let onApply;
  let onCancel;

  beforeEach(() => {
    onApply = jest.fn((option: string, extraArgs?: string): void => {
      return;
    });
    onCancel = jest.fn((event: React.MouseEvent<HTMLElement>): void => {
      return;
    });
    submenu = render(<DecimalOptions onApply={onApply} onCancel={onCancel} />);
  });

  it('should render a number input for scale and a select dropdown for rounding mode', () => {
    const scaleInput = submenu.getByLabelText(SCALE_LABEL);
    const roundingInput = submenu.getByLabelText(ROUNDING_LABEL);

    expect(scaleInput).toBeVisible();
    expect(scaleInput).toBeEnabled();
    expect(scaleInput).toHaveAttribute('type', 'number');

    // Rounding mode select dropdown should be disabled initially as no scale
    // has been specified yet.
    expect(roundingInput).toBeVisible();
    expect(roundingInput).toHaveClass('Mui-disabled');
  });

  it('should enable the rounding mode input only when scale is specified', () => {
    const scaleInput = submenu.getByLabelText(SCALE_LABEL);
    const roundingInput = submenu.getByLabelText(ROUNDING_LABEL);

    expect(roundingInput).toHaveClass('Mui-disabled');
    fireEvent.change(scaleInput, { target: { value: '4' } });
    expect(roundingInput).not.toHaveClass('Mui-disabled');

    fireEvent.mouseDown(roundingInput);
    const listbox = within(screen.getByRole('presentation')).getByRole('listbox');
    const options = within(listbox).getAllByRole('option');
    const optionValues = options.map((li) => li.getAttribute('data-value'));

    // The roundig modes select menu should have the 8 rounding modes
    // in any order
    expect(optionValues).toHaveLength(8);
    ROUNDING_OPTIONS.forEach((opt) => expect(optionValues).toContain(opt));

    fireEvent.change(scaleInput, { target: { value: '' } });
    expect(roundingInput).toHaveClass('Mui-disabled');
  });

  it('should pass correct args to the directive on apply', () => {
    const scaleInput = submenu.getByLabelText(SCALE_LABEL);
    const roundingInput = submenu.getByLabelText(ROUNDING_LABEL);

    fireEvent.change(scaleInput, { target: { value: '4' } });
    fireEvent.mouseDown(roundingInput);
    fireEvent.click(submenu.getByText(FLOOR));
    fireEvent.click(submenu.getByText(APPLY));

    expect(onApply.mock.calls).toHaveLength(1);
    expect(onApply.mock.calls[0]).toHaveLength(2);
    expect(onApply.mock.calls[0][0]).toBe('decimal');
    expect(onApply.mock.calls[0][1]).toBe("4 'FLOOR'");
  });

  it('should default rouding mode to HALF_EVEN if scale is specified and rounding mode is not specified', () => {
    const scaleInput = submenu.getByLabelText(SCALE_LABEL);
    fireEvent.change(scaleInput, { target: { value: '2' } });
    fireEvent.click(submenu.getByText(APPLY));

    expect(onApply.mock.calls).toHaveLength(1);
    expect(onApply.mock.calls[0]).toHaveLength(2);
    expect(onApply.mock.calls[0][0]).toBe('decimal');
    expect(onApply.mock.calls[0][1]).toBe("2 'HALF_EVEN'");
  });

  it('should not add any extra args if scale is not specified', () => {
    fireEvent.click(submenu.getByText(APPLY));
    expect(onApply.mock.calls).toHaveLength(1);
    expect(onApply.mock.calls[0]).toHaveLength(2);
    expect(onApply.mock.calls[0][0]).toBe('decimal');
    expect(onApply.mock.calls[0][1]).toBe('');
  });
});

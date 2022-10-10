/*
 * Copyright © 2018 Cask Data, Inc.
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

import * as React from 'react';
import { objectQuery } from 'services/helpers';
import Alert from 'components/shared/Alert';

interface IErrorProps {
  error: object | string | null;
  onClose?: () => void;
  canEditPageWhileOpen?: boolean;
  actionElements?: Element;
}

const ErrorBanner = ({ error, onClose, canEditPageWhileOpen, actionElements }: IErrorProps) => {
  if (!error) {
    return null;
  }

  const errorMessage: string =
    objectQuery(error, 'response', 'message') || objectQuery(error, 'response') || error;

  return (
    <Alert
      message={errorMessage}
      type="error"
      showAlert={true}
      onClose={onClose}
      actionElements={actionElements}
      canEditPageWhileOpen={canEditPageWhileOpen}
    />
  );
};

export default ErrorBanner;

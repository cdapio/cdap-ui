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

import SelectWidget from 'components/AbstractWidget/SelectWidget';
import NumberTextbox from 'components/AbstractWidget/NumberTextbox';
import MemoryTextbox from 'components/AbstractWidget/MemoryTextbox';
import MemorySelectWidget from 'components/AbstractWidget/MemorySelectWidget';
import DefaultInput from 'components/AbstractWidget/DefaultInput';
import TextArea from 'components/AbstractWidget/TextArea';
import SecureKeyTextarea from 'components/AbstractWidget/SecureKeyTextarea';

const WIDGET_FACTORY = {
  text: DefaultInput,
  textbox: DefaultInput,
  textarea: TextArea,
  number: NumberTextbox,
  select: SelectWidget,
  'memory-dropdown': MemorySelectWidget,
  'memory-textbox': MemoryTextbox,
  'securekey-textarea': SecureKeyTextarea,
};
export default new Proxy(WIDGET_FACTORY, {
  get: function(obj, prop) {
    return prop in obj ? obj[prop] : DefaultInput;
  },
});

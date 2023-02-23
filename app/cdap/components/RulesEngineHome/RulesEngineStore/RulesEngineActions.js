/*
 * Copyright © 2017 Cask Data, Inc.
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

import RulesEngineStore, {
  RULESENGINEACTIONS,
} from 'components/RulesEngineHome/RulesEngineStore';
import NamespaceStore from 'services/NamespaceStore';
import MyRulesEngineApi from 'api/rulesengine';
import isNil from 'lodash/isNil';

const getRuleBooks = () => {
  const { selectedNamespace: namespace } = NamespaceStore.getState();
  MyRulesEngineApi.getRulebooks({
    namespace,
  }).subscribe((res) => {
    const { rulebooks } = RulesEngineStore.getState();
    RulesEngineStore.dispatch({
      type: RULESENGINEACTIONS.SETRULEBOOKS,
      payload: {
        rulebooks: res.values,
      },
    });
    if (rulebooks.activeRulebookId) {
      setActiveRulebook(rulebooks.activeRulebookId);
    } else if (res.values.length) {
      setActiveRulebook(res.values[0].id);
    }
  });
};

const setActiveRulebook = (id) => {
  RulesEngineStore.dispatch({
    type: RULESENGINEACTIONS.SETACTIVERULEBOOK,
    payload: {
      activeRulebook: id,
    },
  });
  if (!isNil(id)) {
    getRulesForActiveRuleBook();
  }
};

const getRulesForActiveRuleBook = () => {
  const { selectedNamespace: namespace } = NamespaceStore.getState();
  const { rulebooks } = RulesEngineStore.getState();
  MyRulesEngineApi.getRulesForRuleBook({
    namespace,
    rulebookid: rulebooks.activeRulebookId,
  }).subscribe((res) => {
    RulesEngineStore.dispatch({
      type: RULESENGINEACTIONS.SETRULESFORACTIVERULEBOOK,
      payload: {
        rules: res.values,
      },
    });
  });
};

const getRules = () => {
  const { selectedNamespace: namespace } = NamespaceStore.getState();
  MyRulesEngineApi.getRules({
    namespace,
  }).subscribe((res) => {
    RulesEngineStore.dispatch({
      type: RULESENGINEACTIONS.SETRULES,
      payload: {
        rules: res.values,
      },
    });
  });
};

const createNewRuleBook = (config) => {
  const { selectedNamespace: namespace } = NamespaceStore.getState();
  const urlParams = { namespace };
  const headers = { 'Content-Type': 'application/json' };
  const postBody = {
    ...config,
    user: 'Admin',
    source: 'Website',
  };

  MyRulesEngineApi.createRulebook(urlParams, postBody, headers).subscribe(
    (res) => {
      resetCreateRuleBook();
      setActiveRulebook(res.values[0]);
      getRuleBooks();
      setActiveTab('2'); // 2 being the index of the Rules tab
    }
  );
};

const setActiveTab = (activeTab) => {
  RulesEngineStore.dispatch({
    type: RULESENGINEACTIONS.SETACTIVETAB,
    payload: {
      activeTab,
    },
  });
};

const resetCreateRuleBook = () => {
  RulesEngineStore.dispatch({
    type: RULESENGINEACTIONS.SETCREATERULEBOOK,
    payload: {
      isCreate: false,
    },
  });
};

const resetError = () => {
  RulesEngineStore.dispatch({
    type: RULESENGINEACTIONS.RESETERROR,
  });
};

const resetStore = () => {
  RulesEngineStore.dispatch({
    type: RULESENGINEACTIONS.RESET,
  });
};

const setError = (err) => {
  RulesEngineStore.dispatch({
    type: RULESENGINEACTIONS.SETERROR,
    payload: {
      error: {
        showError: true,
        message: typeof err === 'string' ? err : err.response.message,
      },
    },
  });
};

export {
  getRuleBooks,
  getRules,
  getRulesForActiveRuleBook,
  setActiveRulebook,
  createNewRuleBook,
  resetError,
  resetCreateRuleBook,
  setError,
  resetStore,
};

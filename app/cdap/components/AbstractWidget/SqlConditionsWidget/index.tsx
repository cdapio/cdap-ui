/*
 * Copyright © 2019 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import withStyles, { StyleRules, WithStyles } from '@material-ui/core/styles/withStyles';

import { IErrorObj } from 'components/shared/ConfigurationGroup/utilities';
import { IWidgetProps } from 'components/AbstractWidget';
import React from 'react';
import Rule from 'components/AbstractWidget/SqlConditionsWidget/Rule';
import ThemeWrapper from 'components/ThemeWrapper';
import { WIDGET_PROPTYPES } from 'components/AbstractWidget/constants';
import classnames from 'classnames';
import { objectQuery } from 'services/helpers';

export const styles = (): StyleRules => {
  return {
    root: {
      width: '100%',
    },
    emptyMessage: {
      marginBottom: 0,
    },
    textDanger: { whiteSpace: 'pre-line' },
    rulesContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
    },
  };
};

export interface IStage {
  fieldName: string;
  stageName: string;
}

export type IRule = IStage[];

type IRules = IRule[];

export interface IInputSchema {
  [key: string]: string[];
}

interface ISqlConditionsProps extends IWidgetProps<null>, WithStyles<typeof styles> {}

interface ISqlConditionsWidgetState {
  warning?: string;
  error?: string;
  stageList: string[];
  rules: IRules;
  mapInputSchema: IInputSchema;
}

class SqlConditionsWidgetView extends React.Component<
  ISqlConditionsProps,
  ISqlConditionsWidgetState
> {
  public state: ISqlConditionsWidgetState = {
    warning: undefined,
    error: undefined,
    stageList: [],
    rules: [],
    mapInputSchema: {},
  };

  public componentDidMount() {
    this.init();
  }

  private checkRulesForValidStageNames = () => {
    const invalidRule = /[&\.=]/g;
    // Since all rules have same stages we can just check one rule for invalid stage names;
    const stageNames = this.state.rules[0].map((stage) => stage.stageName);
    const invalidStageNames = stageNames.filter((stageName) => invalidRule.test(stageName));
    if (invalidStageNames.length) {
      const error = `Invalid name for input ${
        invalidStageNames.length > 1 ? 'nodes' : 'node'
      }: ${invalidStageNames
        .map((sn) => JSON.stringify(sn))
        .join(', ')}. \n Node names cannot contain "&" "=" "."`;
      this.setState({
        error,
      });
    }
  };

  private formatOutput = () => {
    this.checkRulesForValidStageNames();
    if (this.state.stageList.length < 2) {
      if (typeof this.props.onChange === 'function') {
        this.props.onChange('');
      }
      return;
    }
    const outputArr: any[] = [];
    this.state.rules.forEach((rule) => {
      const ruleCheck = rule.filter((field) => {
        return !field.fieldName;
      });
      if (ruleCheck.length > 0) {
        return;
      }
      outputArr.push(this.formatRule(rule));
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(outputArr.join(' & '));
    }
  };

  private formatRule(rule: IRule) {
    return rule.map((field) => `${field.stageName}.${field.fieldName}`).join(' = ');
  }

  private addRule = () => {
    if (this.state.stageList.length === 0) {
      return;
    }
    const rules: any[] = [];
    this.state.stageList.forEach((stage) => {
      rules.push({
        stageName: stage,
        fieldName: this.state.mapInputSchema[stage][0],
      });
    });
    this.setState({ rules: [...this.state.rules, rules] }, this.formatOutput);
  };

  private deleteRule = (index: number) => {
    const rulesCopy = [...this.state.rules];
    rulesCopy.splice(index, 1);
    this.setState({ rules: rulesCopy }, this.formatOutput);
  };

  private updateRule = (changedRule: IRule, ruleIdx: number) => {
    const rules = this.state.rules.map((rule, i) => {
      if (i === ruleIdx) {
        return changedRule;
      }
      return rule;
    });
    this.setState({ rules }, this.formatOutput);
  };

  private initializeOptions = () => {
    const stageList: any[] = [];
    const mapInputSchema = {};
    let error: string | undefined;
    const inputSchema = objectQuery(this.props, 'extraConfig', 'inputSchema') || [];

    inputSchema.forEach((input) => {
      stageList.push(input.name);
      try {
        mapInputSchema[input.name] = JSON.parse(input.schema).fields.map((field) => field.name);
      } catch (e) {
        mapInputSchema[input.name] = [];
        error = 'Error parsing input schemas.';
      }
    });
    if (stageList.length < 2) {
      error = 'Please connect 2 or more stages.';
    }
    return { error, stageList, mapInputSchema };
  };

  private init = () => {
    const { error, stageList, mapInputSchema } = this.initializeOptions();
    let warning: any = null;
    let rules: any[] = [];
    if (!this.props.value) {
      this.setState({ error, stageList, mapInputSchema }, this.addRule);
      return;
    }
    const modelSplit = this.props.value
      .toString()
      .split('&')
      .map((rule) => rule.trim());
    modelSplit.forEach((rule) => {
      const rulesArr: any[] = [];
      rule.split('=').forEach((field) => {
        const splitField = field.trim().split('.');
        // Not including rule if stage has been disconnected
        if (stageList.indexOf(splitField[0]) === -1) {
          return;
        }
        rulesArr.push({
          stageName: splitField[0],
          fieldName: splitField[1],
        });
      });
      // Missed fields scenario will happen if the user connects more stages into the join node
      // after they have configured join conditions previously
      const missedFields = stageList.filter((stage) => {
        const filteredRule = rulesArr.filter((field) => {
          return field.stageName === stage;
        });
        return filteredRule.length === 0 ? true : false;
      });
      if (missedFields.length > 0) {
        missedFields.forEach((field) => {
          rulesArr.push({
            stageName: field,
            fieldName: mapInputSchema[field][0],
          });
        });
        warning =
          "Input stages have changed since the last time you edit this node's configuration. Please verify the condition is still valid.";
      }
      rules = [...rules, rulesArr];
    });
    this.setState({ error, warning, rules, stageList, mapInputSchema }, () => {
      // There is timing issue with setting default value
      setTimeout(this.formatOutput, 100);
    });
  };

  public render() {
    const { classes, disabled, errors } = this.props;
    return (
      <div className={classes.root}>
        {this.state.error && this.state.stageList.length > 0 && (
          <div className={classnames(classes.textDanger, 'text-danger')}>{this.state.error}</div>
        )}
        {this.state.warning && !this.state.error && (
          <div className="text-warning">{this.state.warning}</div>
        )}
        <div className={classes.rulesContainer}>
          {this.state.rules.map((rule, i) => {
            const errorObj =
              errors &&
              errors.find((err: IErrorObj) => {
                const ruleStr = this.formatRule(rule);
                return err.element === ruleStr;
              });
            const errorStr = errorObj ? errorObj.msg : '';
            return (
              <Rule
                key={i}
                rule={rule}
                ruleIdx={i}
                rulesCount={this.state.rules.length}
                inputSchema={this.state.mapInputSchema}
                addRule={this.addRule}
                disabled={!!disabled}
                updateRule={(changedRule: IRule) => this.updateRule(changedRule, i)}
                deleteRule={this.deleteRule}
                error={errorStr}
              />
            );
          })}
        </div>
        {this.state.stageList.length === 0 && (
          <h4 className={classes.emptyMessage}>No input stages</h4>
        )}
      </div>
    );
  }
}

const StyledSqlConditionsWidget = withStyles(styles)(SqlConditionsWidgetView);

export default function SqlConditionsWidget(props) {
  return (
    <ThemeWrapper>
      <StyledSqlConditionsWidget {...props} />
    </ThemeWrapper>
  );
}

(SqlConditionsWidget as any).propTypes = WIDGET_PROPTYPES;
(SqlConditionsWidget as any).getWidgetAttributes = () => {
  return {};
};

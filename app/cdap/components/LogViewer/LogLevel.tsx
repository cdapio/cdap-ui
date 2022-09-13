/*
 * Copyright © 2020 Cask Data, Inc.
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

import withStyles, { StyleRules, WithStyles } from '@material-ui/core/styles/withStyles';

import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import DataFetcher from 'components/LogViewer/DataFetcher';
import IconSVG from 'components/shared/IconSVG';
import If from 'components/shared/If';
import { LogLevel as LogLevelEnum } from 'components/LogViewer/types';
import Popover from 'components/shared/Popover';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      lineHeight: '1.5',
    },
    popoverContainer: {
      '& .popper': {
        minWidth: '100px',
        width: '100px',
      },
    },
    target: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    levelRow: {
      fontSize: '13px',
      display: 'grid',
      gridTemplateColumns: '20px 1fr',
      cursor: 'pointer',
      textAlign: 'left',
      alignItems: 'end',
    },
    selected: {
      color: theme.palette.blue[100],
    },
    hovered: {
      color: theme.palette.grey[300],
    },
  };
};

interface ILogLevelProps extends WithStyles<typeof styles> {
  dataFetcher: DataFetcher;
  changeLogLevel: (level: LogLevelEnum) => void;
}

const LEVEL_OPTIONS = [
  LogLevelEnum.ERROR,
  LogLevelEnum.WARN,
  LogLevelEnum.INFO,
  LogLevelEnum.DEBUG,
  LogLevelEnum.TRACE,
];

const LogLevelView: React.FC<ILogLevelProps> = ({ classes, dataFetcher, changeLogLevel }) => {
  const [logLevel, setLogLevel] = React.useState(LEVEL_OPTIONS.indexOf(dataFetcher.getLogLevel()));
  const [mouseHover, setMouseHover] = React.useState(null);

  function handleSetLogLevel(index) {
    const selectedLevel = LEVEL_OPTIONS[index];
    changeLogLevel(selectedLevel);
    setLogLevel(index);
  }

  const target = (props) => {
    return (
      <span
        {...props}
        className={`${props.className} ${classes.target}`}
        data-cy="log-viewer-log-level-toggle"
        data-testid="log-viewer-log-level-toggle"
      >
        <span>Level</span>
        <ArrowDropDown />
      </span>
    );
  };

  function getIconClassName(i) {
    if (i <= logLevel && (mouseHover === null || i <= mouseHover)) {
      return classes.selected;
    }

    return classes.hovered;
  }

  return (
    <div className={classes.root}>
      <Popover target={target} placement="bottom" className={classes.popoverContainer}>
        <div data-cy="log-viewer-log-level-popover" data-testid="log-viewer-log-level-popover">
          {LEVEL_OPTIONS.map((level, i) => {
            const shouldShowCheckmark = i <= logLevel || i <= mouseHover;

            return (
              <div
                className={classes.levelRow}
                key={level}
                onClick={handleSetLogLevel.bind(null, i)}
                onMouseEnter={() => setMouseHover(i)}
                onMouseLeave={() => setMouseHover(null)}
                data-cy={`log-level-row-${level}`}
                data-testid={`log-level-row-${level}`}
              >
                <span>
                  <If condition={shouldShowCheckmark}>
                    <IconSVG
                      name="icon-check"
                      className={getIconClassName(i)}
                      dataCy="log-level-check"
                      data-testid="log-level-check"
                    />
                  </If>
                </span>
                <span>{level}</span>
              </div>
            );
          })}
        </div>
      </Popover>
    </div>
  );
};

const LogLevel = withStyles(styles)(LogLevelView);
export default LogLevel;

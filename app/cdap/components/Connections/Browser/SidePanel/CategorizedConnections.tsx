/*
 * Copyright © 2021 Cask Data, Inc.
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
import MuiAccordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, StyleRules, Theme, withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';
import If from 'components/If';
import classnames from 'classnames';

interface ICategorizedConnectionsProps {
  categorizedConnections: Map<string, any[]>;
  categories: string[];
  onConnectionSelection: (conn: string) => void;
  selectedConnection: string;
}
const Accordion = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    background: 'transparent',
    borderRight: 0,
    '&:not(:last-child)': {
      borderBottom: 0,
      borderRight: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(MuiAccordion);

const CustomAccordionSummary = withStyles((theme) => ({
  root: {
    minHeight: `${theme.spacing(4)}px`,
    '&$expanded': {
      minHeight: `${theme.spacing(4)}px`,
    },
  },
  content: {
    '&$expanded': {
      margin: `${theme.spacing(1.25)}px 0`,
    },
  },
  expanded: {},
}))(AccordionSummary);

const CustomAccordionDetails = withStyles({
  root: {
    padding: 0,
    gap: '10px',
    display: 'grid',
    gridAutoRows: '30px',
    paddingBottom: '10px',
  },
})(AccordionDetails);

const useStyle = makeStyles<Theme>(
  (theme): StyleRules => {
    return {
      connection: {
        color: 'black',
        paddingLeft: `${theme.spacing(4)}px`,
        display: 'flex',
        alignItems: 'center',
        '&:hover': {
          color: 'black',
          textDecoration: 'none',
          fontWeight: 600,
        },
      },
      selectedConnection: {
        background: 'white',
        color: theme.palette.primary.main,
        '&:hover': {
          color: theme.palette.primary.main,
          fontWeight: 'normal',
        },
      },
    };
  }
);
function getActiveCategory(selectedConnection: string, categorizedConnections: Map<string, any[]>) {
  const entries = Array.from(categorizedConnections.entries());
  if (!entries || (Array.isArray(entries) && !entries.length)) {
    return null;
  }
  for (const [category, connectors] of entries) {
    const isActive = connectors.find((connector) => connector.name === selectedConnection);
    if (isActive) {
      return category;
    }
  }
  return null;
}

export function CategorizedConnections({
  categorizedConnections = new Map(),
  categories = [],
  onConnectionSelection,
  selectedConnection,
}: ICategorizedConnectionsProps) {
  const classes = useStyle();
  const activeCategory = selectedConnection
    ? getActiveCategory(selectedConnection, categorizedConnections)
    : null;
  const [currentActiveAccordion, setCurrentActiveAccordion] = React.useState(activeCategory);
  const [localSelectedConnection, setLocalSelectedConnection] = React.useState(selectedConnection);

  const combinedCategorizedConnections = new Map();
  for (const category of categories) {
    const connectionExistsInThisCategory = categorizedConnections.has(category);
    if (connectionExistsInThisCategory) {
      combinedCategorizedConnections.set(category, categorizedConnections.get(category));
    } else {
      combinedCategorizedConnections.set(category, []);
    }
  }

  React.useEffect(() => {
    const currentCategory = selectedConnection
      ? getActiveCategory(selectedConnection, categorizedConnections)
      : null;
    setCurrentActiveAccordion(currentCategory);
  }, [categorizedConnections]);

  React.useEffect(() => {
    setLocalSelectedConnection(selectedConnection);
  }, [selectedConnection]);

  const handleChange = (tabName) => {
    if (currentActiveAccordion === tabName) {
      setCurrentActiveAccordion('');
    } else {
      setCurrentActiveAccordion(tabName);
    }
  };

  return (
    <div>
      {Array.from(combinedCategorizedConnections.entries()).map(([key, connections]) => {
        return (
          <Accordion
            square
            expanded={currentActiveAccordion === key}
            onChange={() => handleChange(key)}
            key={key}
          >
            <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
              {key}({connections.length})
            </CustomAccordionSummary>
            <CustomAccordionDetails>
              {connections.map((connection) => {
                return (
                  <Link
                    to={`/ns/${getCurrentNamespace()}/connections/${connection.name}?path=/`}
                    key={connection.name}
                    onClick={() => onConnectionSelection(connection.name)}
                    className={classnames(classes.connection, {
                      [classes.selectedConnection]: localSelectedConnection === connection.name,
                    })}
                  >
                    <If condition={localSelectedConnection === connection.name}>
                      <strong>{connection.name}</strong>
                    </If>
                    <If condition={localSelectedConnection !== connection.name}>
                      {connection.name}
                    </If>
                  </Link>
                );
              })}
            </CustomAccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}

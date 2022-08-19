import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core/';
import ExplorationCardStyles from './styles';
import { updatedData } from './utils';
import MyDataPrepApi from 'api/dataprep';
import { Link } from 'react-router-dom';
import { getCurrentNamespace } from 'services/NamespaceStore';

const OngoingDataExploration = () => {
  const classes = ExplorationCardStyles();
  const [ongoingExpDatas, setOngoingExpDatas] = useState<any>([]);
  const [finalArray, setFinalArray] = useState([]);

  const getOngoingData = () => {
    MyDataPrepApi.getWorkspaceList({
      context: 'default',
    }).subscribe((res) => {
      res.values.forEach((item) => {
        const params = {
          context: 'default',
          workspaceId: item.workspaceId,
        };
        const requestBody = {
          directives: item.directives,
          limit: 1000,
          insights: {
            name: item.name,
            workspaceName: item.workspaceName,
            path: item?.sampleSpec?.path,
            visualization: {},
          },
        };
        MyDataPrepApi.execute(params, requestBody).subscribe((response) => {
          let dataQuality = 0;
          response.headers.forEach((head) => {
            const general = response.summary.statistics[head].general;
            const { empty: empty = 0, 'non-null': nonEmpty = 100 } = general;
            const nonNull = Math.floor((nonEmpty - empty) * 10) / 10;
            dataQuality = dataQuality + nonNull;
          });

          const totalDataQuality = dataQuality / response.headers.length;

          setOngoingExpDatas((current) => [
            ...current,
            {
              connectionName:
                item?.sampleSpec?.connectionName === undefined
                  ? 'Upload'
                  : item?.sampleSpec?.connectionName,
              workspaceName: item.workspaceName,
              recipeSteps: item.directives.length,
              dataQuality: totalDataQuality,
            },
          ]);
        });
      });
    });
  };

  useEffect(() => {
    getOngoingData();
  }, []);

  useEffect(() => {
    const final = updatedData(ongoingExpDatas);
    setFinalArray(final);
  }, [ongoingExpDatas]);

  return (
    <Box data-testid="ongoing-data-explore-parent">
      {finalArray.map((item) => {
        return (
          <Link
            to={`/ns/${getCurrentNamespace()}/wrangler-grid/:${`${'testDataset'}`}`}
            style={{ textDecoration: 'none' }}
          >
            <Grid container className={classes.gridContainer}>
              {item.map((eachItem) => {
                switch (eachItem.type) {
                  case 'iconWithText':
                    return (
                      <Grid item className={classes.elementStyle}>
                        <Box className={classes.iconStyle}> {eachItem.icon}</Box>

                        <Typography variant="body1">{eachItem.label}</Typography>
                      </Grid>
                    );
                  case 'text':
                    return (
                      <Grid item className={classes.elementStyle}>
                        <Typography variant="body1"> {eachItem.label}</Typography>
                      </Grid>
                    );
                  case 'percentageWithText':
                    const percent = parseInt(eachItem.label);

                    return (
                      <Grid item className={classes.elementStyle}>
                        <Typography
                          variant="body2"
                          className={
                            percent > 50 ? classes.percentageStyleGreen : classes.percentageStyleRed
                          }
                        >
                          {eachItem.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          className={
                            percent > 50
                              ? classes.percentageSymbolGreen
                              : classes.percentageSymbolRed
                          }
                        >
                          {eachItem.percentageSymbol}
                        </Typography>

                        <Typography variant="body1">{eachItem.subText}</Typography>
                      </Grid>
                    );

                  default:
                    break;
                }
              })}
            </Grid>
          </Link>
        );
      })}
    </Box>
  );
};
export default OngoingDataExploration;

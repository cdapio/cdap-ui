import { Box, styled, Typography } from '@material-ui/core';
import React from 'react';
import { useConnectorTypeCardComponentStyles } from './styles';
import { IConnectorTypeCardComponentProps } from './types';

const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const ConnectorTypeCardComponent: React.FC<IConnectorTypeCardComponentProps> = (
  props: IConnectorTypeCardComponentProps
) => {
  const classes = useConnectorTypeCardComponentStyles();

  const { image } = props;

  return (
    <Box className={classes.cardWrapper}>
      <StyledBox>
        {image}
        <Typography variant="body1" className={classes.connectorTypeName}>
          {props.name}
        </Typography>
      </StyledBox>
    </Box>
  );
};

export default ConnectorTypeCardComponent;

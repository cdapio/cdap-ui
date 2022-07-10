import React from 'react';
import { Box, Typography, makeStyles, styled } from '@material-ui/core';

interface IConnectorTypeCardProps {
  name: string;
  image: JSX.Element;
}

const useStyles = makeStyles(() => ({
  cardWrapper: {
    height: '150px',
    backgroundColor: '#F3F6F9',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '0px',
    margin: '0px',
    padding: '0px',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#ffffff',
      boxShadow: '3px 4px 15px rgba(68, 132, 245, 0.15)',
    },
  },
  connectorTypeName: {
    fontSize: '14px',
    lineHeight: '21px',
    fontWeight: 400,
    letterSpacing: '0.15px',
    marginTop: '7px',
  },
}));

const StyledBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const ConnectorTypeCard: React.FC<IConnectorTypeCardProps> = (props: IConnectorTypeCardProps) => {
  const classes = useStyles();

  const { image } = props;

  return (
    <Box className={classes.cardWrapper}>
      <StyledBox>
        {/* rendering the SVG icon that was recived as a prop */}
        {image}
        <Typography variant="body1" className={classes.connectorTypeName}>
          {props.name}
        </Typography>
      </StyledBox>
    </Box>
  );
};

export default ConnectorTypeCard;

import { Typography } from '@material-ui/core';
import React from 'react';
import { ITypographyTextComponentProps } from './types';

export const TypographyComponent: React.FC<ITypographyTextComponentProps> = ({
  className,
  label,
}) => (
  <Typography className={className} color="textSecondary">
    {label}
  </Typography>
);

import React from 'react';
import { useStyles } from '../styles';

const ParseComponent = (props) => {
  const { sectionHeading, children } = props;
  const classes = useStyles();
  return (
    <section className={classes.functionSectionStyles}>
      <div className={classes.funtionSectionWrapperStyles}>
        <div className={classes.functionHeadingTextStyles}>{sectionHeading}</div>
        <img
          className={classes.greenCheckIconStyles}
          src="/cdap_assets/img/green-check.svg"
          alt="tick icon"
        />
      </div>
      {children}
    </section>
  );
};

export default ParseComponent;

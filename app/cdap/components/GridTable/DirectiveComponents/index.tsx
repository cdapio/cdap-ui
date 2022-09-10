import React from 'react';

const DirectiveContent: React.FC<any> = (props) => {
  const { directiveComponents, functionName: type } = props;
  const Component = directiveComponents.find((item) => item.type === type)?.component;
  return <Component {...props} />;
};

export default DirectiveContent;

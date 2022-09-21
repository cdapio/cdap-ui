import * as React from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core//Drawer';
import Button from '@material-ui/core//Button';
import DrawerHeader from './DrawerHeader/DrawerHeader';
import DrawerBody from './DrawerBody/DrawerBody';
import DrawerFooter from './DrawerFooter/DrawerFooter';
import { useDrawerCss } from './styles';

type Anchor = 'top' | 'left' | 'bottom' | 'right';

interface CDrawer {
  anchor: Anchor;
  open: boolean;
}

export default function DrawerComponent(props: CDrawer) {
  const classes = useDrawerCss();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  React.useEffect(() => {
    toggleDrawer(props.anchor, props.open);
  }, []);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  return (
    <div>
      {(['left', 'right', 'top', 'bottom'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            <Box className={classes.drawerContentWrapper}>
              <div className={classes.flexHeight}>
                <div>
                  <DrawerHeader toggleDrawer={toggleDrawer(anchor, false)} />
                  <DrawerBody />
                </div>
                <DrawerFooter />
              </div>
            </Box>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

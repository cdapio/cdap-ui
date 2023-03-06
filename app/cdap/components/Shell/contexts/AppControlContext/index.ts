import { createContext } from 'react';

export interface IAppControlContext {
  setAppControlToShell(hasShell: boolean): void;
}

function noop(val: boolean): void {
  return;
}

export const AppControlContext = createContext<IAppControlContext>({
  setAppControlToShell: noop,
});

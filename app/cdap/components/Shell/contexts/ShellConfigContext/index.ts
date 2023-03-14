import { createContext } from 'react';
import { ShellApiGenerator } from 'components/Shell/types';

export const ShellConfigContext = createContext<ShellApiGenerator>(({}) => ({}));

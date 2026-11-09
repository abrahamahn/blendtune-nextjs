// main/client/react/src/router/context.tsx
/**
 * Custom Router Context
 *
 * Minimal router implementation using native browser APIs.
 * Inspired by react-router patterns but simplified.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import {
  createKey,
  getBrowserHistory,
  type History,
  type NavigationType,
  type RouterLocation,
  type RouterState,
} from './history';

import type { ReactElement, ReactNode } from 'react';

export interface NavigateOptions {
  replace?: boolean;
  state?: unknown;
  /** Prevent scroll restoration for this navigation */
  preventScrollReset?: boolean;
}

export type NavigateFunction = (to: string | number, options?: NavigateOptions) => void;

export interface RouterContextValue {
  location: RouterLocation;
  navigationType: NavigationType;
  navigate: NavigateFunction;
  /** For MemoryRouter - allows direct location setting */
  setLocation?: (location: RouterLocation) => void;
}

export const RouterContext = createContext<RouterContextValue | null>(null);

function createBrowserRouterStore(): {
  getSnapshot: () => RouterState;
  getServerSnapshot: () => RouterState;
  subscribe: (callback: () => void) => () => void;
  history: History;
} {
  const history = getBrowserHistory();

  let cachedState: RouterState = {
    location: history.location,
    navigationType: history.navigationType,
  };

  const serverSnapshot: RouterState = {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'default',
    },
    navigationType: 'POP',
  };

  return {
    getSnapshot: (): RouterState => cachedState,
    getServerSnapshot: (): RouterState => serverSnapshot,
    subscribe: (callback: () => void): (() => void) => {
      return history.listen(() => {
        cachedState = {
          location: history.location,
          navigationType: history.navigationType,
        };
        callback();
      });
    },
    history,
  };
}

const browserStore = typeof window !== 'undefined' ? createBrowserRouterStore() : null;

export interface RouterProps {
  children?: ReactNode;
  /** Enable automatic scroll restoration (default: true) */
  scrollRestoration?: boolean;
}

export const Router = ({ children, scrollRestoration = true }: RouterProps): ReactElement => {
  const state = useSyncExternalStore(
    browserStore?.subscribe ?? ((): (() => void) => (): void => {}),
    browserStore?.getSnapshot ??
      ((): RouterState => ({
        location: { pathname: '/', search: '', hash: '', state: null, key: 'default' },
        navigationType: 'POP',
      })),
    browserStore?.getServerSnapshot ??
      ((): RouterState => ({
        location: { pathname: '/', search: '', hash: '', state: null, key: 'default' },
        navigationType: 'POP',
      })),
  );

  const preventScrollRef = useRef(false);

  const navigate: NavigateFunction = useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      browserStore?.history.go(to);
      return;
    }

    const url = to.startsWith('/') ? to : `/${to}`;
    preventScrollRef.current = options.preventScrollReset ?? false;

    if (options.replace ?? false) {
      browserStore?.history.replace(url, options.state);
    } else {
      browserStore?.history.push(url, options.state);
    }
  }, []);

  useEffect(() => {
    if (!scrollRestoration || browserStore === null) return;

    if (state.navigationType === 'POP') {
      browserStore.history.restoreScrollPosition();
    } else if (!preventScrollRef.current) {
      window.scrollTo(0, 0);
    }
    preventScrollRef.current = false;
  }, [state.location.key, state.navigationType, scrollRestoration]);

  useEffect(() => {
    if (!scrollRestoration || !('scrollRestoration' in window.history)) {
      return;
    }
    const original = window.history.scrollRestoration;
    window.history.scrollRestoration = 'manual';
    return (): void => {
      window.history.scrollRestoration = original;
    };
  }, [scrollRestoration]);

  return (
    <RouterContext.Provider
      value={{
        location: state.location,
        navigationType: state.navigationType,
        navigate,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export interface MemoryRouterProps {
  children?: ReactNode;
  initialEntries?: (string | { pathname: string; state?: unknown })[];
  initialIndex?: number;
}

interface MemoryEntry {
  path: string;
  state: unknown;
  key: string;
}

export const MemoryRouter = ({
  children,
  initialEntries = ['/'],
  initialIndex,
}: MemoryRouterProps): ReactElement => {
  const [state, setState] = useState<{
    entries: MemoryEntry[];
    index: number;
    navigationType: NavigationType;
  }>(() => {
    const normalizedEntries = initialEntries.map((entry): MemoryEntry => {
      if (typeof entry === 'string') {
        return { path: entry, state: null, key: createKey() };
      }
      return { path: entry.pathname, state: entry.state ?? null, key: createKey() };
    });
    return {
      entries: normalizedEntries,
      index: initialIndex ?? normalizedEntries.length - 1,
      navigationType: 'POP',
    };
  });

  const location = useMemo((): RouterLocation => {
    const entry = state.entries[state.index] ?? { path: '/', state: null, key: 'default' };
    const url = new URL(entry.path, 'http://localhost');
    return {
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      state: entry.state,
      key: entry.key,
    };
  }, [state.entries, state.index]);

  const navigate: NavigateFunction = useCallback((to, options = {}) => {
    if (typeof to === 'number') {
      setState((prev) => ({
        ...prev,
        index: Math.max(0, Math.min(prev.entries.length - 1, prev.index + to)),
        navigationType: 'POP',
      }));
      return;
    }

    const url = to.startsWith('/') ? to : `/${to}`;
    const newEntry: MemoryEntry = { path: url, state: options.state ?? null, key: createKey() };

    if (options.replace ?? false) {
      setState((prev) => {
        const nextEntries = [...prev.entries];
        nextEntries[prev.index] = newEntry;
        return { ...prev, entries: nextEntries, navigationType: 'REPLACE' };
      });
    } else {
      setState((prev) => ({
        entries: [...prev.entries.slice(0, prev.index + 1), newEntry],
        index: prev.index + 1,
        navigationType: 'PUSH',
      }));
    }
  }, []);

  const setLocation = useCallback((loc: RouterLocation) => {
    const url = `${loc.pathname}${loc.search}${loc.hash}`;
    setState((prev) => ({
      entries: [...prev.entries, { path: url, state: loc.state ?? null, key: createKey() }],
      index: prev.index + 1,
      navigationType: 'PUSH',
    }));
  }, []);

  return (
    <RouterContext.Provider
      value={{ location, navigationType: state.navigationType, navigate, setLocation }}
    >
      {children}
    </RouterContext.Provider>
  );
};

/** Access the full router context */
export function useRouterContext(): RouterContextValue {
  const context = useContext(RouterContext);
  if (context === null) {
    throw new Error('useRouterContext must be used within a Router');
  }
  return context;
}

/** Get the current navigation type (PUSH, POP, or REPLACE) */
export function useNavigationType(): NavigationType {
  const { navigationType } = useRouterContext();
  return navigationType;
}

/** Get the history object for advanced navigation control */
export function useHistory(): History | null {
  return browserStore?.history ?? null;
}

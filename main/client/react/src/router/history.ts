// main/client/react/src/router/history.ts
/** Navigation action type - matches react-router pattern */
export type NavigationType = 'PUSH' | 'POP' | 'REPLACE';

export interface RouterLocation {
  pathname: string;
  search: string;
  hash: string;
  state: unknown;
  /** Unique key for this location entry */
  key: string;
}

export interface RouterState {
  location: RouterLocation;
  navigationType: NavigationType;
}

interface HistoryState {
  key: string;
  scrollX?: number;
  scrollY?: number;
  usr?: unknown; // user state
}

export function createKey(): string {
  return Math.random().toString(36).substring(2, 10);
}

function getHistoryState(): HistoryState {
  const state = window.history.state as HistoryState | null;
  return state ?? { key: createKey() };
}

export interface History {
  readonly location: RouterLocation;
  readonly navigationType: NavigationType;
  push(to: string, state?: unknown): void;
  replace(to: string, state?: unknown): void;
  go(delta: number): void;
  back(): void;
  forward(): void;
  listen(callback: () => void): () => void;
  /** Save current scroll position */
  saveScrollPosition(): void;
  /** Restore scroll position for current location */
  restoreScrollPosition(): void;
}

function createBrowserHistory(): History {
  let currentNavigationType: NavigationType = 'POP';
  const listeners = new Set<() => void>();
  const scrollPositions = new Map<string, { x: number; y: number }>();

  let cachedLocation: RouterLocation = buildLocation();

  function buildLocation(): RouterLocation {
    const historyState = getHistoryState();
    return {
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      state: historyState.usr ?? null,
      key: historyState.key,
    };
  }

  function updateCachedLocation(): void {
    cachedLocation = buildLocation();
  }

  function notify(): void {
    updateCachedLocation();
    listeners.forEach((listener) => {
      listener();
    });
  }

  function saveScrollPosition(): void {
    const key = getHistoryState().key;
    if (key !== '') {
      scrollPositions.set(key, { x: window.scrollX, y: window.scrollY });
      const currentState = getHistoryState();
      window.history.replaceState(
        { ...currentState, scrollX: window.scrollX, scrollY: window.scrollY },
        '',
      );
    }
  }

  function restoreScrollPosition(): void {
    const historyState = getHistoryState();
    const saved = scrollPositions.get(historyState.key);
    if (saved !== undefined) {
      window.scrollTo(saved.x, saved.y);
    } else if (historyState.scrollX !== undefined && historyState.scrollY !== undefined) {
      window.scrollTo(historyState.scrollX, historyState.scrollY);
    } else {
      window.scrollTo(0, 0);
    }
  }

  window.addEventListener('popstate', () => {
    currentNavigationType = 'POP';
    notify();
  });

  return {
    get location(): RouterLocation {
      return cachedLocation;
    },
    get navigationType(): NavigationType {
      return currentNavigationType;
    },
    push(to: string, state?: unknown): void {
      saveScrollPosition();
      const key = createKey();
      const historyState: HistoryState = { key, usr: state };
      window.history.pushState(historyState, '', to);
      currentNavigationType = 'PUSH';
      notify();
    },
    replace(to: string, state?: unknown): void {
      const currentKey = getHistoryState().key;
      const key = currentKey !== '' ? currentKey : createKey();
      const historyState: HistoryState = { key, usr: state };
      window.history.replaceState(historyState, '', to);
      currentNavigationType = 'REPLACE';
      notify();
    },
    go(delta: number): void {
      window.history.go(delta);
    },
    back(): void {
      window.history.back();
    },
    forward(): void {
      window.history.forward();
    },
    listen(callback: () => void): () => void {
      listeners.add(callback);
      return (): void => {
        listeners.delete(callback);
      };
    },
    saveScrollPosition,
    restoreScrollPosition,
  };
}

let browserHistory: History | null = null;

export function getBrowserHistory(): History {
  if (browserHistory === null && typeof window !== 'undefined') {
    browserHistory = createBrowserHistory();
  }
  if (browserHistory === null) throw new Error('Browser history not initialized');
  return browserHistory;
}

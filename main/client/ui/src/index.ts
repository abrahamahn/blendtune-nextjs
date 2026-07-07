// main/client/ui/src/index.ts
// Shared UI components vendored from bslt (elements/layouts/theme/utils only —
// bslt's app-specific components/ directory is intentionally not vendored).

// Elements - Atomic UI building blocks
export {
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Divider,
  EnvironmentBadge,
  FileInput,
  Heading,
  Input,
  Kbd,
  MenuItem,
  OAuthButton,
  PasswordInput,
  Progress,
  Skeleton,
  SkipLink,
  Spinner,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  TextArea,
  Toaster,
  Tooltip,
  VersionBadge,
  VisuallyHidden,
} from './elements';
export type { ToastMessage, ToastTone } from './components';

// Layouts - Page and section layouts
export {
  AppShell,
  AuthLayout,
  BottombarLayout,
  Container,
  LeftSidebarLayout,
  Modal,
  Overlay,
  PageContainer,
  ProtectedRoute,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSeparator,
  RightSidebarLayout,
  ScrollArea,
  SidePeek,
  StackedLayout,
  TopbarLayout,
} from './layouts';
export type {
  AppShellProps,
  BottombarLayoutProps,
  LeftSidebarLayoutProps,
  RightSidebarLayoutProps,
  SidePeekRootProps,
  SidePeekSize,
  TopbarLayoutProps,
} from './layouts';

// Theme
export {
  ThemeProvider,
  colors,
  darkColors,
  lightColors,
  motion,
  radius,
  spacing,
  typography,
  useTheme,
} from './theme';
export type {
  ContrastMode,
  DarkColors,
  Density,
  LightColors,
  Radius,
  ThemeColors,
  ThemeContextValue,
  ThemeProviderProps,
} from './theme';

// Utilities
export { cn } from './utils';

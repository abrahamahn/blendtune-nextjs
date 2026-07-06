// src/client/features/creator/index.ts
export { CreatorDashboard } from './components/CreatorDashboard';
export { WorkspaceSwitcher } from './components/WorkspaceSwitcher';
export { AddTrackForm } from './components/AddTrackForm';
export {
  fetchWorkspaces,
  fetchWorkspaceCatalog,
  createWorkspaceTrack,
  CreatorApiError,
} from './core/api';

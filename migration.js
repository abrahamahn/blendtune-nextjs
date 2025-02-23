// migration.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// Source directory (current structure)
const sourceDir = path.resolve(__dirname, 'src');

// Temporary destination directory for the new structure
// Using a temp directory first allows you to inspect changes before replacing your src
const destDir = path.resolve(__dirname, 'src-feature-driven');

// Mapping from current file paths to new file paths
const fileMapping = {
  // AUTH feature
  'client/app/auth/index.tsx': 'client/features/auth/index.ts',
  'client/app/auth/SignIn.tsx': 'client/features/auth/components/SignInForm.tsx',
  'client/app/auth/SignUp.tsx': 'client/features/auth/components/SignUpForm.tsx',
  'client/app/auth/ResetPassword.tsx': 'client/features/auth/components/ResetPasswordForm.tsx',
  'client/app/auth/VerifyEmail.tsx': 'client/features/auth/components/VerifyEmailForm.tsx',
  'client/hooks/auth/useAuth.ts': 'client/features/auth/hooks/useAuth.ts',
  'client/hooks/auth/useAuthModal.ts': 'client/features/auth/hooks/useAuthModal.ts',
  'client/hooks/auth/index.ts': 'client/features/auth/hooks/index.ts',
  'client/services/auth/sessionService.tsx': 'client/features/auth/services/sessionService.tsx',
  'client/services/auth/useSession.ts': 'client/features/auth/services/useSession.ts',
  'client/services/auth/index.ts': 'client/features/auth/services/index.ts',
  'client/store/slices/sessionSlice.ts': 'client/features/auth/store/sessionSlice.ts',
  'client/store/slices/userSlice.ts': 'client/features/auth/store/userSlice.ts',

  // LAYOUT features
  // Header
  'client/components/layout/header/index.tsx': 'client/features/layout/header/components/Header.tsx',
  'client/components/layout/header/Dropdown.tsx': 'client/features/layout/header/components/Dropdown.tsx',
  'client/hooks/ui/header/useGenreMenu.ts': 'client/features/layout/header/hooks/useGenreMenu.ts',
  'client/hooks/ui/header/useMobileMenu.ts': 'client/features/layout/header/hooks/useMobileMenu.ts',
  'client/hooks/ui/header/index.ts': 'client/features/layout/header/hooks/index.ts',

  // Footer
  'client/components/layout/footer/index.tsx': 'client/features/layout/footer/components/Footer.tsx',

  // Leftbar
  'client/components/layout/sidebar/index.tsx': 'client/features/layout/leftbar/components/LeftSidebar.tsx',

  // Rightbar
  'client/components/layout/rightbar/OuterLayer.tsx': 'client/features/layout/rightbar/components/OuterLayer.tsx',
  'client/components/layout/rightbar/InnerLayer.tsx': 'client/features/layout/rightbar/components/InnerLayer.tsx',
  'client/components/layout/rightbar/index.ts': 'client/features/layout/rightbar/components/index.ts',
  'client/context/useRightSidebar.tsx': 'client/features/layout/rightbar/context/useRightSidebar.tsx',

  // PLAYER feature
  'client/components/layout/player/MusicPlayer.tsx': 'client/features/player/components/MusicPlayer.tsx',
  'client/components/layout/player/ResizableHandle.tsx': 'client/features/player/components/ResizableHandle.tsx',
  'client/hooks/audio/useAudio.ts': 'client/features/player/hooks/useAudio.ts',
  'client/hooks/audio/index.ts': 'client/features/player/hooks/index.ts',
  'client/services/audio/audioService.tsx': 'client/features/player/services/audioService.tsx',
  'client/services/audio/index.ts': 'client/features/player/services/index.ts',
  'client/store/slices/playbackSlice.ts': 'client/features/player/store/playbackSlice.ts',

  // SOUNDS features
  // Tracks
  'client/components/common/TrackCard.tsx': 'client/features/sounds/tracks/components/TrackCard.tsx',
  'client/app/sounds/NewTracks.tsx': 'client/features/sounds/tracks/components/NewTracks.tsx',
  'client/app/sounds/DesktopCatalog.tsx': 'client/features/sounds/tracks/components/DesktopCatalog.tsx',
  'client/app/sounds/MobileCatalog.tsx': 'client/features/sounds/tracks/components/MobileCatalog.tsx',
  'client/hooks/data/useTracks.ts': 'client/features/sounds/tracks/hooks/useTracks.ts',
  'client/hooks/data/useKeywords.ts': 'client/features/sounds/tracks/hooks/useKeywords.ts',
  'client/hooks/data/fetchTracks.ts': 'client/features/sounds/tracks/hooks/fetchTracks.ts',
  'client/hooks/data/index.ts': 'client/features/sounds/tracks/hooks/index.ts',
  'client/services/tracks/trackService.tsx': 'client/features/sounds/tracks/services/trackService.tsx',
  'client/services/tracks/index.ts': 'client/features/sounds/tracks/services/index.ts',
  'client/store/slices/keywordSlice.ts': 'client/features/sounds/tracks/store/keywordSlice.ts',
  'client/utils/data/uniqueKeywords.ts': 'client/features/sounds/tracks/utils/uniqueKeywords.ts',
  'client/utils/data/index.ts': 'client/features/sounds/tracks/utils/index.ts',

  // Filters
  'client/app/sounds/filters/Tempo.tsx': 'client/features/sounds/filters/components/TempoFilter.tsx',
  'client/app/sounds/filters/Key.tsx': 'client/features/sounds/filters/components/KeyFilter.tsx',
  'client/app/sounds/filters/Genre.tsx': 'client/features/sounds/filters/components/GenreFilter.tsx',
  'client/app/sounds/filters/Artist.tsx': 'client/features/sounds/filters/components/ArtistFilter.tsx',
  'client/app/sounds/filters/Instrument.tsx': 'client/features/sounds/filters/components/InstrumentFilter.tsx',
  'client/app/sounds/filters/Mood.tsx': 'client/features/sounds/filters/components/MoodFilter.tsx',
  'client/app/sounds/filters/Keyword.tsx': 'client/features/sounds/filters/components/KeywordFilter.tsx',
  'client/app/sounds/filters/Sort.tsx': 'client/features/sounds/filters/components/SortFilter.tsx',
  'client/app/sounds/filters/index.ts': 'client/features/sounds/filters/components/index.ts',
  'client/app/sounds/DesktopSoundFilter.tsx': 'client/features/sounds/filters/components/DesktopSoundFilter.tsx',
  'client/app/sounds/MobileSoundFilter.tsx': 'client/features/sounds/filters/components/MobileSoundFilter.tsx',
  'client/utils/helpers/filters.ts': 'client/features/sounds/filters/utils/filters.ts',

  // Category
  'client/app/sounds/Category.tsx': 'client/features/sounds/category/components/Category.tsx',
  'client/app/sounds/Packs.tsx': 'client/features/sounds/category/components/Packs.tsx',

  // Search
  'client/components/layout/header/SearchBar.tsx': 'client/features/sounds/search/components/SearchBar.tsx',
  'client/components/layout/header/SearchBarMobile.tsx': 'client/features/sounds/search/components/SearchBarMobile.tsx',
  'client/services/search/SearchParamsWrapper.tsx': 'client/features/sounds/search/services/SearchParamsWrapper.tsx',
  'client/services/search/index.ts': 'client/features/sounds/search/services/index.ts',
  'client/hooks/ui/header/useMobileSearch.ts': 'client/features/sounds/search/hooks/useMobileSearch.ts',

  // Visualizer
  'client/components/visualizer/Equalizer.tsx': 'client/features/sounds/visualizer/components/Equalizer.tsx',
  'client/components/visualizer/Waveform.tsx': 'client/features/sounds/visualizer/components/Waveform.tsx',
  'client/components/visualizer/index.ts': 'client/features/sounds/visualizer/components/index.ts',
  'client/components/common/EqualizerIcon.tsx': 'client/features/sounds/visualizer/components/EqualizerIcon.tsx',

  // Page
  'client/app/sounds/Hero.tsx': 'client/features/sounds/page/components/Hero.tsx',
  'client/app/sounds/index.ts': 'client/features/sounds/page/index.ts',

  // HOME feature
  'client/app/home/Hero.tsx': 'client/features/home/components/Hero.tsx',
  'client/app/home/index.ts': 'client/features/home/index.ts',

  // SHARED resources
  'client/components/common/Logo.tsx': 'client/shared/components/common/Logo.tsx',
  'client/components/common/LoadingIcon.tsx': 'client/shared/components/common/LoadingIcon.tsx',
  'client/components/common/SocialIcons.tsx': 'client/shared/components/common/SocialIcons.tsx',
  'client/components/common/Watermark.tsx': 'client/shared/components/common/Watermark.tsx',
  'client/components/common/index.ts': 'client/shared/components/common/index.ts',
  'client/components/layout/index.ts': 'client/shared/components/index.ts',
  'client/hooks/ui/mobile/HideMobileChrome.tsx': 'client/shared/hooks/mobile/HideMobileChrome.tsx',
  'client/hooks/ui/mobile/SetViewportHeight.tsx': 'client/shared/hooks/mobile/SetViewportHeight.tsx',
  'client/hooks/ui/mobile/index.ts': 'client/shared/hooks/mobile/index.ts',
  'client/utils/helpers/colorExtractor.ts': 'client/shared/utils/colorExtractor.ts',
  'client/utils/helpers/index.ts': 'client/shared/utils/index.ts',
  'client/constants/index.ts': 'client/shared/constants/index.ts',
  'client/styles/Home.module.css': 'client/shared/styles/Home.module.css',
  'client/styles/Sounds.module.css': 'client/shared/styles/Sounds.module.css',

  // CORE application functionality
  'client/providers/StoreProvider.tsx': 'client/core/providers/StoreProvider.tsx',
  'client/providers/ClientProviders.tsx': 'client/core/providers/ClientProviders.tsx',
  'client/providers/index.ts': 'client/core/providers/index.ts',
  'client/store/hooks/useAppDispatch.ts': 'client/core/store/hooks/useAppDispatch.ts',
  'client/store/hooks/useAppSelector.ts': 'client/core/store/hooks/useAppSelector.ts',
  'client/store/hooks/index.ts': 'client/core/store/hooks/index.ts',
  'client/store/slices/index.ts': 'client/core/store/slices/index.ts',
  'client/store/index.ts': 'client/core/store/index.ts',
  'client/context/ClientEnvironment.tsx': 'client/core/context/ClientEnvironment.tsx',
  'client/context/index.ts': 'client/core/context/index.ts',
  'client/services/pwa/ServiceWorkerService.tsx': 'client/core/services/pwa/ServiceWorkerService.tsx',
  'client/services/pwa/index.ts': 'client/core/services/pwa/index.ts',
  'client/services/index.ts': 'client/core/services/index.ts',

  // TESTS
  'client/test/Home.test.ts': 'test/Home.test.ts',
  'client/test/playwright-report/index.html': 'test/playwright-report/index.html',
};

// All the app router files that should maintain their original structure
const appRouterPreservePaths = [
  'app/**/*',
  'server/**/*',
  'shared/**/*',
  'docs/**/*'
];

// Function to ensure directory exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Copy files according to mapping
function copyAccordingToMapping() {
  console.log('Starting migration based on file mapping...');

  // Create destination directory
  fs.ensureDirSync(destDir);

  // Copy files according to mapping
  Object.entries(fileMapping).forEach(([sourcePath, destPath]) => {
    const fullSourcePath = path.join(sourceDir, sourcePath);
    const fullDestPath = path.join(destDir, destPath);
    
    if (fs.existsSync(fullSourcePath)) {
      ensureDirectoryExistence(fullDestPath);
      fs.copySync(fullSourcePath, fullDestPath);
      console.log(`Copied: ${sourcePath} -> ${destPath}`);
    } else {
      console.warn(`Warning: Source file not found: ${sourcePath}`);
    }
  });
}

// Find files that aren't mapped but should be migrated
function findUnmappedFiles() {
  console.log('\nChecking for unmapped files...');
  
  // Paths that should be checked for unmapped files
  const checkPaths = [
    'client/app',
    'client/components',
    'client/hooks',
    'client/services',
    'client/store',
    'client/utils',
    'client/context'
  ];
  
  const mappedSourcePaths = Object.keys(fileMapping).map(path => path.toLowerCase());
  
  checkPaths.forEach(checkPath => {
    const files = glob.sync(`${checkPath}/**/*.{tsx,ts,jsx,js}`, { cwd: sourceDir });
    
    files.forEach(file => {
      if (!mappedSourcePaths.includes(file.toLowerCase())) {
        console.warn(`Unmapped file: ${file}`);
      }
    });
  });
}

// Copy app router files directly
function copyPreservedPaths() {
  console.log('\nCopying preserved paths...');
  
  appRouterPreservePaths.forEach(globPattern => {
    const files = glob.sync(globPattern, { cwd: sourceDir });
    
    files.forEach(file => {
      const sourcePath = path.join(sourceDir, file);
      const destPath = path.join(destDir, file);
      
      if (fs.existsSync(sourcePath)) {
        ensureDirectoryExistence(destPath);
        fs.copySync(sourcePath, destPath);
        console.log(`Preserved: ${file}`);
      }
    });
  });
}

// Create new index files in each feature directory
function createFeatureIndexFiles() {
  console.log('\nCreating feature index files...');

  const featureCategories = [
    'client/features/auth',
    'client/features/layout',
    'client/features/layout/header',
    'client/features/layout/footer',
    'client/features/layout/leftbar',
    'client/features/layout/rightbar',
    'client/features/player',
    'client/features/sounds',
    'client/features/sounds/tracks',
    'client/features/sounds/filters',
    'client/features/sounds/category',
    'client/features/sounds/search',
    'client/features/sounds/visualizer',
    'client/features/sounds/page',
    'client/features/home'
  ];

  featureCategories.forEach(dir => {
    const indexPath = path.join(destDir, dir, 'index.ts');
    const dirSegments = dir.split('/');
    const dirName = dirSegments[dirSegments.length - 1];
    const featureName = dirName.charAt(0).toUpperCase() + dirName.slice(1);
    
    // Check if index.ts already exists (don't overwrite existing index files)
    if (!fs.existsSync(indexPath)) {
      let content;
      
      // For parent categories, export their children
      if (dir === 'client/features/layout' || dir === 'client/features/sounds') {
        content = `// ${featureName} feature category barrel export\n\n`;
        
        if (dir === 'client/features/layout') {
          content += `export * from './header';\nexport * from './footer';\nexport * from './leftbar';\nexport * from './rightbar';\n`;
        } else if (dir === 'client/features/sounds') {
          content += `export * from './tracks';\nexport * from './filters';\nexport * from './category';\nexport * from './search';\nexport * from './visualizer';\nexport * from './page';\n`;
        }
      } else {
        // For regular feature directories
        content = `// ${featureName} feature barrel export\n\n// Export components\nexport * from './components';\n\n// Uncomment as needed\n// export * from './hooks';\n// export * from './services';\n// export * from './store';\n// export * from './utils';\n`;
      }
      
      ensureDirectoryExistence(indexPath);
      fs.writeFileSync(indexPath, content);
      console.log(`Created index file: ${dir}/index.ts`);
    }
    
    // Create component index files if needed
    const componentsIndexPath = path.join(destDir, dir, 'components', 'index.ts');
    if (!fs.existsSync(componentsIndexPath) && dir !== 'client/features/layout' && dir !== 'client/features/sounds') {
      const componentFiles = glob.sync(`${dir}/components/*.{tsx,ts}`, { cwd: destDir });
      
      if (componentFiles.length > 0) {
        let componentsContent = `// ${featureName} components barrel export\n\n`;
        
        // Extract component names and create export statements
        componentFiles.forEach(file => {
          if (!file.endsWith('index.ts')) {
            const filename = path.basename(file, path.extname(file));
            componentsContent += `export * from './${filename}';\n`;
          }
        });
        
        ensureDirectoryExistence(componentsIndexPath);
        fs.writeFileSync(componentsIndexPath, componentsContent);
        console.log(`Created components index file: ${dir}/components/index.ts`);
      }
    }
  });
}

// Function to update import statements in all copied files
function updateImports() {
  console.log('\nUpdating import statements...');
  
  // Make a map of old paths to new paths
  const importPathMap = new Map();
  
  // Create regex patterns for path mappings
  Object.entries(fileMapping).forEach(([sourcePath, destPath]) => {
    // Remove file extensions for import paths
    const sourceImportPath = sourcePath.replace(/\.(tsx?|jsx?)$/, '');
    const destImportPath = destPath.replace(/\.(tsx?|jsx?)$/, '');
    
    importPathMap.set(sourceImportPath, destImportPath);
    
    // Also handle paths with /index explicitly removed
    if (sourceImportPath.endsWith('/index')) {
      importPathMap.set(
        sourceImportPath.replace('/index', ''),
        destImportPath.replace('/index', '')
      );
    }
  });
  
  // Helper function to replace import paths in a file
  function updateImportsInFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) return;
      
      let content = fs.readFileSync(filePath, 'utf8');
      let updated = false;
      
      // Replace import statements
      importPathMap.forEach((newPath, oldPath) => {
        // Handle different types of import paths
        const patterns = [
          // For absolute paths from src with @ alias
          new RegExp(`@/(${oldPath.replace('client/', '')})`, 'g'),
          // For absolute paths from src
          new RegExp(`from ['"]([^.].*?)/${oldPath}['"]`, 'g'),
          // For relative paths (this is more complex and may need refinement)
          // new RegExp(`from ['"]\\.\\.(/\\.\\.)*/.*?/${oldPath}['"]`, 'g')
        ];
        
        patterns.forEach(pattern => {
          const newContent = content.replace(pattern, (match, p1) => {
            if (p1) {
              return `@/${newPath}`;
            }
            return `from "${newPath}"`;
          });
          
          if (newContent !== content) {
            content = newContent;
            updated = true;
          }
        });
      });
      
      if (updated) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated imports in: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error updating imports in ${filePath}:`, error);
    }
  }
  
  // Find all TypeScript and JavaScript files in the destination directory
  const files = glob.sync('**/*.{ts,tsx,js,jsx}', { cwd: destDir });
  
  files.forEach(file => {
    updateImportsInFile(path.join(destDir, file));
  });
  
  console.log('Import updates complete. Note: You may need to manually fix some import paths.');
}

// Main function to execute the migration
async function migrateToFeatureDriven() {
  console.log('Starting migration to feature-driven architecture...');
  
  // Step 1: Copy files according to mapping
  copyAccordingToMapping();
  
  // Step 2: Find any files that are not mapped but should be migrated
  findUnmappedFiles();
  
  // Step 3: Copy preserved paths
  copyPreservedPaths();
  
  // Step 4: Create index files
  createFeatureIndexFiles();
  
  // Step 5: Update import statements (note: this is complex and may require manual adjustments)
  updateImports();
  
  console.log('\nMigration completed!');
  console.log(`\nThe new structure is in: ${destDir}`);
  console.log('\nNext steps:');
  console.log('1. Check the unmapped files mentioned above and decide where they should go');
  console.log('2. Check the new structure and fix any issues');
  console.log('3. Test the new structure by running your application');
  console.log('4. Once satisfied, replace your src directory with src-feature-driven');
  console.log('5. Update your imports and fix any remaining issues');
}

// Run the migration
migrateToFeatureDriven().catch(err => {
  console.error('Migration failed:', err);
});
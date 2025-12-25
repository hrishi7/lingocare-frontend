import React, { useState } from 'react';
import { Box, Button, Container, Typography, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CurriculumHeader } from './CurriculumHeader';
import { ModuleCard } from './ModuleCard';
import { UploadDialog } from '../common/UploadDialog';
import { StreamingProgress } from '../common/StreamingProgress';
import { LoadingSkeleton } from '../common/LoadingSkeleton';
import { useCurriculumContext } from '../../context/CurriculumContext';
import { api } from '../../services/api';
import { extractCompleteModules } from '../../utils/incrementalParser';
import type { Module } from '../../types/curriculum.types';

/**
 * CurriculumEditor Component
 * 
 * Main container for the curriculum creation and editing experience.
 * This component coordinates the overall structure of the curriculum,
 * managing the list of modules, handling file uploads for AI generation,
 * and providing high-level controls for the curriculum.
 * 
 * @returns {JSX.Element} The rendered CurriculumEditor component.
 */
export const CurriculumEditor: React.FC = () => {
  const { curriculum, dispatch, isLoading, setIsLoading } = useCurriculumContext();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [streamingStatus, setStreamingStatus] = useState<{ 
    status: string; 
    message: string; 
    chunks: number;
    modulesGenerated: number;
  } | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAddModule = () => {
    dispatch({ type: 'ADD_MODULE' });
  };

  const handleUpload = async (file: File) => {
    // Close dialog immediately so user can see progressive rendering
    setUploadDialogOpen(false);
    
    setIsLoading(true);
    setStreamingStatus({ status: 'started', message: 'Starting...', chunks: 0, modulesGenerated: 0 });
    
    // Reset curriculum for progressive rendering
    dispatch({ type:'RESET_FOR_PROGRESSIVE' });
    
    // Track parsing state
    let parseState: {
      completeModules: Module[];
      lastParsedIndex: number;
    } = {
      completeModules: [],
      lastParsedIndex: 0,
    };
    let accumulatedText = '';
    
    // Throttle streaming status updates to improve performance
    let lastStatusUpdate = 0;
    const STATUS_UPDATE_THROTTLE = 200; // ms - Update UI max 5 times per second
    
    try {
      const result = await api.generateCurriculumStream(
        file,
        // Progress callback
        (status, message) => {
          setStreamingStatus(prev => ({
            status,
            message,
            chunks: prev?.chunks || 0,
            modulesGenerated: prev?.modulesGenerated || 0,
          }));
        },
        // Chunk callback - Progressive rendering
        (chunk, index) => {
          accumulatedText += chunk;
          
          // Try to extract complete modules
          const { modules: newModules, state: newState } = extractCompleteModules(
            accumulatedText,
            parseState
          );
          
          // Add any new complete modules to UI
          newModules.forEach(module => {
            dispatch({ type: 'ADD_PROGRESSIVE_MODULE', payload: module });
          });
          
          parseState = newState;
          
          // Throttle status updates to reduce re-renders and improve performance
          const now = Date.now();
          if (now - lastStatusUpdate >= STATUS_UPDATE_THROTTLE || newModules.length > 0) {
            lastStatusUpdate = now;
            setStreamingStatus(prev => ({
              status: prev?.status || 'ai_processing',
              message: newModules.length > 0 
                ? `Generated ${parseState.completeModules.length} modules...`
                : prev?.message || 'Processing...',
              chunks: index + 1,
              modulesGenerated: parseState.completeModules.length,
            }));
          }
        }
      );
      
      // Finalize with complete curriculum (ensures title, description, etc.)
      dispatch({ type: 'SET_CURRICULUM', payload: result.curriculum });
      
      setSnackbar({
        open: true,
        message: `Curriculum generated successfully with ${result.curriculum.modules.length} modules using ${result.aiProvider}!`,
        severity: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate curriculum';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
      setStreamingStatus(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      {/* Header */}
      <CurriculumHeader onUploadClick={() => setUploadDialogOpen(true)} />

      {/* Global Progress Banner - Shows during streaming */}
      {isLoading && streamingStatus && (
        <Box sx={styles.progressBanner}>
          <StreamingProgress
            status={streamingStatus.status}
            message={streamingStatus.message}
            chunksReceived={streamingStatus.chunks}
            modulesGenerated={streamingStatus.modulesGenerated}
          />
        </Box>
      )}

      {/* Tabs - Simplified for assignment scope */}
      {/* Tabs */}
      <Box sx={styles.tabsContainer}>
        <Box sx={styles.tabsInnerContainer}>
          <Typography
            variant="body1"
            sx={styles.activeTab}
          >
            Structure
          </Typography>
          <Typography
            variant="body1"
            sx={styles.inactiveTab}
          >
            Materials
          </Typography>
          <Typography
            variant="body1"
            sx={styles.inactiveTab}
          >
            Instructors
          </Typography>
        </Box>

        {/* Right side - Filter buttons */}
        <Box sx={styles.filterContainer}>
          <Button
            size="small"
            variant="contained"
            sx={styles.filterButtonActive}
          >
            All
          </Button>
          <Button
            size="small"
            sx={styles.filterButtonInactive}
          >
            Theory
          </Button>
          <Button
            size="small"
            sx={styles.filterButtonInactive}
          >
            Practical
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddModule}
            sx={styles.addModuleButtonMobile}
          >
            Add Module
          </Button>
        </Box>
      </Box>

      {/* Modules */}
      <Box>
        {curriculum.modules.length > 0 ? (
          curriculum.modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))
        ) : isLoading ? (
          <LoadingSkeleton count={1} />
        ) : (
          <Box sx={styles.emptyStateContainer}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No modules yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={styles.emptyStateText}>
              Start building your curriculum by adding a module or uploading a PDF
            </Typography>
            <Box sx={styles.emptyStateActionContainer}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddModule}
              >
                Add Module
              </Button>
              <Button
                variant="outlined"
                disabled={isLoading}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload PDF
              </Button>
            </Box>
          </Box>
        )}

        {/* Add Module Button (when modules exist) */}
        {curriculum.modules.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddModule}
            fullWidth
            sx={styles.addModuleButtonBottom}
          >
            Add Module
          </Button>
        )}
      </Box>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
        isLoading={isLoading}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={styles.alert}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

const styles = {
  container: { 
    py: 4 
  },
  // progressBanner: {
  //   position: 'sticky',
  //   top: 0,
  //   zIndex: 10,
  //   mb: 3,
  //   animation: 'slideDown 0.3s ease-out',
  //   '@keyframes slideDown': {
  //     '0%': { transform: 'translateY(-100%)', opacity: 0 },
  //     '100%': { transform: 'translateY(0)', opacity: 1 },
  //   },
  // },
  tabsContainer: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    gap: { xs: 2, md: 3 },
    mb: 3,
    borderBottom: '1px solid',
    borderColor: 'divider',
    pb: 1,
    alignItems: { xs: 'flex-start', md: 'center' },
  },
  tabsInnerContainer: { 
    display: 'flex', 
    gap: 3, 
    overflow: 'auto', 
    width: { xs: '100%', md: 'auto' }, 
    pb: { xs: 1, md: 0 } 
  },
  activeTab: {
    fontWeight: 600,
    color: 'primary.main',
    borderBottom: '2px solid',
    borderColor: 'primary.main',
    pb: 1,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  inactiveTab: {
    color: 'text.secondary',
    cursor: 'pointer',
    '&:hover': { color: 'text.primary' },
    whiteSpace: 'nowrap',
  },
  filterContainer: { 
    ml: { xs: 0, md: 'auto' }, 
    display: 'flex', 
    gap: 1, 
    alignItems: 'center',
    width: { xs: '100%', md: 'auto' },
    flexWrap: 'wrap',
  },
  filterButtonActive: { 
    borderRadius: 3, 
    minWidth: 'auto', 
    px: 2 
  },
  filterButtonInactive: { 
    borderRadius: 3, 
    minWidth: 'auto', 
    px: 2, 
    color: 'text.secondary' 
  },
  addModuleButtonMobile: { 
    borderRadius: 2, 
    ml: { xs: 0, md: 2 }, 
    flexGrow: { xs: 1, md: 0 } 
  },
  progressBanner: {
    position: 'sticky',
    top: 16,
    zIndex: 1100,
    mb: 4,
    mx: 'auto',
    maxWidth: '800px',
    width: '100%',
    animation: 'slideDown 0.5s ease-out',
    '@keyframes slideDown': {
      '0%': { transform: 'translateY(-100%)', opacity: 0 },
      '100%': { transform: 'translateY(0)', opacity: 1 },
    },
  },
  emptyStateContainer: {
    textAlign: 'center',
    py: 8,
    backgroundColor: 'background.paper',
    borderRadius: 2,
    border: '2px dashed',
    borderColor: 'divider',
  },
  emptyStateText: { 
    mb: 3 
  },
  emptyStateActionContainer: { 
    display: 'flex', 
    gap: 2, 
    justifyContent: 'center' 
  },
  addModuleButtonBottom: {
    mt: 2,
    py: 2,
    borderStyle: 'dashed',
    borderWidth: 2,
    '&:hover': {
      borderWidth: 2,
      borderStyle: 'dashed',
    },
  },
  alert: { 
    width: '100%' 
  }
};

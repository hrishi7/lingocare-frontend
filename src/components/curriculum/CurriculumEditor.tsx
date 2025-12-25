import React, { useState } from 'react';
import { Box, Button, Container, Typography, Alert, Snackbar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CurriculumHeader } from './CurriculumHeader';
import { ModuleCard } from './ModuleCard';
import { UploadDialog } from '../common/UploadDialog';
import { useCurriculumContext } from '../../context/CurriculumContext';
import { api } from '../../services/api';

/**
 * CurriculumEditor Component
 * 
 * Main container for the curriculum creation/editing experience.
 * Coordinates all curriculum-related components.
 */
export const CurriculumEditor: React.FC = () => {
  const { curriculum, dispatch, isLoading, setIsLoading } = useCurriculumContext();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleAddModule = () => {
    dispatch({ type: 'ADD_MODULE' });
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await api.generateCurriculum(file);
      dispatch({ type: 'SET_CURRICULUM', payload: result.curriculum });
      setSnackbar({
        open: true,
        message: `Curriculum generated successfully using ${result.aiProvider}!`,
        severity: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate curriculum';
      setSnackbar({
        open: true,
        message,
        severity: 'error',
      });
      // throw error; // Removed re-throw to prevent unhandled rejection in tests/handlers
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <CurriculumHeader onUploadClick={() => setUploadDialogOpen(true)} />

      {/* Tabs - Simplified for assignment scope */}
      {/* Tabs */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 2, md: 3 },
          mb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 1,
          alignItems: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Box sx={{ display: 'flex', gap: 3, overflow: 'auto', width: { xs: '100%', md: 'auto' }, pb: { xs: 1, md: 0 } }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 1,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Structure
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { color: 'text.primary' },
              whiteSpace: 'nowrap',
            }}
          >
            Materials
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { color: 'text.primary' },
              whiteSpace: 'nowrap',
            }}
          >
            Instructors
          </Typography>
        </Box>

        {/* Right side - Filter buttons */}
        <Box sx={{ 
          ml: { xs: 0, md: 'auto' }, 
          display: 'flex', 
          gap: 1, 
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' },
          flexWrap: 'wrap',
        }}>
          <Button
            size="small"
            variant="contained"
            sx={{ borderRadius: 3, minWidth: 'auto', px: 2 }}
          >
            All
          </Button>
          <Button
            size="small"
            sx={{ borderRadius: 3, minWidth: 'auto', px: 2, color: 'text.secondary' }}
          >
            Theory
          </Button>
          <Button
            size="small"
            sx={{ borderRadius: 3, minWidth: 'auto', px: 2, color: 'text.secondary' }}
          >
            Practical
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddModule}
            sx={{ borderRadius: 2, ml: { xs: 0, md: 2 }, flexGrow: { xs: 1, md: 0 } }}
          >
            Add Module
          </Button>
        </Box>
      </Box>

      {/* Modules */}
      <Box>
        {curriculum.modules.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '2px dashed',
              borderColor: 'divider',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No modules yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start building your curriculum by adding a module or uploading a PDF
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddModule}
              >
                Add Module
              </Button>
              <Button
                variant="outlined"
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload PDF
              </Button>
            </Box>
          </Box>
        ) : (
          curriculum.modules.map((module, index) => (
            <ModuleCard key={module.id} module={module} index={index} />
          ))
        )}

        {/* Add Module Button (when modules exist) */}
        {curriculum.modules.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddModule}
            fullWidth
            sx={{
              mt: 2,
              py: 2,
              borderStyle: 'dashed',
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2,
                borderStyle: 'dashed',
              },
            }}
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

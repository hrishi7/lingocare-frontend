import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { InlineEdit } from './InlineEdit';
import { useCurriculumContext } from '../../context/CurriculumContext';

interface CurriculumHeaderProps {
  onUploadClick: () => void;
}

/**
 * CurriculumHeader Component
 * 
 * Header section with curriculum title, description, and action buttons.
 */
export const CurriculumHeader: React.FC<CurriculumHeaderProps> = ({ onUploadClick }) => {
  const { curriculum, dispatch, isLoading } = useCurriculumContext();

  const handleTitleChange = (title: string) => {
    dispatch({ type: 'UPDATE_CURRICULUM_TITLE', payload: title });
  };

  const handleDescriptionChange = (description: string) => {
    dispatch({ type: 'UPDATE_CURRICULUM_DESCRIPTION', payload: description });
  };

  const handleSave = () => {
    // In a real app, this would save to a database
    // For this assignment, we just show a message
    console.log('Curriculum saved (in-memory):', curriculum);
    alert('Curriculum saved successfully! (Note: This is temporary storage as per assignment requirements)');
  };

  return (
    <Box
      sx={{
        mb: 4,
        pb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Top Actions Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 2, sm: 0 },
          mb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowBackIcon sx={{ color: 'text.secondary', cursor: 'pointer' }} />
          <Typography variant="body2" color="text.secondary">
            Programs
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={onUploadClick}
            disabled={isLoading}
            sx={{ borderRadius: 2, flexGrow: { xs: 1, sm: 0 } }}
          >
            Upload Curriculum
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ borderRadius: 2, flexGrow: { xs: 1, sm: 0 } }}
          >
            Save
          </Button>
        </Box>
      </Box>

      {/* Title and Description */}
      <Box sx={{ maxWidth: 800, width: '100%' }}>
        <InlineEdit
          value={curriculum.title}
          onSave={handleTitleChange}
          placeholder="Click to add curriculum title..."
          variant="h4"
          testId="curriculum-title"
          sx={{
            '& .MuiTypography-root': {
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '2.125rem' },
              lineHeight: 1.2, // Improve line height for wrapping text
            },
          }}
        />
        <InlineEdit
          value={curriculum.description}
          onSave={handleDescriptionChange}
          placeholder="Add Description ✨"
          variant="body1"
          testId="curriculum-description"
          multiline
          sx={{ mt: 1 }}
        />
      </Box>

      {/* Progress Indicator */}
      <Box sx={{ mt: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            fontWeight: 500,
          }}
        >
          0% Completed
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select Duration
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select total hours (UE)
        </Typography>
      </Box>
    </Box>
  );
};

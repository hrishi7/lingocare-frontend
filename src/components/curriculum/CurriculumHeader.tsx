import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { InlineEdit } from './InlineEdit';
import { useCurriculumContext } from '../../context/CurriculumContext';

/**
 * Props for CurriculumHeader component.
 */
interface CurriculumHeaderProps {
  /** Callback function triggered when upload button is clicked */
  onUploadClick: () => void;
}

/**
 * CurriculumHeader Component
 * 
 * Displays the header section of the curriculum editor, including the curriculum title,
 * description, and action buttons (upload and save). This component provides the main
 * controls for managing curriculum metadata.
 * 
 * @param {CurriculumHeaderProps} props - Component props
 * @returns {JSX.Element} The rendered CurriculumHeader component
 */
export const CurriculumHeader: React.FC<CurriculumHeaderProps> = ({ onUploadClick }) => {
  const { curriculum, dispatch, isLoading } = useCurriculumContext();

  /**
   * Updates the curriculum title in the context.
   * @param {string} title - The new title
   */
  const handleTitleChange = (title: string) => {
    dispatch({ type: 'UPDATE_CURRICULUM_TITLE', payload: title });
  };

  /**
   * Updates the curriculum description in the context.
   * @param {string} description - The new description
   */
  const handleDescriptionChange = (description: string) => {
    dispatch({ type: 'UPDATE_CURRICULUM_DESCRIPTION', payload: description });
  };

  /**
   * Saves the curriculum (currently in-memory only for assignment purposes).
   */
  const handleSave = () => {
    // In a real app, this would save to a database
    // For this assignment, we just show a message
    console.log('Curriculum saved (in-memory):', curriculum);
    alert('Curriculum saved successfully! (Note: This is temporary storage as per assignment requirements)');
  };

  return (
    <Box sx={styles.container}>
      {/* Top Actions Row */}
      <Box sx={styles.topActionsRow}>
        <Box sx={styles.breadcrumbContainer}>
          <ArrowBackIcon sx={styles.backIcon} />
          <Typography variant="body2" color="text.secondary">
            Programs
          </Typography>
        </Box>

        <Box sx={styles.actionButtonsContainer}>
          <Button
            variant="outlined"
            startIcon={<UploadFileIcon />}
            onClick={onUploadClick}
            disabled={isLoading}
            sx={styles.uploadButton}
          >
            Upload Curriculum
          </Button>
          {/* <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={styles.saveButton}
          >
            Save
          </Button> */}
        </Box>
      </Box>

      {/* Title and Description */}
      <Box sx={styles.titleDescriptionContainer}>
        <InlineEdit
          value={curriculum.title}
          onSave={handleTitleChange}
          placeholder="Click to add curriculum title..."
          variant="h4"
          testId="curriculum-title"
          sx={styles.titleEdit}
        />
        <InlineEdit
          value={curriculum.description}
          onSave={handleDescriptionChange}
          placeholder="Add Description ✨"
          variant="body1"
          testId="curriculum-description"
          multiline
          sx={styles.descriptionEdit}
        />
      </Box>

      {/* Progress Indicator */}
      <Box sx={styles.progressContainer}>
        <Typography
          variant="body2"
          sx={styles.completedText}
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

const styles = {
  container: {
    mb: 4,
    pb: 3,
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  topActionsRow: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 2, sm: 0 },
    mb: 2,
  },
  breadcrumbContainer: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1 
  },
  backIcon: { 
    color: 'text.secondary', 
    cursor: 'pointer' 
  },
  actionButtonsContainer: { 
    display: 'flex', 
    gap: 1, 
    width: { xs: '100%', sm: 'auto' } 
  },
  uploadButton: { 
    borderRadius: 2, 
    flexGrow: { xs: 1, sm: 0 } 
  },
  saveButton: { 
    borderRadius: 2, 
    flexGrow: { xs: 1, sm: 0 } 
  },
  titleDescriptionContainer: { 
    maxWidth: 800, 
    width: '100%' 
  },
  titleEdit: {
    '& .MuiTypography-root': {
      fontWeight: 700,
      fontSize: { xs: '1.5rem', sm: '2.125rem' },
      lineHeight: 1.2,
    },
  },
  descriptionEdit: { 
    mt: 1 
  },
  progressContainer: { 
    mt: 2, 
    display: 'flex', 
    gap: 2, 
    alignItems: 'center', 
    flexWrap: 'wrap' 
  },
  completedText: {
    color: 'primary.main',
    fontWeight: 500,
  }
};

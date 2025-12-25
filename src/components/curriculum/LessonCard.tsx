import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Lesson } from '../../types/curriculum.types';
import { InlineEdit } from './InlineEdit';
import { useCurriculumContext } from '../../context/CurriculumContext';

/**
 * Props for LessonCard component.
 */
interface LessonCardProps {
  /** The lesson data to display */
  lesson: Lesson;
  /** ID of the module this lesson belongs to */
  moduleId: string;
  /** ID of the topic this lesson belongs to */
  topicId: string;
  /** Index of the lesson in the parent array */
  index: number;
}

/**
 * LessonCard Component
 * 
 * Displays a single lesson with inline editing for title and description.
 * Lessons are the lowest level items in the curriculum hierarchy.
 * 
 * @param {LessonCardProps} props - Component props
 * @returns {JSX.Element} The rendered LessonCard component
 */
export const LessonCard: React.FC<LessonCardProps> = ({ lesson, moduleId, topicId, index }) => {
  const { dispatch } = useCurriculumContext();

  /**
   * Updates the lesson title in the context.
   * @param {string} title - The new title
   */
  const handleTitleChange = (title: string) => {
    dispatch({
      type: 'UPDATE_LESSON',
      payload: { moduleId, topicId, lessonId: lesson.id, title },
    });
  };

  /**
   * Updates the lesson description in the context.
   * @param {string} description - The new description
   */
  const handleDescriptionChange = (description: string) => {
    dispatch({
      type: 'UPDATE_LESSON',
      payload: { moduleId, topicId, lessonId: lesson.id, description },
    });
  };

  /**
   * Deletes this lesson from its parent topic.
   */
  const handleDelete = () => {
    dispatch({
      type: 'DELETE_LESSON',
      payload: { moduleId, topicId, lessonId: lesson.id },
    });
  };

  return (
    <Box
      data-testid={`lesson-${lesson.id}`}
      sx={styles.container}
    >
      {/* Lesson Header */}
      <Box sx={styles.headerContainer}>
        <Box sx={styles.contentContainer}>
          <InlineEdit
            value={lesson.title}
            onSave={handleTitleChange}
            placeholder={`Lesson ${index + 1} - Click to add title`}
            variant="body1"
            testId={`lesson-title-${lesson.id}`}
            sx={styles.titleEdit}
          />
          <InlineEdit
            value={lesson.description}
            onSave={handleDescriptionChange}
            placeholder="Click to add description ✨"
            variant="body2"
            testId={`lesson-desc-${lesson.id}`}
            multiline
            sx={styles.descriptionEdit}
          />
        </Box>

        {/* Actions */}
        <Box
          className="lesson-actions"
          sx={styles.actionsContainer}
        >
          <Tooltip title="Delete lesson">
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={styles.deleteButton}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    pl: { xs: 2, sm: 3 },
    py: 1.5,
    borderLeft: '2px solid',
    borderColor: 'primary.light',
    ml: { xs: 1.5, sm: 2 },
    position: 'relative',
    '&:hover .lesson-actions': {
      opacity: 1,
    },
  },
  headerContainer: { 
    display: 'flex', 
    alignItems: 'flex-start', 
    gap: 1 
  },
  contentContainer: { 
    flex: 1, 
    minWidth: 0 
  },
  titleEdit: {
    '& .MuiTypography-root': {
      fontWeight: 500,
      wordBreak: 'break-word'
    },
  },
  descriptionEdit: { 
    mt: 0.5 
  },
  actionsContainer: {
    opacity: { xs: 1, sm: 0 },
    transition: 'opacity 0.2s ease',
    display: 'flex',
    gap: 0.5,
  },
  deleteButton: { 
    color: 'error.main' 
  }
};

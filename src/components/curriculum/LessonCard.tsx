import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Lesson } from '../../types/curriculum.types';
import { InlineEdit } from './InlineEdit';
import { useCurriculumContext } from '../../context/CurriculumContext';

interface LessonCardProps {
  lesson: Lesson;
  moduleId: string;
  topicId: string;
  index: number;
}

/**
 * LessonCard Component
 * 
 * Displays a single lesson with inline editing for title and description.
 */
export const LessonCard: React.FC<LessonCardProps> = ({ lesson, moduleId, topicId, index }) => {
  const { dispatch } = useCurriculumContext();

  const handleTitleChange = (title: string) => {
    dispatch({
      type: 'UPDATE_LESSON',
      payload: { moduleId, topicId, lessonId: lesson.id, title },
    });
  };

  const handleDescriptionChange = (description: string) => {
    dispatch({
      type: 'UPDATE_LESSON',
      payload: { moduleId, topicId, lessonId: lesson.id, description },
    });
  };

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_LESSON',
      payload: { moduleId, topicId, lessonId: lesson.id },
    });
  };

  return (
    <Box
      data-testid={`lesson-${lesson.id}`}
      sx={{
        pl: 3,
        py: 1.5,
        borderLeft: '2px solid',
        borderColor: 'primary.light',
        ml: 2,
        position: 'relative',
        '&:hover .lesson-actions': {
          opacity: 1,
        },
      }}
    >
      {/* Lesson Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <Box sx={{ flex: 1 }}>
          <InlineEdit
            value={lesson.title}
            onSave={handleTitleChange}
            placeholder={`Lesson ${index + 1} - Click to add title`}
            variant="body1"
            testId={`lesson-title-${lesson.id}`}
            sx={{
              '& .MuiTypography-root': {
                fontWeight: 500,
              },
            }}
          />
          <InlineEdit
            value={lesson.description}
            onSave={handleDescriptionChange}
            placeholder="Click to add description ✨"
            variant="body2"
            testId={`lesson-desc-${lesson.id}`}
            multiline
            sx={{ mt: 0.5 }}
          />
        </Box>

        {/* Actions */}
        <Box
          className="lesson-actions"
          sx={{
            opacity: 0,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Tooltip title="Delete lesson">
            <IconButton
              size="small"
              onClick={handleDelete}
              sx={{ color: 'error.main' }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};

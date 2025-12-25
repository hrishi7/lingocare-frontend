import React, { useState } from 'react';
import { Box, Button, Collapse, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Topic } from '../../types/curriculum.types';
import { InlineEdit } from './InlineEdit';
import { LessonCard } from './LessonCard';
import { useCurriculumContext } from '../../context/CurriculumContext';

interface TopicCardProps {
  topic: Topic;
  moduleId: string;
  index: number;
}

/**
 * TopicCard Component
 * 
 * Displays a topic with its lessons.
 * Supports expand/collapse for lessons.
 */
export const TopicCard: React.FC<TopicCardProps> = ({ topic, moduleId, index }) => {
  const { dispatch } = useCurriculumContext();
  const [expanded, setExpanded] = useState(true);

  const handleTitleChange = (title: string) => {
    dispatch({
      type: 'UPDATE_TOPIC',
      payload: { moduleId, topicId: topic.id, title },
    });
  };

  const handleDescriptionChange = (description: string) => {
    dispatch({
      type: 'UPDATE_TOPIC',
      payload: { moduleId, topicId: topic.id, description },
    });
  };

  const handleAddLesson = () => {
    dispatch({
      type: 'ADD_LESSON',
      payload: { moduleId, topicId: topic.id },
    });
  };

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_TOPIC',
      payload: { moduleId, topicId: topic.id },
    });
  };

  return (
    <Box
      data-testid={`topic-${topic.id}`}
      sx={{
        ml: 3,
        mt: 2,
        pl: 2,
        borderLeft: '3px solid',
        borderColor: 'primary.main',
        position: 'relative',
        '&:hover .topic-actions': {
          opacity: 1,
        },
      }}
    >
      {/* Topic Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={{
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
            mt: 0.5,
          }}
        >
          <ExpandMoreIcon />
        </IconButton>

        <Box sx={{ flex: 1 }}>
          <InlineEdit
            value={topic.title}
            onSave={handleTitleChange}
            placeholder={`Topic ${index + 1} - Click to add title`}
            variant="h6"
            testId={`topic-title-${topic.id}`}
          />
          <InlineEdit
            value={topic.description}
            onSave={handleDescriptionChange}
            placeholder="Click to add description ✨"
            variant="body2"
            testId={`topic-desc-${topic.id}`}
            multiline
            sx={{ mt: 0.5, ml: 1 }}
          />
        </Box>

        {/* Actions */}
        <Box
          className="topic-actions"
          sx={{
            opacity: 0,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Tooltip title="Delete topic">
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

      {/* Lessons */}
      <Collapse in={expanded}>
        <Box sx={{ mt: 1 }}>
          {topic.lessons.map((lesson, lessonIndex) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              moduleId={moduleId}
              topicId={topic.id}
              index={lessonIndex}
            />
          ))}

          {/* Add Lesson Button */}
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddLesson}
            size="small"
            sx={{
              ml: 3,
              mt: 1,
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            Add Lesson
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

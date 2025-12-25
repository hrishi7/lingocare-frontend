import React, { useState } from 'react';
import { Box, Button, Collapse, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Topic } from '../../types/curriculum.types';
import { InlineEdit } from './InlineEdit';
import { LessonCard } from './LessonCard';
import { useCurriculumContext } from '../../context/CurriculumContext';

/**
 * Props for TopicCard component.
 */
interface TopicCardProps {
  /** The topic data to display */
  topic: Topic;
  /** ID of the module this topic belongs to */
  moduleId: string;
  /** Index of the topic in the parent array */
  index: number;
}

/**
 * TopicCard Component
 * 
 * Displays a collapsible card for a curriculum topic, showing its title, description,
 * and list of lessons. Topics are nested within modules and provide the mid-level
 * structure in the curriculum hierarchy.
 * 
 * @param {TopicCardProps} props - Component props
 * @returns {JSX.Element} The rendered TopicCard component
 */
export const TopicCard: React.FC<TopicCardProps> = ({ topic, moduleId, index }) => {
  const { dispatch } = useCurriculumContext();
  const [expanded, setExpanded] = useState(true);

  /**
   * Updates the topic title in the context.
   * @param {string} title - The new title
   */
  const handleTitleChange = (title: string) => {
    dispatch({
      type: 'UPDATE_TOPIC',
      payload: { moduleId, topicId: topic.id, title },
    });
  };

  /**
   * Updates the topic description in the context.
   * @param {string} description - The new description
   */
  const handleDescriptionChange = (description: string) => {
    dispatch({
      type: 'UPDATE_TOPIC',
      payload: { moduleId, topicId: topic.id, description },
    });
  };

  /**
   * Adds a new lesson to this topic.
   */
  const handleAddLesson = () => {
    dispatch({
      type: 'ADD_LESSON',
      payload: { moduleId, topicId: topic.id },
    });
  };

  /**
   * Deletes this topic from its parent module.
   */
  const handleDelete = () => {
    dispatch({
      type: 'DELETE_TOPIC',
      payload: { moduleId, topicId: topic.id },
    });
  };

  return (
    <Box
      data-testid={`topic-${topic.id}`}
      sx={styles.container}
    >
      {/* Topic Header */}
      <Box sx={styles.headerContainer}>
        <IconButton
          size="small"
          onClick={() => setExpanded(!expanded)}
          sx={styles.expandButton(expanded)}
        >
          <ExpandMoreIcon />
        </IconButton>

        <Box sx={styles.contentContainer}>
          <InlineEdit
            value={topic.title}
            onSave={handleTitleChange}
            placeholder={`Topic ${index + 1} - Click to add title`}
            variant="h6"
            testId={`topic-title-${topic.id}`}
            sx={styles.titleEdit}
          />
          <InlineEdit
            value={topic.description}
            onSave={handleDescriptionChange}
            placeholder="Click to add description ✨"
            variant="body2"
            testId={`topic-desc-${topic.id}`}
            multiline
            sx={styles.descriptionEdit}
          />
        </Box>

        {/* Actions */}
        <Box
          className="topic-actions"
          sx={styles.actionsContainer}
        >
          <Tooltip title="Delete topic">
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

      {/* Lessons */}
      <Collapse in={expanded}>
        <Box sx={styles.lessonsContainer}>
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
            sx={styles.addLessonButton}
          >
            Add Lesson
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
};

const styles = {
  container: {
    ml: { xs: 1.5, sm: 3 },
    mt: 2,
    pl: 2,
    borderLeft: '3px solid',
    borderColor: 'primary.main',
    position: 'relative',
    '&:hover .topic-actions': {
      opacity: 1,
    },
  },
  headerContainer: { 
    display: 'flex', 
    alignItems: 'flex-start', 
    gap: 1 
  },
  expandButton: (expanded: boolean) => ({
    transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
    transition: 'transform 0.2s',
    mt: 0.5,
    p: { xs: 0.5, sm: 1 }
  }),
  contentContainer: { 
    flex: 1, 
    minWidth: 0 
  },
  titleEdit: {
    '& .MuiTypography-root': {
      fontSize: { xs: '1rem', sm: '1.25rem' },
      wordBreak: 'break-word'
    }
  },
  descriptionEdit: { 
    mt: 0.5, 
    ml: 1 
  },
  actionsContainer: {
    opacity: { xs: 1, sm: 0 },
    transition: 'opacity 0.2s ease',
    display: 'flex',
    gap: 0.5,
  },
  deleteButton: { 
    color: 'error.main' 
  },
  lessonsContainer: { 
    mt: 1 
  },
  addLessonButton: {
    ml: { xs: 1, sm: 3 },
    mt: 1,
    color: 'text.secondary',
    textTransform: 'none',
    '&:hover': {
      color: 'primary.main',
      backgroundColor: 'action.hover',
    },
  }
};

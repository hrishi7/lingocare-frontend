import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Collapse, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Module } from '../../types/curriculum.types';
import { InlineEdit } from './InlineEdit';
import { TopicCard } from './TopicCard';
import { useCurriculumContext } from '../../context/CurriculumContext';

/**
 * Props for ModuleCard component.
 */
interface ModuleCardProps {
  /** The module data to display */
  module: Module;
  /** Index of the module in the parent array (for default titles) */
  index: number;
}

/**
 * ModuleCard Component
 * 
 * Displays a collapsible card for a curriculum module, showing its title, description,
 * and list of topics. Provides controls for editing module details, adding topics,
 * and deleting the module. This is a top-level card in the curriculum hierarchy.
 * 
 * @param {ModuleCardProps} props - Component props
 * @returns {JSX.Element} The rendered ModuleCard component
 */
export const ModuleCard: React.FC<ModuleCardProps> = ({ module, index }) => {
  const { dispatch } = useCurriculumContext();
  const [expanded, setExpanded] = useState(true);

  /**
   * Updates the module title in the context.
   * @param {string} title - The new title
   */
  const handleTitleChange = (title: string) => {
    dispatch({
      type: 'UPDATE_MODULE',
      payload: { moduleId: module.id, title },
    });
  };

  /**
   * Updates the module description in the context.
   * @param {string} description - The new description
   */
  const handleDescriptionChange = (description: string) => {
    dispatch({
      type: 'UPDATE_MODULE',
      payload: { moduleId: module.id, description },
    });
  };

  /**
   * Adds a new topic to this module.
   */
  const handleAddTopic = () => {
    dispatch({
      type: 'ADD_TOPIC',
      payload: module.id,
    });
  };

  /**
   * Deletes this module from the curriculum.
   */
  const handleDelete = () => {
    dispatch({
      type: 'DELETE_MODULE',
      payload: module.id,
    });
  };

  return (
    <Card
      data-testid={`module-${module.id}`}
      elevation={0}
      sx={styles.card}
    >
      <CardContent sx={styles.cardContent(expanded)}>
        {/* Module Header */}
        <Box sx={styles.headerContainer}>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'collapse' : 'expand'}
            sx={styles.expandButton(expanded)}
          >
            <ExpandMoreIcon />
          </IconButton>

          <Box sx={styles.contentContainer}>
            <InlineEdit
              value={module.title}
              onSave={handleTitleChange}
              placeholder={`MODULE ${index + 1} — Click to add title`}
              variant="h5"
              testId={`module-title-${module.id}`}
              sx={styles.titleEdit}
            />
            <InlineEdit
              value={module.description}
              onSave={handleDescriptionChange}
              placeholder="Click to Add Description ✨"
              variant="body2"
              testId={`module-desc-${module.id}`}
              multiline
              sx={styles.descriptionEdit}
            />
          </Box>

          {/* Actions */}
          <Box
            className="module-actions"
            sx={styles.actionsContainer}
          >
            <Tooltip title="Delete module">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={styles.deleteButton}
                aria-label="delete"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Topics */}
        <Collapse in={expanded}>
          <Box sx={styles.topicsContainer}>
            {module.topics.map((topic, topicIndex) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                moduleId={module.id}
                index={topicIndex}
              />
            ))}

            {/* Add Topic Button */}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddTopic}
              size="small"
              sx={styles.addTopicButton}
            >
              Add Topic
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

const styles = {
  card: {
    mb: 2,
    border: '1px solid',
    borderColor: 'divider',
    '&:hover': {
      borderColor: 'primary.light',
      boxShadow: '0 4px 12px rgba(236, 134, 1, 0.1)',
    },
    transition: 'all 0.2s ease',
  },
  cardContent: (expanded: boolean) => ({
    pb: expanded ? 2 : '16px !important',
    px: { xs: 1.5, sm: 2 }
  }),
  headerContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1,
    '&:hover .module-actions': {
      opacity: 1,
    },
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
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      color: 'secondary.main',
      fontSize: { xs: '1rem', sm: '1.5rem' },
      wordBreak: 'break-word'
    },
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
  topicsContainer: { 
    mt: 2 
  },
  addTopicButton: {
    ml: { xs: 2, sm: 5 },
    mt: 2,
    color: 'text.secondary',
    textTransform: 'none',
    border: '1px dashed',
    borderColor: 'divider',
    '&:hover': {
      color: 'primary.main',
      borderColor: 'primary.main',
      backgroundColor: 'action.hover',
    },
  }
};

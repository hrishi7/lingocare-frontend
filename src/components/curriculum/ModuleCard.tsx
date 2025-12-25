import React, { useState } from 'react';
import { Box, Button, Card, CardContent, Collapse, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Module } from '../../types/curriculum.types';
import { InlineEdit } from './InlineEdit';
import { TopicCard } from './TopicCard';
import { useCurriculumContext } from '../../context/CurriculumContext';

interface ModuleCardProps {
  module: Module;
  index: number;
}

/**
 * ModuleCard Component
 * 
 * Displays a module with its topics.
 * Top-level card in the curriculum hierarchy.
 */
export const ModuleCard: React.FC<ModuleCardProps> = ({ module, index }) => {
  const { dispatch } = useCurriculumContext();
  const [expanded, setExpanded] = useState(true);

  const handleTitleChange = (title: string) => {
    dispatch({
      type: 'UPDATE_MODULE',
      payload: { moduleId: module.id, title },
    });
  };

  const handleDescriptionChange = (description: string) => {
    dispatch({
      type: 'UPDATE_MODULE',
      payload: { moduleId: module.id, description },
    });
  };

  const handleAddTopic = () => {
    dispatch({
      type: 'ADD_TOPIC',
      payload: module.id,
    });
  };

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
      sx={{
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          borderColor: 'primary.light',
          boxShadow: '0 4px 12px rgba(236, 134, 1, 0.1)',
        },
        transition: 'all 0.2s ease',
      }}
    >
      <CardContent sx={{ pb: expanded ? 2 : '16px !important' }}>
        {/* Module Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 1,
            '&:hover .module-actions': {
              opacity: 1,
            },
          }}
        >
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'collapse' : 'expand'}
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
              value={module.title}
              onSave={handleTitleChange}
              placeholder={`MODULE ${index + 1} — Click to add title`}
              variant="h5"
              testId={`module-title-${module.id}`}
              sx={{
                '& .MuiTypography-root': {
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: 'secondary.main',
                },
              }}
            />
            <InlineEdit
              value={module.description}
              onSave={handleDescriptionChange}
              placeholder="Click to Add Description ✨"
              variant="body2"
              testId={`module-desc-${module.id}`}
              multiline
              sx={{ mt: 0.5, ml: 1 }}
            />
          </Box>

          {/* Actions */}
          <Box
            className="module-actions"
            sx={{
              opacity: 0,
              transition: 'opacity 0.2s ease',
              display: 'flex',
              gap: 0.5,
            }}
          >
            <Tooltip title="Delete module">
              <IconButton
                size="small"
                onClick={handleDelete}
                sx={{ color: 'error.main' }}
                aria-label="delete"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Topics */}
        <Collapse in={expanded}>
          <Box sx={{ mt: 2 }}>
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
              sx={{
                ml: 5,
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
              }}
            >
              Add Topic
            </Button>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

import React from 'react';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';

/**
 * Streaming Progress Component
 * 
 * Shows real-time progress during curriculum generation with streaming.
 * Displays current stage, progress message, and visual indicators.
 */

interface StreamingProgressProps {
  status: string;
  message: string;
  chunksReceived?: number;
}

const getStatusDisplay = (status: string): { label: string; color: 'default' | 'primary' | 'success' } => {
  switch (status) {
    case 'started':
      return { label: 'Starting', color: 'default' };
    case 'parsing_pdf':
      return { label: 'Parsing PDF', color: 'primary' };
    case 'pdf_parsed':
      return { label: 'PDF Parsed', color: 'success' };
    case 'generating_curriculum':
      return { label: 'Generating', color: 'primary' };
    case 'ai_processing':
      return { label: 'AI Processing', color: 'primary' };
    case 'parsing_response':
      return { label: 'Finalizing', color: 'primary' };
    case 'completed':
      return { label: 'Complete', color: 'success' };
    default:
      return { label: 'Processing', color: 'primary' };
  }
};

export const StreamingProgress: React.FC<StreamingProgressProps> = ({ 
  status, 
  message, 
  chunksReceived = 0 
}) => {
  const statusDisplay = getStatusDisplay(status);
  const isActive = !['completed', 'pdf_parsed'].includes(status);

  return (
    <Box sx={styles.container}>
      {/* Header with status chip */}
      <Box sx={styles.header}>
        <Chip
          icon={statusDisplay.color === 'success' ? <CheckCircleIcon /> : <AutorenewIcon />}
          label={statusDisplay.label}
          color={statusDisplay.color}
          size="small"
          sx={styles.chip}
        />
        {chunksReceived > 0 && (
          <Typography variant="caption" color="text.secondary">
            {chunksReceived} chunks received
          </Typography>
        )}
      </Box>

      {/* Progress message */}
      <Typography variant="body2" sx={styles.message}>
        {message}
      </Typography>

      {/* Progress bar */}
      {isActive && (
        <LinearProgress sx={styles.progress} />
      )}
    </Box>
  );
};

const styles = {
  container: {
    p: 2,
    borderRadius: 2,
    bgcolor: 'background.paper',
    border: '1px solid',
    borderColor: 'divider',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 1,
  },
  chip: {
    fontWeight: 600,
  },
  message: {
    mb: 1.5,
    color: 'text.primary',
  },
  progress: {
    borderRadius: 1,
    height: 6,
  },
};

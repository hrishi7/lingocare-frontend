import React from 'react';
import { Box, LinearProgress, Typography, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutorenewIcon from '@mui/icons-material/Autorenew';

/**
 * Streaming Progress Component
 * 
 * Shows real-time progress during curriculum generation with streaming.
 * Displays current stage, progress message, and factual stats.
 */

interface StreamingProgressProps {
  status: string;
  message: string;
  chunksReceived?: number;
  modulesGenerated?: number;
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
  chunksReceived = 0,
  modulesGenerated = 0,
}) => {
  const statusDisplay = getStatusDisplay(status);
  const isActive = !['completed', 'error'].includes(status);

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
        <Box sx={{ display: 'flex', gap: 2 }}>
          {modulesGenerated > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {modulesGenerated} modules
            </Typography>
          )}
          <Typography variant="caption" color="text.secondary">
            {chunksReceived} chunks
          </Typography>
        </Box>
      </Box>

      {/* Progress message */}
      <Typography variant="body2" sx={styles.message}>
        {message}
      </Typography>

      {/* Determinate bar only when active */}
      {isActive && (
        <LinearProgress 
          variant="indeterminate"
          sx={styles.progress} 
        />
      )}
    </Box>
  );
};

const styles = {
  container: {
    p: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: 3,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    border: '1px solid',
    borderColor: 'divider',
    width: '100%',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 2,
  },
  chip: {
    fontWeight: 700,
  },
  message: {
    mb: 2,
    color: 'text.primary',
    fontWeight: 500,
  },
  progress: {
    borderRadius: 2,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
};

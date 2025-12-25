import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

/**
 * LoadingSkeleton Component
 * 
 * Displays placeholder skeletons while modules are being generated.
 * Provides visual feedback during initial upload before first module arrives.
 */
export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          elevation={0}
          sx={{
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
            opacity: 0.6,
          }}
        >
          <CardContent sx={{ px: { xs: 1.5, sm: 2 } }}>
            {/* Module header skeleton */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="80%" height={24} sx={{ mt: 0.5 }} />
              </Box>
            </Box>
            
            {/* Topic skeletons */}
            <Box sx={{ ml: { xs: 2, sm: 5 } }}>
              {Array.from({ length: 2 }).map((_, topicIdx) => (
                <Box key={topicIdx} sx={{ mb: 2 }}>
                  <Skeleton variant="text" width="50%" height={32} />
                  <Skeleton variant="text" width="70%" height={20} sx={{ mt: 0.5 }} />
                  
                  {/* Lesson skeletons */}
                  <Box sx={{ ml: 2, mt: 1 }}>
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

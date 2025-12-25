import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import theme from './theme';
import { CurriculumProvider } from './context/CurriculumContext';
import { CurriculumEditor } from './components/curriculum/CurriculumEditor';

/**
 * App Component
 * 
 * Root component that sets up providers and layout.
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CurriculumProvider>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          {/* Header */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={{ 
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Toolbar>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Lingo
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'secondary.main',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Care
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 500 }}>
                Programs
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <CurriculumEditor />
        </Box>
      </CurriculumProvider>
    </ThemeProvider>
  );
}

export default App;

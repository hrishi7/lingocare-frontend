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
            <Toolbar sx={{ flexWrap: 'wrap', minHeight: { xs: 56, sm: 64 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: 'primary.main',
                    letterSpacing: '-0.5px',
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
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
                    fontSize: { xs: '1.25rem', sm: '1.5rem' }
                  }}
                >
                  Care
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'text.primary', 
                  fontWeight: 500,
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
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

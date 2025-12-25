import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import theme from './theme';
import { CurriculumProvider } from './context/CurriculumContext';
import { CurriculumEditor } from './components/curriculum/CurriculumEditor';

/**
 * App Component
 * 
 * The root component of the application. It sets up the global theme provider,
 * CSS baseline, and the main layout structure including the header and
 * main content area.
 * 
 * @returns {JSX.Element} The rendered App component.
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CurriculumProvider>
        <Box sx={styles.container}>
          {/* Header */}
          <AppBar 
            position="static" 
            elevation={0}
            sx={styles.appBar}
          >
            <Toolbar sx={styles.toolbar}>
              <Box sx={styles.logoContainer}>
                <Typography
                  variant="h5"
                  sx={styles.logoTextLingo}
                >
                  Lingo
                </Typography>
                <Typography
                  variant="h5"
                  sx={styles.logoTextCare}
                >
                  Care
                </Typography>
              </Box>
              <Box sx={styles.spacer} />
              <Typography 
                variant="h6" 
                sx={styles.programsText}
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

const styles = {
  container: { 
    minHeight: '100vh', 
    backgroundColor: 'background.default' 
  },
  appBar: { 
    backgroundColor: 'background.paper',
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
  toolbar: { 
    flexWrap: 'wrap' as const, 
    minHeight: { xs: 56, sm: 64 } 
  },
  logoContainer: { 
    display: 'flex', 
    alignItems: 'center', 
  },
  logoTextLingo: {
    fontWeight: 700,
    color: 'primary.main',
    letterSpacing: '-0.5px',
    fontSize: { xs: '1.25rem', sm: '1.5rem' }
  },
  logoTextCare: {
    fontWeight: 700,
    color: 'secondary.main',
    letterSpacing: '-0.5px',
    fontSize: { xs: '1.25rem', sm: '1.5rem' }
  },
  spacer: { 
    flexGrow: 1 
  },
  programsText: { 
    color: 'text.primary', 
    fontWeight: 500,
    fontSize: { xs: '1rem', sm: '1.25rem' }
  }
};

export default App;

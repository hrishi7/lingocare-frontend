import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { CurriculumEditor } from './CurriculumEditor';
import theme from '../../theme';
import { api } from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  api: {
    generateCurriculum: vi.fn(),
    generateCurriculumStream: vi.fn(),
  },
}));

// Create a mock for useCurriculumContext
const mockDispatch = vi.fn();
const mockSetIsLoading = vi.fn();

// Variable to control returned curriculum state in tests
let mockCurriculumState = {
  curriculum: { modules: [] },
  dispatch: mockDispatch,
  isLoading: false,
  setIsLoading: mockSetIsLoading,
};

vi.mock('../../context/CurriculumContext', () => ({
  useCurriculumContext: () => mockCurriculumState,
}));

// Mock child components to simplify testing
vi.mock('./ModuleCard', () => ({
  ModuleCard: ({ module }: any) => <div data-testid="module-card">{module.title}</div>,
}));

vi.mock('../common/UploadDialog', () => ({
  UploadDialog: ({ open, onUpload }: any) => (
    open ? (
      <div data-testid="upload-dialog">
        <button onClick={() => onUpload(new File([''], 'test.pdf'))}>Confirm Upload</button>
      </div>
    ) : null
  ),
}));

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('CurriculumEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCurriculumState = {
      curriculum: { modules: [] },
      dispatch: mockDispatch,
      isLoading: false,
      setIsLoading: mockSetIsLoading,
    };
  });

  it('renders empty state initially', () => {
    renderWithTheme(<CurriculumEditor />);
    expect(screen.getByText('No modules yet')).toBeInTheDocument();
    expect(screen.getByText('Start building your curriculum by adding a module or uploading a PDF')).toBeInTheDocument();
  });

  it('renders modules when available', () => {
    mockCurriculumState = {
      ...mockCurriculumState,
      curriculum: {
        modules: [
          { id: '1', title: 'Module 1', topics: [] },
          { id: '2', title: 'Module 2', topics: [] },
        ] as any,
      },
    };

    renderWithTheme(<CurriculumEditor />);
    expect(screen.queryByText('No modules yet')).not.toBeInTheDocument();
    expect(screen.getByText('Module 1')).toBeInTheDocument();
    expect(screen.getByText('Module 2')).toBeInTheDocument();
  });

  it('dispatches ADD_MODULE when add button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CurriculumEditor />);

    // There are multiple add buttons in empty state
    const addButtons = screen.getAllByText('Add Module');
    await user.click(addButtons[0]);

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'ADD_MODULE' });
  });

  it('opens upload dialog when upload button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(<CurriculumEditor />);

    const uploadButton = screen.getByText('Upload PDF');
    await user.click(uploadButton);

    expect(screen.getByTestId('upload-dialog')).toBeInTheDocument();
  });

  it('handles file upload processing', async () => {
    const user = userEvent.setup();
    const mockResult = {
        curriculum: { modules: [{ id: 'new', title: 'Generated Module' }] },
        aiProvider: 'Gemini'
    };
    
    // Mock the implementation of generateCurriculumStream to simulate success
    (api.generateCurriculumStream as any).mockImplementation(async () => {
        // Simulate progress/chunks if needed, or just return the result
        return mockResult;
    });


    renderWithTheme(<CurriculumEditor />);

    // Open dialog
    await user.click(screen.getByText('Upload PDF'));
    
    // Trigger upload from mock dialog
    await user.click(screen.getByText('Confirm Upload'));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    
    await waitFor(() => {
         expect(api.generateCurriculumStream).toHaveBeenCalled();
    });

    expect(mockDispatch).toHaveBeenCalledWith({
        type: 'SET_CURRICULUM',
        payload: mockResult.curriculum
    });
    
    expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    expect(screen.getByText(/Curriculum generated successfully/)).toBeInTheDocument();
  });

  it('handles upload errors gracefully', async () => {
    const user = userEvent.setup();
    const errorMsg = 'Upload failed';
    (api.generateCurriculumStream as any).mockRejectedValue(new Error(errorMsg));

    renderWithTheme(<CurriculumEditor />);

    await user.click(screen.getByText('Upload PDF'));
    await user.click(screen.getByText('Confirm Upload'));

     await waitFor(() => {
         expect(mockSetIsLoading).toHaveBeenCalledWith(false);
    });

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });
});

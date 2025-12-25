import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import { LessonCard } from './LessonCard';
import theme from '../../theme';

// Mock the context hook
const mockDispatch = vi.fn();
vi.mock('../../context/CurriculumContext', () => ({
  useCurriculumContext: () => ({
    dispatch: mockDispatch,
  }),
}));

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('LessonCard', () => {
  const mockLesson = {
    id: 'lesson-1',
    title: 'Test Lesson',
    description: 'Test Description',
    content: 'Test Content',
  };
  const moduleId = 'module-1';
  const topicId = 'topic-1';

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('renders lesson details', () => {
    renderWithTheme(
      <LessonCard
        lesson={mockLesson}
        moduleId={moduleId}
        topicId={topicId}
        index={0}
      />
    );

    expect(screen.getByText('Test Lesson')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls dispatch when title is updated', () => {
    renderWithTheme(
      <LessonCard
        lesson={mockLesson}
        moduleId={moduleId}
        topicId={topicId}
        index={0}
      />
    );

    const titleElement = screen.getByText('Test Lesson');
    fireEvent.click(titleElement);
    
    // InlineEdit uses contentEditable
    const editableDiv = titleElement.closest('[data-testid^="lesson-title"]')?.querySelector('[contenteditable]');
    if (editableDiv) {
        // Use textContent for JSDOM compatibility
      editableDiv.textContent = 'Updated Title';
      fireEvent.blur(editableDiv);
    }

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_LESSON',
      payload: {
        moduleId,
        topicId,
        lessonId: mockLesson.id,
        title: 'Updated Title',
      },
    });
  });

  it('calls dispatch when description is updated', () => {
     renderWithTheme(
      <LessonCard
        lesson={mockLesson}
        moduleId={moduleId}
        topicId={topicId}
        index={0}
      />
    );

    const descElement = screen.getByText('Test Description');
    fireEvent.click(descElement);
    
    const editableDiv = descElement.closest('[data-testid^="lesson-desc"]')?.querySelector('[contenteditable]');
    if (editableDiv) {
      editableDiv.textContent = 'Updated Description';
      fireEvent.blur(editableDiv);
    }

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_LESSON',
      payload: {
        moduleId,
        topicId,
        lessonId: mockLesson.id,
        description: 'Updated Description',
      },
    });
  });

  it('calls dispatch when delete button is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <LessonCard
        lesson={mockLesson}
        moduleId={moduleId}
        topicId={topicId}
        index={0}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete lesson/i });
    await user.click(deleteButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'DELETE_LESSON',
      payload: {
        moduleId,
        topicId,
        lessonId: mockLesson.id,
      },
    });
  });
});

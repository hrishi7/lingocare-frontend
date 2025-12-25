import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import theme from '../../theme';
import { InlineEdit } from './InlineEdit';

const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe('InlineEdit', () => {
  const mockOnSave = vi.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('renders with initial value', () => {
    renderWithTheme(
      <InlineEdit value="Test Title" onSave={mockOnSave} testId="inline-edit" />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders placeholder when value is empty', () => {
    renderWithTheme(
      <InlineEdit
        value=""
        onSave={mockOnSave}
        placeholder="Click to add..."
        testId="inline-edit"
      />
    );

    expect(screen.getByText('Click to add...')).toBeInTheDocument();
  });

  it('becomes editable on click', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <InlineEdit value="Test" onSave={mockOnSave} testId="inline-edit" />
    );

    const element = screen.getByTestId('inline-edit');
    await user.click(element);

    const editableDiv = element.querySelector('[contenteditable="true"]');
    expect(editableDiv).toBeInTheDocument();
  });

  it('calls onSave when blurred with new value', async () => {
    renderWithTheme(
      <InlineEdit value="Original" onSave={mockOnSave} testId="inline-edit" />
    );

    const element = screen.getByTestId('inline-edit');
    fireEvent.click(element);

    const editableDiv = element.querySelector('[contenteditable="true"]');
    if (editableDiv) {
      editableDiv.textContent = 'New Value';
      fireEvent.blur(editableDiv);
    }

    expect(mockOnSave).toHaveBeenCalledWith('New Value');
  });

  it('does not call onSave when value unchanged', async () => {
    renderWithTheme(
      <InlineEdit value="Same" onSave={mockOnSave} testId="inline-edit" />
    );

    const element = screen.getByTestId('inline-edit');
    fireEvent.click(element);

    const editableDiv = element.querySelector('[contenteditable]');
    if (editableDiv) {
      fireEvent.blur(editableDiv);
    }

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('cancels edit on Escape key press', async () => {
    renderWithTheme(
      <InlineEdit value="Original" onSave={mockOnSave} testId="inline-edit" />
    );

    const element = screen.getByTestId('inline-edit');
    fireEvent.click(element);

    const editableDiv = element.querySelector('[contenteditable="true"]');
    if (editableDiv) {
      editableDiv.textContent = 'Changed';
      fireEvent.keyDown(editableDiv, { key: 'Escape' });
    }

    expect(screen.getByText('Original')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('shows edit icon on hover', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <InlineEdit value="Test" onSave={mockOnSave} testId="inline-edit" />
    );

    const element = screen.getByTestId('inline-edit');
    await user.hover(element);

    // Edit icon should have opacity changed via CSS
    const editIcon = element.querySelector('.inline-edit-icon');
    expect(editIcon).toBeInTheDocument();
  });
});

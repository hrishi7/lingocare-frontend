import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import theme from '../../theme';
import { ModuleCard } from './ModuleCard';
import { CurriculumProvider } from '../../context/CurriculumContext';
import type { Module } from '../../types/curriculum.types';

const mockModule: Module = {
  id: 'module-1',
  title: 'Module 1 - Introduction',
  description: 'Module description',
  topics: [],
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={theme}>
      <CurriculumProvider>{ui}</CurriculumProvider>
    </ThemeProvider>
  );
};

describe('ModuleCard', () => {
  it('renders module title and description', () => {
    renderWithProviders(<ModuleCard module={mockModule} index={0} />);

    expect(screen.getByText('Module 1 - Introduction')).toBeInTheDocument();
    expect(screen.getByText('Module description')).toBeInTheDocument();
  });

  it('shows add topic button', () => {
    renderWithProviders(<ModuleCard module={mockModule} index={0} />);

    expect(screen.getByRole('button', { name: /add topic/i })).toBeInTheDocument();
  });

  it('shows expand/collapse button', () => {
    renderWithProviders(<ModuleCard module={mockModule} index={0} />);

    expect(screen.getByRole('button', { name: /collapse/i })).toBeInTheDocument();
  });

  it('collapses content when expand button clicked', async () => {
    const user = userEvent.setup();
    const moduleWithTopics: Module = {
      ...mockModule,
      topics: [
        { id: 'topic-1', title: 'Topic 1', description: '', lessons: [] },
      ],
    };
    
    renderWithProviders(<ModuleCard module={moduleWithTopics} index={0} />);

    const expandButton = screen.getByRole('button', { name: /collapse/i });
    await user.click(expandButton);

    // After collapse, the button should show "expand"
    expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument();
  });

  it('shows delete button on hover', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ModuleCard module={mockModule} index={0} />);

    const card = screen.getByTestId(`module-${mockModule.id}`);
    await user.hover(card);

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders topics when module has topics', () => {
    const moduleWithTopics: Module = {
      ...mockModule,
      topics: [
        { id: 'topic-1', title: 'Topic 1', description: '', lessons: [] },
        { id: 'topic-2', title: 'Topic 2', description: '', lessons: [] },
      ],
    };

    renderWithProviders(<ModuleCard module={moduleWithTopics} index={0} />);

    expect(screen.getByText('Topic 1')).toBeInTheDocument();
    expect(screen.getByText('Topic 2')).toBeInTheDocument();
  });
});

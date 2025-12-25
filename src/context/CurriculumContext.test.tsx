import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CurriculumProvider, useCurriculumContext, curriculumReducer, initialCurriculum } from './CurriculumContext';
import type { Curriculum, CurriculumAction } from '../types/curriculum.types';

describe('CurriculumContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <CurriculumProvider>{children}</CurriculumProvider>
  );

  it('provides initial empty curriculum', () => {
    const { result } = renderHook(() => useCurriculumContext(), { wrapper });

    expect(result.current.curriculum.title).toBe('');
    expect(result.current.curriculum.modules).toEqual([]);
  });

  it('updates curriculum title', () => {
    const { result } = renderHook(() => useCurriculumContext(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'UPDATE_CURRICULUM_TITLE', payload: 'New Title' });
    });

    expect(result.current.curriculum.title).toBe('New Title');
  });

  it('adds a new module', () => {
    const { result } = renderHook(() => useCurriculumContext(), { wrapper });

    act(() => {
      result.current.dispatch({ type: 'ADD_MODULE' });
    });

    expect(result.current.curriculum.modules).toHaveLength(1);
    expect(result.current.curriculum.modules[0].title).toBe('Module 1');
  });

  it('throws error when used outside provider', () => {
    expect(() => {
      renderHook(() => useCurriculumContext());
    }).toThrow('useCurriculumContext must be used within a CurriculumProvider');
  });
});

describe('curriculumReducer', () => {
  it('handles SET_CURRICULUM action', () => {
    const newCurriculum: Curriculum = {
      id: 'test-id',
      title: 'Test Curriculum',
      description: 'Test description',
      modules: [],
    };

    const action: CurriculumAction = { type: 'SET_CURRICULUM', payload: newCurriculum };
    const result = curriculumReducer(initialCurriculum, action);

    expect(result).toEqual(newCurriculum);
  });

  it('handles ADD_MODULE action', () => {
    const action: CurriculumAction = { type: 'ADD_MODULE' };
    const result = curriculumReducer(initialCurriculum, action);

    expect(result.modules).toHaveLength(1);
    expect(result.modules[0].id).toBeDefined();
    expect(result.modules[0].topics).toEqual([]);
  });

  it('handles DELETE_MODULE action', () => {
    const stateWithModule: Curriculum = {
      ...initialCurriculum,
      modules: [{ id: 'mod1', title: 'Module 1', description: '', topics: [] }],
    };

    const action: CurriculumAction = { type: 'DELETE_MODULE', payload: 'mod1' };
    const result = curriculumReducer(stateWithModule, action);

    expect(result.modules).toHaveLength(0);
  });

  it('handles ADD_TOPIC action', () => {
    const stateWithModule: Curriculum = {
      ...initialCurriculum,
      modules: [{ id: 'mod1', title: 'Module 1', description: '', topics: [] }],
    };

    const action: CurriculumAction = { type: 'ADD_TOPIC', payload: 'mod1' };
    const result = curriculumReducer(stateWithModule, action);

    expect(result.modules[0].topics).toHaveLength(1);
    expect(result.modules[0].topics[0].title).toBe('Topic 1');
  });

  it('handles ADD_LESSON action', () => {
    const stateWithTopic: Curriculum = {
      ...initialCurriculum,
      modules: [{
        id: 'mod1',
        title: 'Module 1',
        description: '',
        topics: [{ id: 'top1', title: 'Topic 1', description: '', lessons: [] }],
      }],
    };

    const action: CurriculumAction = {
      type: 'ADD_LESSON',
      payload: { moduleId: 'mod1', topicId: 'top1' },
    };
    const result = curriculumReducer(stateWithTopic, action);

    expect(result.modules[0].topics[0].lessons).toHaveLength(1);
    expect(result.modules[0].topics[0].lessons[0].title).toBe('Lesson 1');
  });

  it('handles UPDATE_MODULE action', () => {
    const stateWithModule: Curriculum = {
      ...initialCurriculum,
      modules: [{ id: 'mod1', title: 'Old Title', description: '', topics: [] }],
    };

    const action: CurriculumAction = {
      type: 'UPDATE_MODULE',
      payload: { moduleId: 'mod1', title: 'New Title' },
    };
    const result = curriculumReducer(stateWithModule, action);

    expect(result.modules[0].title).toBe('New Title');
  });
});

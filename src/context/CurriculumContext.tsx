import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { Curriculum, CurriculumAction, Module, Topic, Lesson } from '../types/curriculum.types';
import { generateId } from '../utils/generateId';

/**
 * Initial curriculum state
 */
const initialCurriculum: Curriculum = {
  id: generateId(),
  title: '',
  description: '',
  modules: [],
};

/**
 * Curriculum Reducer
 * 
 * Handles all state updates for the curriculum.
 * Using useReducer for complex nested state management.
 * 
 * Interview Point: "useReducer is better than useState for complex nested state
 * because it centralizes update logic and makes state transitions predictable."
 */
function curriculumReducer(state: Curriculum, action: CurriculumAction): Curriculum {
  switch (action.type) {
    case 'SET_CURRICULUM':
      return action.payload;

    case 'RESET_FOR_PROGRESSIVE':
      // Reset curriculum for progressive rendering
      return {
        ...initialCurriculum,
        id: generateId(),
      };

    case 'ADD_PROGRESSIVE_MODULE':
      // Add module progressively as it arrives from stream
      return {
        ...state,
        modules: [...state.modules, action.payload],
      };

    case 'UPDATE_CURRICULUM_TITLE':
      return { ...state, title: action.payload };

    case 'UPDATE_CURRICULUM_DESCRIPTION':
      return { ...state, description: action.payload };

    case 'ADD_MODULE': {
      const newModule: Module = {
        id: generateId(),
        title: `Module ${state.modules.length + 1}`,
        description: '',
        topics: [],
      };
      return { ...state, modules: [...state.modules, newModule] };
    }

    case 'UPDATE_MODULE':
      return {
        ...state,
        modules: state.modules.map(module =>
          module.id === action.payload.moduleId
            ? { 
                ...module, 
                ...(action.payload.title !== undefined && { title: action.payload.title }),
                ...(action.payload.description !== undefined && { description: action.payload.description }),
              }
            : module
        ),
      };

    case 'DELETE_MODULE':
      return {
        ...state,
        modules: state.modules.filter(module => module.id !== action.payload),
      };

    case 'ADD_TOPIC': {
      return {
        ...state,
        modules: state.modules.map(module => {
          if (module.id !== action.payload) return module;
          const newTopic: Topic = {
            id: generateId(),
            title: `Topic ${module.topics.length + 1}`,
            description: '',
            lessons: [],
          };
          return { ...module, topics: [...module.topics, newTopic] };
        }),
      };
    }

    case 'UPDATE_TOPIC':
      return {
        ...state,
        modules: state.modules.map(module => {
          if (module.id !== action.payload.moduleId) return module;
          return {
            ...module,
            topics: module.topics.map(topic =>
              topic.id === action.payload.topicId
                ? {
                    ...topic,
                    ...(action.payload.title !== undefined && { title: action.payload.title }),
                    ...(action.payload.description !== undefined && { description: action.payload.description }),
                  }
                : topic
            ),
          };
        }),
      };

    case 'DELETE_TOPIC':
      return {
        ...state,
        modules: state.modules.map(module => {
          if (module.id !== action.payload.moduleId) return module;
          return {
            ...module,
            topics: module.topics.filter(topic => topic.id !== action.payload.topicId),
          };
        }),
      };

    case 'ADD_LESSON': {
      return {
        ...state,
        modules: state.modules.map(module => {
          if (module.id !== action.payload.moduleId) return module;
          return {
            ...module,
            topics: module.topics.map(topic => {
              if (topic.id !== action.payload.topicId) return topic;
              const newLesson: Lesson = {
                id: generateId(),
                title: `Lesson ${topic.lessons.length + 1}`,
                description: '',
              };
              return { ...topic, lessons: [...topic.lessons, newLesson] };
            }),
          };
        }),
      };
    }

    case 'UPDATE_LESSON':
      return {
        ...state,
        modules: state.modules.map(module => {
          if (module.id !== action.payload.moduleId) return module;
          return {
            ...module,
            topics: module.topics.map(topic => {
              if (topic.id !== action.payload.topicId) return topic;
              return {
                ...topic,
                lessons: topic.lessons.map(lesson =>
                  lesson.id === action.payload.lessonId
                    ? {
                        ...lesson,
                        ...(action.payload.title !== undefined && { title: action.payload.title }),
                        ...(action.payload.description !== undefined && { description: action.payload.description }),
                      }
                    : lesson
                ),
              };
            }),
          };
        }),
      };

    case 'DELETE_LESSON':
      return {
        ...state,
        modules: state.modules.map(module => {
          if (module.id !== action.payload.moduleId) return module;
          return {
            ...module,
            topics: module.topics.map(topic => {
              if (topic.id !== action.payload.topicId) return topic;
              return {
                ...topic,
                lessons: topic.lessons.filter(lesson => lesson.id !== action.payload.lessonId),
              };
            }),
          };
        }),
      };

    default:
      return state;
  }
}

/**
 * Context Type
 */
interface CurriculumContextType {
  curriculum: Curriculum;
  dispatch: React.Dispatch<CurriculumAction>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const CurriculumContext = createContext<CurriculumContextType | null>(null);

/**
 * Curriculum Provider Component
 */
export const CurriculumProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [curriculum, dispatch] = useReducer(curriculumReducer, initialCurriculum);
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <CurriculumContext.Provider value={{ curriculum, dispatch, isLoading, setIsLoading }}>
      {children}
    </CurriculumContext.Provider>
  );
};

/**
 * Custom hook to use curriculum context
 */
export const useCurriculumContext = (): CurriculumContextType => {
  const context = useContext(CurriculumContext);
  if (!context) {
    throw new Error('useCurriculumContext must be used within a CurriculumProvider');
  }
  return context;
};

export { curriculumReducer, initialCurriculum };

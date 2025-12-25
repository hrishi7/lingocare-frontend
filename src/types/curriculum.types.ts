/**
 * Curriculum Type Definitions
 * Shared between frontend and backend
 */

export interface Lesson {
  id: string;
  title: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Curriculum {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

/**
 * Action types for curriculum reducer
 */
export type CurriculumAction =
  | { type: 'SET_CURRICULUM'; payload: Curriculum }
  | { type: 'UPDATE_CURRICULUM_TITLE'; payload: string }
  | { type: 'UPDATE_CURRICULUM_DESCRIPTION'; payload: string }
  | { type: 'ADD_MODULE' }
  | { type: 'UPDATE_MODULE'; payload: { moduleId: string; title?: string; description?: string } }
  | { type: 'DELETE_MODULE'; payload: string }
  | { type: 'ADD_TOPIC'; payload: string }
  | { type: 'UPDATE_TOPIC'; payload: { moduleId: string; topicId: string; title?: string; description?: string } }
  | { type: 'DELETE_TOPIC'; payload: { moduleId: string; topicId: string } }
  | { type: 'ADD_LESSON'; payload: { moduleId: string; topicId: string } }
  | { type: 'UPDATE_LESSON'; payload: { moduleId: string; topicId: string; lessonId: string; title?: string; description?: string } }
  | { type: 'DELETE_LESSON'; payload: { moduleId: string; topicId: string; lessonId: string } };

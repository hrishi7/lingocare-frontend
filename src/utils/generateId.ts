import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID using UUID v4
 */
export const generateId = (): string => uuidv4();

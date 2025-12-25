/**
 * Incremental JSON Parser for Progressive Rendering
 * 
 * Extracts complete modules from partial JSON as the stream arrives.
 * This enables progressive rendering where modules appear as they're generated.
 */

import type { Module } from '../types/curriculum.types';

/**
 * State for incremental parsing
 */
interface ParseState {
  completeModules: Module[];
  lastParsedIndex: number;
}

/**
 * Extract complete modules from partial JSON string
 * 
 * Strategy:
 * 1. Find the "modules" array in the JSON
 * 2. Extract complete module objects (those with closing braces)
 * 3. Return modules that haven't been parsed yet
 * 
 * @param partialJSON - Accumulated JSON string from stream
 * @param state - Parsing state to track progress
 * @returns New complete modules
 */
export function extractCompleteModules(
  partialJSON: string,
  state: ParseState = { completeModules: [], lastParsedIndex: 0 }
): { modules: Module[]; state: ParseState } {
  try {
    // Find the modules array start
    const modulesMatch = partialJSON.match(/"modules"\s*:\s*\[/);
    if (!modulesMatch) {
      return { modules: [], state };
    }

    const modulesStartIndex = modulesMatch.index! + modulesMatch[0].length;
    const remainingJSON = partialJSON.substring(modulesStartIndex);
    
    // Extract complete module objects
    const newModules: Module[] = [];
    let depth = 0;
    let currentModuleStart = -1;
    let inString = false;
    let escapeNext = false;

    for (let i = state.lastParsedIndex; i < remainingJSON.length; i++) {
      const char = remainingJSON[i];

      // Track string boundaries
      if (char === '"' && !escapeNext) {
        inString = !inString;
      }
      escapeNext = char === '\\' && !escapeNext;

      if (inString) continue;

      // Track object depth
      if (char === '{') {
        if (depth === 0) {
          currentModuleStart = i;
        }
        depth++;
      } else if (char === '}') {
        depth--;
        
        // Complete module found
        if (depth === 0 && currentModuleStart !== -1) {
          const moduleJSON = remainingJSON.substring(currentModuleStart, i + 1);
          
          try {
            const module = JSON.parse(moduleJSON) as Module;
            
            // Add ID if missing (will be replaced by backend's ID later)
            if (!module.id) {
              module.id = `temp-${Date.now()}-${newModules.length}`;
            }
            
            newModules.push(module);
            state.lastParsedIndex = i + 1;
          } catch (parseError) {
            // Incomplete module, stop here
            break;
          }
          
          currentModuleStart = -1;
        }
      }
    }

    return {
      modules: newModules,
      state: {
        completeModules: [...state.completeModules, ...newModules],
        lastParsedIndex: state.lastParsedIndex,
      },
    };
  } catch (error) {
    console.error('Error in incremental parsing:', error);
    return { modules: [], state };
  }
}

/**
 * Try to parse complete JSON when stream is done
 * This is the fallback for final complete curriculum
 */
export function parseCompleteJSON(jsonString: string): any {
  try {
    // Remove markdown code blocks if present
    let cleaned = jsonString;
    const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      cleaned = jsonMatch[1];
    }

    // Find JSON object boundaries
    const startIndex = cleaned.indexOf('{');
    const endIndex = cleaned.lastIndexOf('}');
    
    if (startIndex !== -1 && endIndex !== -1) {
      cleaned = cleaned.substring(startIndex, endIndex + 1);
    }

    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse complete JSON:', error);
    throw error;
  }
}

/**
 * Estimate progress based on JSON structure
 */
export function estimateProgress(partialJSON: string): number {
  // Count opening vs closing braces in modules array
  const modulesMatch = partialJSON.match(/"modules"\s*:\s*\[([\s\S]*)/);
  if (!modulesMatch) return 0;

  const modulesContent = modulesMatch[1];
  const openBraces = (modulesContent.match(/{/g) || []).length;
  const closeBraces = (modulesContent.match(/}/g) || []).length;

  // Rough estimate: each module is ~100 braces
  const estimatedTotalModules = Math.max(3, Math.ceil(openBraces / 100));
  const completedModules = Math.floor(closeBraces / 100);

  return Math.min(95, (completedModules / estimatedTotalModules) * 100);
}

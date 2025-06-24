/**
 * This file is deprecated. Please use errorHandler.js instead.
 * 
 * @deprecated Use the errorHandler.js middleware for error handling
 */

// Importing from the main error handler file to maintain compatibility
import { errorHandler, notFound } from './errorHandler.js';

// Re-exporting to maintain backward compatibility
export { errorHandler, notFound };

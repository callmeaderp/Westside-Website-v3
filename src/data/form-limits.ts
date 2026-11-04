/** Keep optional inline resumes below Graph's 3 MB simple-attachment threshold. */
export const MAX_RESUME_MB = 2;
export const MAX_RESUME_BYTES = MAX_RESUME_MB * 1024 * 1024;
/**
 * Career applications may attach up to this many résumé files (for example a
 * photo of each page of a paper résumé). MAX_RESUME_BYTES is their combined cap.
 */
export const MAX_RESUME_FILES = 3;

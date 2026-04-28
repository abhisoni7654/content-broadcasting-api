// This wrapper catches any errors in async functions and passes them to the next() middleware
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
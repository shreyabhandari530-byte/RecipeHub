function errorHandler(err, req, res, next) {
  console.error('API Error:', err.message || err);

  // SQLite constraints error handling
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry: you have already performed this action.'
    });
  }

  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    return res.status(404).json({
      success: false,
      message: 'Referenced recipe does not exist.'
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Internal server error. Please try again later.' 
      : message
  });
}

module.exports = errorHandler;

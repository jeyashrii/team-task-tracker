const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: statusCode,
    code: err.code,
    message: err.message,
  });
};

module.exports = errorMiddleware;

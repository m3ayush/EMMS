const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', '), data: null });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `Duplicate value for ${field}`, data: null });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    data: null,
  });
};

module.exports = errorHandler;

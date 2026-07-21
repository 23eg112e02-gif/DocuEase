export const validate = (schema, property = 'body') => (req, res, next) => {
  const parsed = schema.safeParse(req[property]);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parsed.error.flatten()
    });
  }

  req[property] = parsed.data;
  return next();
};

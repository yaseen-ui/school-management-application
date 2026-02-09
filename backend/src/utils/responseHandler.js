/**
 * Common Response Handler
 *
 * @param {string} status - "success" or "fail"
 * @param {object|null} data - Response data (can be null)
 * @param {string|null} message - Response message (can be null)
 */
const responseHandler = (res, status, data = null, message = null) => {
  res.status(status === "success" ? 200 : 400).json({
    status,
    data,
    message,
  });
};

export default responseHandler;

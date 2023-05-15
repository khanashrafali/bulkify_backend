// handle middleware errors
const errorHandler = (err, req, res, next) => {
    console.log(err,err.code);
    if(err.field=='document') {
      let message = "Document should be maximum 2 file";
      let statusCode = err.statusCode || 500;
      let status = err.status || false;
      let data = err.data || null;
      res.status(statusCode).json({ message, statusCode, status, data });
    }
    let message = err.message || "An Error Occured!";
    let statusCode = err.statusCode || 500;
    let status = err.status || false;
    let data = err.data || null;
    res.status(statusCode).json({ message, statusCode, status, data });
  };
  
  // handle api's 404 routes
  const handle404 = (req, res, next) => {
    let message = "URL not Found!";
    let statusCode = 404;
    let status = false;
    let data = null;
    res.status(statusCode).json({ message, statusCode, status, data });
  };
  
  module.exports = {
    errorHandler,
    handle404,
  };
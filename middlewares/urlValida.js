const { URL } = require("url");

const validarUrl = (req, res, next) => {
  try {
    const { origin } = req.body;
    const urlFrontend = new URL(origin);
    if (urlFrontend.origin !== "null") {
      if (
        urlFrontend.protocol === "http:" ||
        urlFrontend.protocol === "https:"
      ) {
        return next();
      }
    }
    throw new Error('Debe conterner https://')
  } catch (error) {
    console.log(error);
    if(error.message === 'Invalid URL'){
      req.flash('mensajes', [{msg: 'Url no válida'}])
    }else{
      req.flash('mensajes', [{msg: error.message}]);
    }
    return res.redirect('/')
  }
};

module.exports = validarUrl;

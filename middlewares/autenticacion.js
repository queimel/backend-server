var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEED;

// =====================================
// Verificar token ( middleware )
// =====================================

exports.verificaToken = function(req, res, next) {
  // obtengo token del req
  var token = req.query.token;

  //verifico token
  jwt.verify(token, SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        mensaje: "Token incorrecto",
        errors: err
      });
    }

    // info usuario disponible en cualquier peticion
    req.usuario = decoded.usuario;

    // si token es valido continua la ejecucion
    next();
  });
};

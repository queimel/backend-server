var express = require("express");
var app = express();

var Hospital = require("../models/hospital");

var mdAutenticacion = require("../middlewares/autenticacion");

// =====================================
// Obtener todos los hospitales
// =====================================

app.get("/", (req, res, next) => {
  Hospital.find({}).exec((err, hospitales) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error cargando hospital",
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      hospitales
    });
  });
});

// =====================================
// Actualizar hospital
// =====================================

app.put("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    // si sucede error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al buscar hospital",
        errors: err
      });
    }
    // si no existe hospital
    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: "El hospital con el id " + id + " no existe",
        errors: { message: "No existe un hospital con ese id" }
      });
    }

    // si encuentra hospital
    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save((err, hospitalGuardado) => {
      // si sucede error
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: "Error al actualizar hospital",
          errors: err
        });
      }
      // si no
      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
      });
    });
  });
});

// =====================================
// Crear un nuevo Hospital
// =====================================

app.post("/", mdAutenticacion.verificaToken, (req, res) => {
  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  hospital.save((err, hospitalGuardado) => {
    // si sucede error
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: "Error al crear hospital",
        errors: err
      });
    }

    // si no
    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado
    });
  });
});

// =====================================
// eliminar hospital por el id
// =====================================

app.delete("/:id", mdAutenticacion.verificaToken, (req, res) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    // si sucede error
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: "Error al borrar hospital",
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: "No existe un hospital con ese id",
        errors: { message: "No existe un hospital con ese id" }
      });
    }

    // si no
    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
    });
  });
});

module.exports = app;

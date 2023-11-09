const express = require("express");
const { body } = require("express-validator");
const {
  loginForm,
  registerForm,
  registerUser,
  confirmarCuenta,
  loginUser,
  cerrarSesion,
} = require("../controllers/authControlers");
const router = express.Router();

router.get("/register", registerForm);
router.post(
  "/register",
  [
    body("userName", "Ingrese un nombre válido").trim().notEmpty().escape(),
    body("email", "Ingrese un email válido").trim().isEmail().normalizeEmail(),
    body("password", "Conraseña no válida. minimo 6 caracterers")
      .trim()
      .isLength({ min: 6 })
      .escape()
      .custom((value, { req }) => {
        if (value !== req.body.repassword) {
          throw new Error("no coinciden las contraseñas");
        } else {
          return value;
        }
      }),
  ],
  registerUser
);
router.get("/confirmarCuenta/:token", confirmarCuenta);

router.get("/login", loginForm);
router.post(
  "/login",
  [
    body("email", "Email inválido").trim().isEmail().normalizeEmail(),
    body("password", "Conraseña no válida. minimo 6 caracterers")
      .trim()
      .escape()
      .isLength({ min: 6 }),
  ],
  loginUser
);

router.get('/logout', cerrarSesion)






module.exports = router;

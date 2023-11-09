const User = require("../models/User");
const { validationResult } = require("express-validator");
const { nanoid } = require("nanoid");

const registerForm = (req, res) => {
  res.render("register");
};
const loginForm = (req, res) => {
  res.render("login");
};


const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/register");
  }
  const { userName, email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });
    if (user) throw new Error("Ya existe el usuario");

    user = new User({ userName, email, password, tokenConfirm: nanoid() });
    await user.save();

    req.flash("mensajes", {
      msg: "Revisa tu correro electronico y válida tu cuenta",
    });
    res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/register");
  }
};

const confirmarCuenta = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ tokenConfirm: token });
    if (!user) {
      throw new Error("no existe este usuario");
    }
    user.cuentaConfirmada = true;
    user.tokenConfirm = null;
    await user.save();

    req.flash("mensajes", [
      { msg: "cuenta verificada. ya puedes iniciar sesión" },
    ]);
    return res.redirect("/auth/login");
  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
    // console.log("error al crear el token de la cuenta" + error);
    // res.json(token);
  }
};


const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash("mensajes", errors.array());
    return res.redirect("/auth/login");
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("No exite el email");

    if (!user.cuentaConfirmada) throw new Error("Cuenta no confrimada");

    if (!(await user.comparePassword(password)))
      throw new Error("Contraseña invalida");

    // crea la sesion de usuario a través de passport
    req.login(user, function (err) {
      if (err) throw new Error("Error al crear la sesión");
      // axios.defaults.headers.post['X-CSRF-Token'] = req.body._csrf;
      return res.redirect("/");
    });

  } catch (error) {
    req.flash("mensajes", [{ msg: error.message }]);
    return res.redirect("/auth/login");
  }
};

// const cerrarSesion=( req, res)=>{
//   req.logout()
//   return res.redirect('/auth/login')
// }

function cerrarSesion(req, res){
  req.logout(function(err){
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  loginForm,
  registerForm,
  registerUser,
  confirmarCuenta,
  loginUser,
  cerrarSesion,
};

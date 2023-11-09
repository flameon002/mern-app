const Url = require("../models/Url");
const { nanoid } = require("nanoid");

const readUrls = async (req, res) => {
  try {
    const urls = await Url.find({ user: req.user.id }).lean();
    res.render("home", { urls: urls });
  } catch (error) {
    // console.log(error);
    // res.send('Falló algo...')
    req.flash("mensaje", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
const createUrls = async (req, res) => {
  const { origin } = req.body;
  console.log(req.body);

  try {
    const url = new Url({
      origin: origin,
      shortURL: nanoid(8),
      user: req.user.id,
    });
    await url.save();
    req.flash("mensaje", [{ msg: "Url agregada " }]);
    res.redirect("/");
  } catch (error) {
    // console.log(error);
    // res.send("errorrrr");
    req.flash("mensaje", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
const deleteUrls = async (req, res) => {
  const { id } = req.params;
  try {

    const url= await Url.findById(id)
    if (!url.user.equals(req.user.id)) {
      throw new Error('No es tu url')
    }
    await url.remove()
    req.flash("mensaje", [{ msg: 'Url eliminada' }]);
    res.redirect("/");
  } catch (error) {
    req.flash("mensaje", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
const updateUrl = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findById(id).lean();
    if (!url.user.equals(req.user.id)) {
      throw new Error('No es tu url')
    }

    res.render("home", { url });
  } catch (error) {
    req.flash("mensaje", [{ msg: error.message }]);
    return res.redirect("/");
  }
};
const editarUrl = async (req, res) => {
  const { id } = req.params;
  const { origin } = req.body;
  try {
    // await Url.findByIdAndUpdate(id, { origin });
    const url = await Url.findById(id)
    if (!url.user.equals(req.user.id)) {
      throw new Error('No es tu url')
    }
    await url.updateOne({origin})
    req.flash("mensaje", [{ msg: 'Url editada' }]);
    res.redirect("/");
  } catch (error) {
    // console.log('ocurrio un error en el intento de editar una url');
    // res.send('Ha ocurrido un error cuando se intento editar un dato')
    req.flash("mensaje", [{ msg: error.message }]);
    return res.redirect("/");
  }
};

const redireccionamiento = async (req, res) => {
  const { shortURL } = req.params;
  try {
    const urlDB = await Url.findOne({ shortURL: shortURL });
    res.redirect(urlDB.origin);
  } catch (error) {
    // console.log(error);
    // res.send('Ocurrió un error al copiar el link')
    req.flash("mensaje", [{ msg: 'No existe esta url' }]);
    return res.redirect("/auth/login");
  }
};
module.exports = {
  readUrls,
  createUrls,
  deleteUrls,
  updateUrl,
  editarUrl,
  redireccionamiento,
};

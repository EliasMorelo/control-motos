const { Router } = require("express");
const router = Router();
const fs = require("fs");
const passport = require("passport");
const pool = require("../database");
const helper = require("../lib/helper");
const {isNotLoggedIn} = require('../lib/auth');
const {isLoggedIn} = require('../lib/auth');
const dateFormat = require('dateformat');
router.get("/", isNotLoggedIn, (req, res) => {
  res.render("login");
});

router.post("/", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local.login", {
    successRedirect: "/inicio",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
});

router.get("/inicio", isLoggedIn, (req, res) => {
  res.render("inicio");
});

router.get("/registrar-vehiculo", isLoggedIn, (req, res) => {
  res.render("registrar");
});

router.post("/registrar-vehiculo", isLoggedIn, async (req, res) => {
  const { fotovehiculo, nombres, apellidos, id, fotoconductor } = req.body;
  const resultado = await pool.query("SELECT * FROM dueños WHERE id =  ?", [id]);
  console.log(resultado.length);
  if(resultado.length <= 0){
    const fotoVeh = await helper.guardarFoto(fotovehiculo);
    const fotoCon = await helper.guardarFoto(fotoconductor);
    const nuevo_dueño = {
    id,
    nombres,
    apellidos,
    foto: fotoCon.slice(12)
    };

    const nueva_moto = {
    url_img: fotoVeh.slice(12),
    id_user: id
    };

    await pool.query("INSERT INTO dueños set ?", [nuevo_dueño]);
    const moto = await pool.query("INSERT INTO motos set ?", [nueva_moto]);
    req.flash("success", "Vehiculo guardado satisfactoriamente");
    res.redirect("back");
  }
  else{
    req.flash('failure', 'ERROR: este conductor ya está registrado');
    res.redirect("back");
  }

});

router.get("/buscar-vehiculo", isLoggedIn, (req, res) => {
  res.render("buscar");
});

router.post("/buscar-vehiculo", isLoggedIn, async (req, res, done) => {
  const { iden } = req.body;
  const result = await pool.query("SELECT * FROM dueños WHERE id = ?", [iden]);
  if (result.length > 0) {
    const dueño = result[0];
    const v = await pool.query("SELECT * FROM motos WHERE id_user = ?", [dueño.id,]);
    const vehiculo = v.length;
    res.render("mostrar-conductor", { dueño, vehiculo });
  } else {
    req.flash("failure", "ERROR: este conductor  no está resgistrado");
    res.redirect("back");
  }
});

router.post("/registrar-otro", isLoggedIn, (req, res) => {
  const { conductor } = req.body;
  res.render("registrar-otro-vehiculo", { conductor });
});

router.post("/registrar-otro-vehiculo", isLoggedIn, async (req, res) => {

  const { foto, iden } = req.body;
  const fotoVeh = await helper.guardarFoto(foto);
  const nueva_moto = {
    url_img: fotoVeh.slice(12),
    id_user: iden,
  };
  const moto =  await pool.query("INSERT INTO motos set ?", [nueva_moto]);
  req.flash("success", "Vehiculo guardado satisfactoriamente");
  res.redirect("/buscar-vehiculo");
});

router.post('/mostrar-vehiculos', isLoggedIn, async (req, res)=>{
  const { id } = req.body;
  const veh = await pool.query("SELECT * FROM motos WHERE id_user = ?", [id]);
  res.render("mostrar-vehiculos", { veh, id});
});

router.post("/registrar-salida", isLoggedIn, async (req, res) => {
  const {fotoPlaca} = req.body;
  var currentDate = new Date();

  var date = currentDate.getDate();
  var month = currentDate.getMonth();
  var year = currentDate.getFullYear();
  if(month <= 9){
    var fecha = year + "-"+"0" +(month + 1) + "-" + date ;
  }else if( date  <=9 ){
    var fecha = year + "-" +(month + 1) + "-" + "0"+date ;
  }else{
    var fecha = year + "-" +(month + 1) + "-" + date ;
  }
  console.log(fecha);
    const nueva_salida = {
     foto: fotoPlaca,
     fecha: fecha
    };

    const nuevaSalida = await pool.query("INSERT INTO salidas set ?", [nueva_salida]);
    if(nuevaSalida){
      req.flash("success", "Salida registrada satisfactoriamente");
      res.redirect('/buscar-salidas');
    }

});
router.get("/buscar-salidas", isLoggedIn, async (req, res) => {
  res.render('buscar-salidas');
});

router.post("/buscar-salidas", isLoggedIn, async (req, res) => {
  const {fecha} = req.body;
  console.log(fecha);
  const result = await pool.query("SELECT * FROM salidas WHERE fecha = ?", [fecha]);
  if(result.length > 0){
     res.render('mostrar-salidas', {result, longitud: 1});
  }else{
    res.render('mostrar-salidas', {result, longitud: 0});
  }
});
router.get("/logout", isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect("/");
});

module.exports = router;

import bcryptjs from "bcryptjs";
import debug from "../utils/debug.js"
import dotenv from "dotenv";
import baseDeDatos from "../../database.json" with { type: 'json' };
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

dotenv.config();

const dirname = url.fileURLToPath(import.meta.url);
const ruta = path.join(dirname, "../../../database.json");

debug("Base de datos localizada en " + ruta);

export const usuarios = baseDeDatos;

async function login(req, res) {
  const user = req.body.user;
  const password = req.body.password;
  if (!user || !password) {
    return res.status(400).send({ status: "Error", message: debug("Los campos están incompletos") })
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if (!usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: debug("Error durante login: Usuario no encontrado") })
  }
  const loginCorrecto = await bcryptjs.compare(password, usuarioAResvisar.password);
  if (!loginCorrecto) {
    return res.status(400).send({ status: "Error", message: debug("Error durante login: Contraseña incorrecta") })
  }
  res.send({ status: "ok", message: debug("Usuario loggeado"), redirect: "/admin" });
}

async function register(req, res) {
  const user = req.body.user;
  const password = req.body.password;
  const email = req.body.email;

  if (!user || !password || !email) {
    return res.status(400).send({ status: "Error", message: debug("Los campos están incompletos") })
  }
  const usuarioAResvisar = usuarios.find(usuario => usuario.user === user);
  if (usuarioAResvisar) {
    return res.status(400).send({ status: "Error", message: debug("Este usuario ya existe") })
  }
  const salt = await bcryptjs.genSalt(5);
  const hashPassword = await bcryptjs.hash(password, salt);
  const nuevoUsuario = {
    user, email, password: hashPassword
  }
  usuarios.push(nuevoUsuario);
  debug("Registrando a " + nuevoUsuario.user);

  const nuevaBaseDeDatos = JSON.stringify(usuarios, null, 4);
  fs.writeFileSync(ruta, nuevaBaseDeDatos);

  debug("Usuario añadido; " + nuevoUsuario.user);

  return res.status(200).send({ status: "ok", message: debug(`Usuario ${nuevoUsuario.user} agregado`), redirect: "/" })
}

export const methods = {
  login,
  register
}
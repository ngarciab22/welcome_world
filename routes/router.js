import express from "express";
import path from "path";
import fs from "fs/promises";

const __dirname = path.resolve();
const router = express.Router();

router.get("/", (req, res) => {
    // Ruta de acceso al archivo HTML de la vista
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

router.get("/crear", async (req, res) => {
    try {
        // Obtener la fecha actual
        const fecha = new Date();
        const dia = fecha.getDate();
        const mes = fecha.getMonth() + 1;
        const anio = fecha.getFullYear();
        // Obtener el nombre del archivo y el contenido del query string
        const { archivo, contenido } = req.query;
        // Escribir en el archivo
        await fs.writeFile(`uploads/${archivo}`, `${dia < 10 ? '0' + dia : dia}/${mes < 10 ? '0' + mes : mes}/${anio} - ${contenido}`);
        // Enviar respuesta de éxito
        res.send(`El archivo ${archivo} ha sido creado correctamente`);
    } catch (error) {
        // Manejar errores
        console.error("Error al crear el archivo:", error);
        res.status(500).send('Error al crear el archivo');
    }
});

router.get("/leer", async (req, res) => {
    const { archivo } = req.query;
    try {
        // Leer el contenido del archivo
        const data = await fs.readFile(`uploads/${archivo}`, 'utf-8');
        // Enviar el contenido del archivo como respuesta
        res.status(200).send(data);
    } catch (error) {
        // Manejar errores
        res.status(500).send('Error al leer el archivo');
    }
});

router.get("/renombrar", async (req, res) => {
    const { nombre, nuevoNombre } = req.query;
    try {
        // Renombrar el archivo
        await fs.rename(`uploads/${nombre}`, `uploads/${nuevoNombre}`);
        // Enviar respuesta de éxito
        res.send(`El archivo ${nombre} ha sido renombrado por ${nuevoNombre}`);
    } catch (error) {
        // Manejar errores
        console.error("Error al renombrar el archivo:", error);
        res.status(500).send('No se ha podido renombrar el archivo');
    }
});

router.get("/eliminar", async (req, res) => {
    const { archivo } = req.query;
    try {
        // Eliminar el archivo
        await fs.unlink(`uploads/${archivo}`);
        // Enviar respuesta de éxito
        res.send(`El archivo ${archivo} ha sido eliminado`);
    } catch (error) {
        // Manejar errores
        console.error("Error al eliminar el archivo:", error);
        res.status(500).send('No se ha podido eliminar el archivo');
    }
});

export default router;

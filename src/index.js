//carga de  los modulos
const express = require("express");
const app = express();
const path = require("node:path");
//obtener el numero del puerto
process.loadEnvFile();
const PORT = process.env.PORT;
//cargar los datos
const datos = require("../data/ebooks.json");
// console.log(datos);
//ordernar datos alfabeticamente por apellido
datos.sort((a, b) => a.autor_apellido.localeCompare(b.autor_apellido, "es-ES"));

//Sirve archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "../public")));

// devolver el index.html en la raiz
app.get("/", (req, res) => {
    res.sendFile(__dirname + "index.html");
    // console.log("Estamos en /");
});

// Devuelve la lista completa de autores ordenados alfabéticamente por apellido
app.get("/api/", (req, res) => {
    res.json(datos);
});

//Ruta  para filtrar los autores por el apellido
//ejemplos /api/apellido/Dumas

app.get("/api/apellido/:apellido", (req, res) => {
    const apellido = req.params.apellido;
    const autores = datos.filter((autor) =>
        autor.autor_apellido.toLowerCase().includes(apellido.toLowerCase())
    );

    if (autores.length == 0) {
        return res.status(404).send("Autor no encontrado");
    }
    res.json(autores);
});

//Devuelve la lista de los autores con el nombre y apellido indicado.
//Por ejemplo : /api/nombre_apellido/Alexandre/Dumas

app.get("/api/nombre_apellido/:nombre/:apellido", (req, res) => {
    const nombre = req.params.nombre;
    const apellido = req.params.apellido;
    const autor = datos.filter(
        (autor) =>
            autor.autor_nombre.toLowerCase() === nombre.toLowerCase() &&
            autor.autor_apellido.toLowerCase() === apellido.toLowerCase()
    );

    // Verifica si el array está vacío
    if (autor.length === 0) {
        return res.status(404).send("autor no encontrado");
    }
    res.json(autor);
});

//Devuelve la lista de los autores con el nombre y primeras letras del
//apellido indicado. Por ejemplo : /api/nombre/Alexandre?apellido=Du

app.get("/api/nombre/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    const apellido = req.query.apellido;
    if (apellido == undefined) {
        return res.status(404).send("Falta el parámetro apellido");
    }

    const autores = datos.filter(
        (autor) =>
            autor.autor_nombre.toLowerCase() === nombre.toLowerCase() &&
            autor.autor_apellido
                .toLowerCase()
                .startsWith(apellido.toLowerCase())
    );

    if (autores.length == 0) {
        return res.status(404).send("Autor no encontrado");
    }
    res.json(autores);
});

// Devuelve la lista de las obras editadas en el año indicado.
//Por ejemplo : /api/edicion/2022

app.get("/api/edicion/:year", (req, res) => {
    const year = req.params.year;

    const editionYear = datos.flatMap((autor) =>
        autor.obras.filter((obra) => obra.edicion == year)
    );
    // console.log(filtroMarca);

    if (editionYear.length == 0) {
        return res.status(404).send(`Ninguna obra concide con el año ${year}`);
    }
    res.json(editionYear);
});

app.ge;
//error 404
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, "../public", "404.html"));
});
app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});

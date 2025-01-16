const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/diccionario', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conectado a MongoDB');
}).catch((error) => {
    console.error('Error conectándose a MongoDB:', error);
});

// Esquema y Modelo para la Palabra
const palabraSchema = new mongoose.Schema({
    español: String,
    misak: String
}, { collection: 'words' }); // Asegúrate de que la colección se llama 'words'

const Palabra = mongoose.model('Palabra', palabraSchema);

// Ruta para la traducción
app.post('/traducir', async (req, res) => {
    const { language, word } = req.body;
    console.log(`Idioma: ${language}, Palabra: ${word}`);
    
    const regex = new RegExp(`^${word}$`, 'i');  // Expresión regular para hacer la búsqueda sin distinción de mayúsculas

    let resultado;
    if (language === 'spanish') {
        resultado = await Palabra.findOne({ español: regex });
    } else if (language === 'misak') {
        resultado = await Palabra.findOne({ misak: regex });
    }

    console.log(`Resultado: ${resultado}`);

    if (resultado) {
        res.json({ traduccion: language === 'spanish' ? resultado.misak : resultado.español });
    } else {
        res.json({ error: 'Palabra no encontrada, ingrese una nueva o corrija la anterior.' });
    }
});

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

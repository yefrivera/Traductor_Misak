require('dotenv').config(); // Elimina la segunda llamada a dotenv.config()

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080; // Cambiado a 8080 (puerto estándar en Cloud Run)

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a MongoDB Atlas con manejo mejorado
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectándose a MongoDB:', error);
    process.exit(1); // Salir si no hay conexión a DB
  }
};

// Modelo
const palabraSchema = new mongoose.Schema({
  español: String,
  misak: String
}, { collection: 'words' });

const Palabra = mongoose.model('Palabra', palabraSchema);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de traducción
app.post('/traducir', async (req, res) => {
  try {
    const { language, word } = req.body;
    const regex = new RegExp(`^${word}$`, 'i');

    let resultado;
    if (language === 'spanish') {
      resultado = await Palabra.findOne({ español: regex });
    } else if (language === 'misak') {
      resultado = await Palabra.findOne({ misak: regex });
    }

    if (resultado) {
      res.json({ 
        traduccion: language === 'spanish' ? resultado.misak : resultado.español,
        palabraOriginal: word
      });
    } else {
      res.status(404).json({ 
        error: 'Palabra no encontrada',
        sugerencia: 'Revise la ortografía o considere añadirla al diccionario'
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ 
      error: 'Error del servidor',
      detalle: err.message 
    });
  }
});

// Iniciar servidor después de conectar a MongoDB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});
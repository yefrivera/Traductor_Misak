require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint (CRUCIAL para Cloud Run)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Conexión a MongoDB con manejo mejorado
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout más corto
    });
    console.log('Conectado a MongoDB');
    return true;
  } catch (error) {
    console.error('Error conectándose a MongoDB:', error);
    return false;
  }
};

// Modelo (mantener igual)
const palabraSchema = new mongoose.Schema({
  español: String,
  misak: String
}, { collection: 'words' });

const Palabra = mongoose.model('Palabra', palabraSchema);

// Rutas (mantener igual)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/traducir', async (req, res) => {
  // ... (mantener tu implementación actual)
});

// Inicio del servidor con manejo de señales
const startServer = async () => {
  const dbConnected = await connectDB();
  
  if (!dbConnected) {
    console.warn('Advertencia: Servidor iniciado sin conexión a MongoDB');
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });

  // Manejo adecuado para Cloud Run
  process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM, cerrando servidor...');
    server.close(() => {
      console.log('Servidor cerrado');
      if (mongoose.connection.readyState === 1) {
        mongoose.connection.close(false, () => {
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    });
  });
};

startServer();
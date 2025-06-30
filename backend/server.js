const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const documentRoutes = require('./routes/document.routes');
const propertyRoutes = require('./routes/property.routes');
const physicalPersonRoutes = require('./routes/physicalPerson.routes');
const moralPersonRoutes = require('./routes/moralPerson.routes');
const artworkRoutes = require('./routes/artwork.routes');
const associationRoutes = require('./routes/association.routes');
const taskRoutes = require('./routes/task.routes')
const path = require('path');

// Importa las otras rutas aquí

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', (req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();
  if (ext === '.pdf') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
  }
  next();
});
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error de conexión a MongoDB', err));


app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/physical-persons', physicalPersonRoutes);
app.use('/api/moral-persons', moralPersonRoutes);
app.use('/api/artworks', artworkRoutes);
app.use('/api/associations', associationRoutes);
app.use('/api/tasks', taskRoutes);
// Agrega las otras rutas aquí

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const express = require('express');
const router = express.Router();
const PhysicalPerson = require('../models/PhysicalPerson');
const MoralPerson = require('../models/MoralPerson');

// Ruta: /api/search/persons?query=antonio
router.get('/persons', async (req, res) => {
  const { query } = req.query;
  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'El parámetro "query" es requerido' });
  }

  try {
    const regex = new RegExp(query, 'i'); // búsqueda insensible a mayúsculas
    const physicalPersons = await PhysicalPerson.find({
      $or: [
        { nombres: regex },
        { apellidoPaterno: regex },
        { apellidoMaterno: regex }
      ]
    }).limit(5);

    const moralPersons = await MoralPerson.find({
      nombre: regex
    }).limit(5);

    const results = [
      ...physicalPersons.map(person => ({
        id: person._id,
        name: `${person.nombres} ${person.apellidoPaterno} ${person.apellidoMaterno}`,
        type: 'física'
      })),
      ...moralPersons.map(person => ({
        id: person._id,
        name: person.nombre,
        type: 'moral'
      }))
    ];

    res.json(results);
  } catch (error) {
    console.error('Error en búsqueda de personas:', error);
    res.status(500).json({ error: 'Error al buscar personas' });
  }
});
// Ruta: /api/search/persons-by-id?id=XXXXXXXX
router.get('/persons-by-id', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID requerido' });

  try {
    const mongoose = require('mongoose');
    const objectId = new mongoose.Types.ObjectId(id);

    const person =
      (await PhysicalPerson.findById(objectId)) ||
      (await MoralPerson.findById(objectId));

    if (!person) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    const name = person.nombres
      ? `${person.nombres} ${person.apellidoPaterno || ''} ${person.apellidoMaterno || ''}`.trim()
      : person.nombre;

    res.json({ name });
  } catch (error) {
    console.error('Error buscando propietario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

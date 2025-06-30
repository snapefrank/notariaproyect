const MoralPerson = require('../models/MoralPerson');

// Obtener todas las personas morales
exports.getAllMoralPersons = async (req, res) => {
  try {
    const persons = await MoralPerson.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una persona moral por ID
exports.getMoralPersonById = async (req, res) => {
  try {
    const person = await MoralPerson.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: 'Persona moral no encontrada' });
    }
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva persona moral
exports.createMoralPerson = async (req, res) => {
  const person = new MoralPerson(req.body);
  try {
    const newPerson = await person.save();
    res.status(201).json(newPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar una persona moral
exports.updateMoralPerson = async (req, res) => {
  try {
    const updatedPerson = await MoralPerson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar una persona moral
exports.deleteMoralPerson = async (req, res) => {
  try {
    await MoralPerson.findByIdAndDelete(req.params.id);
    res.json({ message: 'Persona eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const PhysicalPerson = require('../models/PhysicalPerson');

// Obtener todas las personas físicas
const getAllPhysicalPersons = async (req, res) => {
  try {
    const persons = await PhysicalPerson.find();
    res.json(persons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Obtener una persona física por ID
const getPhysicalPersonById = async (req, res) => {
  try {
    const person = await PhysicalPerson.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });
    res.json(person);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva persona física
const createPhysicalPerson = async (req, res) => {
  const {
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    rfc,
    curp,
    nss,
    direccion,
    sexo,
    datosMedicos
  } = req.body;

  const newPerson = new PhysicalPerson({
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    fechaNacimiento,
    rfc,
    curp,
    nss,
    direccion,
    sexo,
    datosMedicos
  });

  try {
    const savedPerson = await newPerson.save();
    res.status(201).json(savedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar una persona física
const updatePhysicalPerson = async (req, res) => {
  try {
    const person = await PhysicalPerson.findById(req.params.id);
    if (!person) return res.status(404).json({ message: 'Persona no encontrada' });

    const {
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      rfc,
      curp,
      nss,
      direccion,
      sexo,
      datosMedicos
    } = req.body;

    person.nombres = nombres || person.nombres;
    person.apellidoPaterno = apellidoPaterno || person.apellidoPaterno;
    person.apellidoMaterno = apellidoMaterno || person.apellidoMaterno;
    person.fechaNacimiento = fechaNacimiento || person.fechaNacimiento;
    person.rfc = rfc || person.rfc;
    person.curp = curp || person.curp;
    person.nss = nss || person.nss;
    person.direccion = direccion || person.direccion;
    person.sexo = sexo || person.sexo;
    person.datosMedicos = datosMedicos || person.datosMedicos;

    const updatedPerson = await person.save();
    res.json(updatedPerson);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Eliminar una persona física
const deletePhysicalPerson = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPerson = await PhysicalPerson.findByIdAndDelete(id);
    if (!deletedPerson) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }
    res.status(200).json({ message: 'Persona eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllPhysicalPersons,
  getPhysicalPersonById,
  createPhysicalPerson,
  updatePhysicalPerson,
  deletePhysicalPerson
};
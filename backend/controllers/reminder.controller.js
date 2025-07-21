const Property = require('../models/Property');
const PhysicalPerson = require('../models/PhysicalPerson');

exports.getExpiringReminders = async (req, res) => {
  const now = new Date();
  const in30Days = new Date(now);
  in30Days.setDate(now.getDate() + 30);

  try {
    // Consulta optimizada: solo propiedades que vencen a nivel general o de local
    const properties = await Property.find({
      $or: [
        { "rentEndDate": { $lte: in30Days } },
        { "locals.rentEndDate": { $lte: in30Days } }
      ]
    });

    const persons = await PhysicalPerson.find({
      "datosMedicos.fechaVencimiento": { $lte: in30Days }
    });

    const reminders = [];

    // ✅ Revisión de propiedades completas con vencimiento
    properties.forEach(property => {
      if (property.rentEndDate) {
        const endDate = new Date(property.rentEndDate);
        const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

        if (diff <= 30) {
          reminders.push({
            title: `La renta del inmueble "${property.name}" vence pronto`,
            dueDate: endDate.toISOString().split('T')[0],
            severity: diff <= 15 ? 'high' : 'medium',
            type: 'inmueble'
          });
        }
      }

      // ✅ Revisión de locales internos
      property.locals.forEach(local => {
        if (local.rentEndDate) {
          const endDate = new Date(local.rentEndDate);
          const diff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

          if (diff <= 30) {
            reminders.push({
              title: `El contrato de "${local.name}" (inmueble "${property.name}") vence pronto`,
              dueDate: endDate.toISOString().split('T')[0],
              severity: diff <= 15 ? 'high' : 'medium',
              type: 'local'
            });
          }
        }
      });
    });

    // ✅ Revisión de seguros médicos de personas físicas
    persons.forEach(person => {
      if (person.datosMedicos?.fechaVencimiento) {
        const venc = new Date(person.datosMedicos.fechaVencimiento);
        const diff = Math.ceil((venc - now) / (1000 * 60 * 60 * 24));

        if (diff <= 30) {
          reminders.push({
            title: `El seguro de salud de ${person.nombres} ${person.apellidoPaterno} vence pronto`,
            dueDate: venc.toISOString().split('T')[0],
            severity: diff <= 15 ? 'high' : 'medium',
            type: 'seguro'
          });
        }
      }
    });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener recordatorios', error });
  }
};

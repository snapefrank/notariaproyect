const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123'; // .env recomendado

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role
      },
      token
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});
router.put('/users/:id', async (req, res) => {
  try {
    const updates = {};

    if (req.body.nombre) {
      updates.name = req.body.nombre; // ⚠️ en el modelo usas 'name'
    }

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updates.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      name: updatedUser.name,
      role: updatedUser.role
    });
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error del servidor al actualizar' });
  }
});

module.exports = router;

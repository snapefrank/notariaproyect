const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

async function createUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const users = [
    {
      username: 'IvanaLomeli',
      password: await bcrypt.hash('admin123', 10),
      name: 'Ivan Lomelí',
      role: 'owner'
    },
    {
      username: 'MarianaLomeli',
      password: await bcrypt.hash('emp123', 10),
      name: 'Mariana Lomelí',
      role: 'employee'
    }
  ];

  await User.deleteMany({});
  await User.insertMany(users);
  console.log('✅ Usuarios creados');
  process.exit();
}

createUsers();

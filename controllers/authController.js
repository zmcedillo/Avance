const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    
    const user = await User.findOne({ username });
    console.log('Usuario encontrado:', username);
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Contraseña ingresada:', password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    

    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.json({ token });
  } catch (err) {
    console.error('Error durante el inicio de sesión:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { login };
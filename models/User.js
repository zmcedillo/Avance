const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Referencia al producto
      quantity: { type: Number, default: 1 }, // Cantidad del producto en el carrito
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = mongoose.model('users', userSchema);

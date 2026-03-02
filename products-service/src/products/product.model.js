'use strict';

import { Schema, model } from 'mongoose';


const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es requerido'],
      trim: true,
      maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, 'La descripción no puede exceder 500 caracteres'],
    },
    interestRate: {
      type: Number,
      required: [true, 'La tasa de interés es requerida'],
      min: [0, 'La tasa de interés debe ser mayor o igual a 0'],
    },
    currency: {
      type: Schema.Types.ObjectId,
      ref: 'Currency',
      required: [true, 'La moneda es requerida'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ name: 1, currency: 1 }, { unique: true });
productSchema.index({ isActive: 1 });
productSchema.index({ currency: 1 });
productSchema.index({ isActive: 1, currency: 1 });

export default model('Product', productSchema);
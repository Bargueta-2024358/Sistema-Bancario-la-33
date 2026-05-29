'use strict';

import { Schema, model } from 'mongoose';

const currencySchema = new Schema(
  {
    code: {
      type: String,
      required: [true, 'El código es requerido'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true, // ← deja solo este
    },
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    symbol: {
      type: String,
      required: [true, 'El símbolo es requerido'],
      trim: true,
      maxLength: [10, 'El símbolo no puede exceder 10 caracteres'],
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

export default model('Currency', currencySchema);
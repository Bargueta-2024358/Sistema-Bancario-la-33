  'use strict';

  import { Schema, model } from 'mongoose';

  const accountTypeSchema = new Schema(
    {
      name: {
        type: String,
        enum: ['Ahorro', 'Monetaria', 'Crédito', 'Inversión'],
        required: [true, 'El nombre es requerido y debe ser uno de: Ahorro, Monetaria, Crédito, Inversión'],
        unique: true,
        trim: true,
        maxLength: [100, 'El nombre no puede exceder 100 caracteres'],
      },
      interestRate: {
        type: Number,
        required: [true, 'La tasa de interés es requerida'],
        min: [0, 'La tasa no puede ser negativa'],
      },
      description: {
        type: String,
        trim: true,
        maxLength: [300, 'La descripción no puede exceder 300 caracteres'],
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

  export default model('AccountType', accountTypeSchema);
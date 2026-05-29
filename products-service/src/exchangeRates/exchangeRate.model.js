'use strict';

import { Schema, model } from 'mongoose';

const exchangeRateSchema = new Schema(
  {
    fromCurrency: {
      type: Schema.Types.ObjectId,
      ref: 'Currency',
      required: [true, 'La moneda origen es requerida'],
    },
    toCurrency: {
      type: Schema.Types.ObjectId,
      ref: 'Currency',
      required: [true, 'La moneda destino es requerida'],
    },
    rate: {
      type: Number,
      required: [true, 'La tasa de cambio es requerida'],
      min: [0, 'La tasa debe ser mayor o igual a 0'],
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

exchangeRateSchema.index({ fromCurrency: 1, toCurrency: 1 });
exchangeRateSchema.index({ isActive: 1 });

export default model('ExchangeRate', exchangeRateSchema);
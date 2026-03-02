import eventBus from './eventBus.js';

// CURRENCIES
eventBus.on('currency.created', (data) => {
  console.log('Evento: currency.created', data);
});

eventBus.on('currency.updated', (data) => {
  console.log('Evento: currency.updated', data);
});

eventBus.on('currency.deactivated', (data) => {
  console.log('Evento: currency.deactivated', data);
});

// ACCOUNT TYPES
eventBus.on('accountType.created', (data) => {
  console.log('Evento: accountType.created', data);
});

eventBus.on('accountType.updated', (data) => {
  console.log('Evento: accountType.updated', data);
});

eventBus.on('accountType.deactivated', (data) => {
  console.log('Evento: accountType.deactivated', data);
});

//PRODUCTS
eventBus.on('product.created', (data) => {
  console.log('Evento: product.created', data);
});

eventBus.on('product.updated', (data) => {
  console.log('Evento: product.updated', data);
});

eventBus.on('product.deactivated', (data) => {
  console.log('Evento: product.deactivated', data);
});

// EXCHANGE RATES
eventBus.on('product.created', (data) => {
  console.log('Evento: product.created', data);
});

eventBus.on('product.updated', (data) => {
  console.log('Evento: product.updated', data);
});

eventBus.on('product.deactivated', (data) => {
  console.log('Evento: product.deactivated', data);
});
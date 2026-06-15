const BASE = process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3023';
const SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY || 'Banco33InternalKey2026';

const postEvent = async (path, body) => {
  try {
    await fetch(`${BASE}/api/events/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-service-key': SERVICE_KEY,
      },
      body: JSON.stringify(body),
    });
  } catch (_err) {
  }
};

const notifyTransfer = async (payload) => postEvent('transfer', payload);
const notifyDeposit = async (payload) => postEvent('deposit', payload);

const notifyAlert = async (payload) => postEvent('alert', payload);

const notifyConfirmation = async (payload) => postEvent('confirmation', payload);

module.exports = { notifyTransfer, notifyDeposit, notifyAlert, notifyConfirmation };

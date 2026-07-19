// src/shared/api/notificationsClient.js

import { ENDPOINTS } from '../constants/endpoints.js';
import { createApiClient } from './createApiClient.js';

const notificationsClient = createApiClient(ENDPOINTS.NOTIFICATIONS);

export default notificationsClient;

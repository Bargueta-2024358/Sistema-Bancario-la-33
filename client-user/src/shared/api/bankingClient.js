// src/shared/api/bankingClient.js

import { ENDPOINTS } from '../constants/endpoints.js';
import { createApiClient } from './createApiClient.js';

const bankingClient = createApiClient(ENDPOINTS.BANKING);

export default bankingClient;

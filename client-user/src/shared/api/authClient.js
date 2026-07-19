// src/shared/api/authClient.js

import { ENDPOINTS } from '../constants/endpoints.js';
import { createApiClient } from './createApiClient.js';

const authClient = createApiClient(ENDPOINTS.AUTH);

export default authClient;

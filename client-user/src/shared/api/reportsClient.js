// src/shared/api/reportsClient.js

import { ENDPOINTS } from '../constants/endpoints.js';
import { createApiClient } from './createApiClient.js';

const reportsClient = createApiClient(ENDPOINTS.REPORTS);

export default reportsClient;

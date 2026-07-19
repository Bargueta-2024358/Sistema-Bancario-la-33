// src/shared/api/productsClient.js

import { ENDPOINTS } from '../constants/endpoints.js';
import { createApiClient } from './createApiClient.js';

const productsClient = createApiClient(ENDPOINTS.PRODUCTS);

export default productsClient;

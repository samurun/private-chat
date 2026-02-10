import { treaty } from '@elysiajs/eden';
import type { App } from '../app/api/[[...slugs]]/route';

// .api to enter /api prefix
const url =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:3000';

export const clientApi = treaty<App>(url).api;

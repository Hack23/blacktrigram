/**
 * Standalone demo for HelloThreeJS component
 * Run with: npm run dev and navigate to /threejs-test.html
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { HelloThreeJS } from './HelloThreeJS';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <HelloThreeJS width={800} height={600} />
    </React.StrictMode>
  );
}

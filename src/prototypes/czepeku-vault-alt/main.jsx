import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './styles.css';
import VaultCompanion from './VaultCompanion.jsx';

createRoot(document.getElementById('vault-alt-root')).render(
  <StrictMode>
    <VaultCompanion />
  </StrictMode>
);

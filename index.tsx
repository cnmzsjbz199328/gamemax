
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

console.log('Skeleton AI: Booting application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error("Critical: Could not find root element to mount to");
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('Skeleton AI: React mounted successfully.');
}

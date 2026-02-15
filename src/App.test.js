// src/App.test.js
import { render } from '@testing-library/react';
import App from './App';
import { TemaProvider } from './context/TemaContext';

describe('App Component', () => {
  
  test('1. El componente App se renderiza sin errores', () => {
    const { container } = render(
      <TemaProvider>
        <App />
      </TemaProvider>
    );
    expect(container).toBeTruthy();
  });

  test('2. Renderiza la estructura principal de la aplicación', () => {
    const { container } = render(
      <TemaProvider>
        <App />
      </TemaProvider>
    );
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});

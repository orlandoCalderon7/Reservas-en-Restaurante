// src/test/CompFormReserva.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompFormReserva from '../components/CompFormReserva';
import axios from 'axios';

jest.mock('axios');

describe('CompFormReserva - Pruebas Unitarias', () => {
  
  const mockOnConfirmar = jest.fn();
  const mockOnCancelar = jest.fn();
  const mockOnSepararMesa = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock de axios.get
    axios.get.mockResolvedValue({
      data: { fullName: 'Juan Pérez García' }
    });
  });

  // ========================================
  // 1) PRUEBA: Verificar renderizado correcto
  // ========================================
  test('1. El componente se renderiza correctamente', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const titulo = screen.getByText(/RESERVA TU MESA EN LOS TRES SABORES/i);
    expect(titulo).toBeTruthy();
    
    const seccionPersonal = screen.getByText(/INFORMACIÓN PERSONAL/i);
    const seccionReserva = screen.getByText(/DETALLE DE LA RESERVA/i);
    expect(seccionPersonal).toBeTruthy();
    expect(seccionReserva).toBeTruthy();
  });

  test('1.1. Renderiza todos los campos del formulario', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const dniInput = screen.getByPlaceholderText(/Ingrese 8 dígitos/i);
    const nombreInput = screen.getByPlaceholderText(/Ingresar nombre completo/i);
    const telefonoInput = screen.getByPlaceholderText(/Ingresar teléfono/i);
    const emailInput = screen.getByPlaceholderText(/Ingresar email/i);
    
    expect(dniInput).toBeTruthy();
    expect(nombreInput).toBeTruthy();
    expect(telefonoInput).toBeTruthy();
    expect(emailInput).toBeTruthy();
  });

  // ========================================
  // 2) PRUEBA: Validación de DNI
  // ========================================
  test('2. Valida que el DNI tenga exactamente 8 dígitos', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const dniInput = screen.getByPlaceholderText(/Ingrese 8 dígitos/i);
    
    fireEvent.change(dniInput, { target: { value: '1234' } });
    expect(dniInput.value).toBe('1234');
    
    const contador = screen.getByText(/4\/8 dígitos/i);
    expect(contador).toBeTruthy();
  });

  test('2.1. No permite caracteres no numéricos en DNI', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const dniInput = screen.getByPlaceholderText(/Ingrese 8 dígitos/i);
    
    fireEvent.change(dniInput, { target: { value: 'ABC12345' } });
    
    expect(dniInput.value).toBe('12345');
    
    const tieneLetras = /[a-zA-Z]/.test(dniInput.value);
    expect(tieneLetras).toBe(false);
  });

  test('2.2. Limita el DNI a máximo 8 dígitos', async () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const dniInput = screen.getByPlaceholderText(/Ingrese 8 dígitos/i);
    
    fireEvent.change(dniInput, { target: { value: '123456789012' } });
    
    expect(dniInput.value).toBe('12345678');
    expect(dniInput.value.length).toBe(8);
    
    // Esperar a que axios complete
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  // ========================================
  // 3) PRUEBA: Interacción con campos del formulario
  // ========================================
  test('3. Permite ingresar datos en el campo de email', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const emailInput = screen.getByPlaceholderText(/Ingresar email/i);
    
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    expect(emailInput.value).toBe('juan@example.com');
  });

  test('3.1. Permite ingresar datos en el campo de teléfono', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const telefonoInput = screen.getByPlaceholderText(/Ingresar teléfono/i);
    
    fireEvent.change(telefonoInput, { target: { value: '987654321' } });
    expect(telefonoInput.value).toBe('987654321');
  });

  // ========================================
  // 4) PRUEBA: Validación de horario
  // ========================================
  test('4. Muestra mensaje de horario permitido', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const mensajeHorario = screen.getByText(/Horario: 9:00 AM - 10:00 PM/i);
    expect(mensajeHorario).toBeTruthy();
  });

  test('4.1. Permite seleccionar hora dentro del rango permitido', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const horaInput = screen.getByLabelText(/Hora/i);
    
    fireEvent.change(horaInput, { target: { value: '15:00' } });
    expect(horaInput.value).toBe('15:00');
  });

  // ========================================
  // 5) PRUEBA: Botón Verificar Disponibilidad
  // ========================================
  test('5. Renderiza botón de verificar disponibilidad', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const btnVerificar = screen.getByRole('button', { 
      name: /VERIFICAR DISPONIBILIDAD/i 
    });
    expect(btnVerificar).toBeTruthy();
  });

  test('5.1. Botón de verificar está deshabilitado sin fecha y hora', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const btnVerificar = screen.getByRole('button', { 
      name: /VERIFICAR DISPONIBILIDAD/i 
    });
    expect(btnVerificar.disabled).toBe(true);
  });

  // ========================================
  // 6) PRUEBA: Botón Cancelar
  // ========================================
  test('6. Ejecuta función onCancelar al hacer clic en CANCELAR', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const btnCancelar = screen.getByRole('button', { name: /CANCELAR/i });
    fireEvent.click(btnCancelar);
    
    expect(mockOnCancelar).toHaveBeenCalledTimes(1);
  });

  // ========================================
  // 7) PRUEBA: Validación de número de personas
  // ========================================
  test('7. Valida que el número de personas esté entre 1 y 12', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const personasInput = screen.getByPlaceholderText(/\[1 - 12 personas\]/i);
    
    fireEvent.change(personasInput, { target: { value: '6' } });
    expect(personasInput.value).toBe('6');
    
    expect(personasInput.getAttribute('min')).toBe('1');
    expect(personasInput.getAttribute('max')).toBe('12');
  });

  // ========================================
  // 8) PRUEBA: Botón Confirmar Reserva
  // ========================================
  test('8. Botón CONFIRMAR RESERVA está deshabilitado sin verificación', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const btnConfirmar = screen.getByRole('button', { name: /CONFIRMAR RESERVA/i });
    expect(btnConfirmar.disabled).toBe(true);
  });

  // ========================================
  // 9) PRUEBA: Contador de DNI
  // ========================================
  test('9. Muestra contador de dígitos del DNI correctamente', async () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const dniInput = screen.getByPlaceholderText(/Ingrese 8 dígitos/i);
    
    expect(screen.getByText(/0\/8 dígitos/i)).toBeTruthy();
    
    fireEvent.change(dniInput, { target: { value: '12345' } });
    expect(screen.getByText(/5\/8 dígitos/i)).toBeTruthy();
    
    fireEvent.change(dniInput, { target: { value: '12345678' } });
    
    // Esperar a que axios complete y actualice el estado
    await waitFor(() => {
      expect(screen.getByText(/8\/8 dígitos/i)).toBeTruthy();
    });
  });

  // ========================================
  // 10) PRUEBA: Botón Solicitar Reserva
  // ========================================
  test('10. Renderiza botón SOLICITAR RESERVA', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const btnSolicitar = screen.getByRole('button', { name: /^SOLICITAR RESERVA$/i });
    expect(btnSolicitar).toBeTruthy();
  });

  // ========================================
  // 11) PRUEBA: Campo de solicitudes especiales
  // ========================================
  test('11. Permite ingresar solicitudes especiales', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const solicitudesTextarea = screen.getByPlaceholderText(/\[Área de texto multilínea\]/i);
    
    fireEvent.change(solicitudesTextarea, { 
      target: { value: 'Mesa cerca de la ventana' } 
    });
    
    expect(solicitudesTextarea.value).toBe('Mesa cerca de la ventana');
  });

  // ========================================
  // 12) PRUEBA: Información de botones
  // ========================================
  test('12. Muestra información sobre los botones', () => {
    render(
      <CompFormReserva 
        onConfirmar={mockOnConfirmar}
        onCancelar={mockOnCancelar}
        onSepararMesa={mockOnSepararMesa}
      />
    );
    
    const textoCompleto = screen.getByText((content, element) => {
      if (element?.tagName.toLowerCase() !== 'p') return false;
      
      const texto = element.textContent || '';
      return texto.includes('Información') &&
             texto.includes('SOLICITAR RESERVA') &&
             texto.includes('PENDIENTE') &&
             texto.includes('CONFIRMAR RESERVA') &&
             texto.includes('CONFIRMADA');
    });
    
    expect(textoCompleto).toBeTruthy();
  });
});


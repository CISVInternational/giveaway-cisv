import React from 'react';
import { render, screen } from '@testing-library/react';
import DataImport from './DataImport';

describe('test DataImport', () => {
  beforeAll(() => {
		render(<DataImport />);
  });
  it('renders buttons', ()=>{
    const importParticipants = screen.getByText(/Importar participantes/i);
    const importPrograms = screen.getByText(/Importar programas/i)
    expect(importParticipants).toBeInTheDocument();
    expect(importPrograms).toBeInTheDocument();
  })

  
  
});

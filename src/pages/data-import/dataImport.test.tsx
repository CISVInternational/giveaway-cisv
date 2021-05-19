import React from 'react';
import { render, screen } from '@testing-library/react';
import DataImport from './dataImport';

test('renders learn react link', () => {
  render(<DataImport />);
  const linkElement = screen.getByText(/hola/i);
  expect(linkElement).toBeInTheDocument();
});

// @ts-ignore
import React from 'react';
// @ts-ignore
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  // @ts-ignore
  expect(linkElement).toBeInTheDocument();
});

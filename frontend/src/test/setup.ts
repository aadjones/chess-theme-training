import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => {
  const actual = vi.importActual('@chakra-ui/react');
  const React = require('react');
  return {
    ...actual,
    Box: (props: any) => React.createElement('div', props),
    Button: (props: any) => React.createElement('button', props),
    Container: (props: any) => React.createElement('div', props),
    FormControl: (props: any) => React.createElement('div', props),
    FormLabel: (props: any) => React.createElement('label', props),
    Heading: (props: any) => React.createElement('h1', props),
    Input: (props: any) => React.createElement('input', props),
    Stack: (props: any) => React.createElement('div', props),
    Text: (props: any) => React.createElement('p', props),
    useColorMode: () => ({ colorMode: 'light', toggleColorMode: vi.fn() }),
  };
});

// Clean up after each test
afterEach(() => {
  cleanup();
}); 
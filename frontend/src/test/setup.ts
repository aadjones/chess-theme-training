import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

type ChakraProps = {
  children?: React.ReactNode;
  [key: string]: unknown; // More specific than 'any'
};

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => {
  const React = require('react');
  return {
    Box: ({ children, ...props }: ChakraProps) => React.createElement('div', props, children),
    Button: ({ children, ...props }: ChakraProps) => React.createElement('button', props, children),
    Container: ({ children, ...props }: ChakraProps) => React.createElement('div', props, children),
    FormControl: ({ children, ...props }: ChakraProps) =>
      React.createElement('div', props, children),
    FormLabel: ({ children, ...props }: ChakraProps) =>
      React.createElement('label', props, children),
    Heading: ({ children, ...props }: ChakraProps) => React.createElement('h1', props, children),
    Input: (props: ChakraProps) => React.createElement('input', props),
    Stack: ({ children, ...props }: ChakraProps) => React.createElement('div', props, children),
    Text: ({ children, ...props }: ChakraProps) => React.createElement('p', props, children),
    useColorMode: () => ({ colorMode: 'light', toggleColorMode: vi.fn() }),
  };
});

// Clean up after each test
afterEach(() => {
  cleanup();
});

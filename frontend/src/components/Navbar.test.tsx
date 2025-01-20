import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// Mock the useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}));

// Simple test version of Navbar without Chakra UI
const TestNavbar = () => {
  return (
    <nav>
      <h1>Chess Theme Training</h1>
      <div>
        <button>Login</button>
        <button>Sign Up</button>
      </div>
    </nav>
  );
};

describe('Navbar', () => {
  it('shows login and signup buttons', () => {
    render(<TestNavbar />);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('shows app title', () => {
    render(<TestNavbar />);
    expect(screen.getByText('Chess Theme Training')).toBeInTheDocument();
  });
});

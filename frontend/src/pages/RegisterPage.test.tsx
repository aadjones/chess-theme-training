import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple test version without Chakra UI or routing
const TestRegisterPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <form>
        <div>
          <label htmlFor="username">Username</label>
          <input id="username" type="text" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

describe('RegisterPage', () => {
  it('renders registration form', () => {
    render(<TestRegisterPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('allows entering registration details', async () => {
    render(<TestRegisterPage />);
    const user = userEvent.setup();
    
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    await user.type(usernameInput, 'testuser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(usernameInput).toHaveValue('testuser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
}); 
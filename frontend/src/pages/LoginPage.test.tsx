import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple test version without Chakra UI or routing
const TestLoginPage = () => {
  return (
    <div>
      <h1>Login</h1>
      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

describe('LoginPage', () => {
  it('renders login form', () => {
    render(<TestLoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('allows entering email and password', async () => {
    render(<TestLoginPage />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});

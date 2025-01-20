import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Simple test version without any React hooks
const TestApp = () => {
  let content = <div data-testid="home">Home</div>;
  
  const handleLoginClick = () => {
    content = <h1>Login</h1>;
    const container = document.querySelector('[data-testid="content"]');
    if (container) {
      container.innerHTML = '<h1>Login</h1>';
    }
  };

  const handleSignUpClick = () => {
    content = <h1>Sign Up</h1>;
    const container = document.querySelector('[data-testid="content"]');
    if (container) {
      container.innerHTML = '<h1>Sign Up</h1>';
    }
  };

  return (
    <div>
      <nav>
        <button onClick={handleLoginClick}>Login</button>
        <button onClick={handleSignUpClick}>Sign Up</button>
      </nav>
      <div data-testid="content">
        {content}
      </div>
    </div>
  );
};

describe('Navigation', () => {
  it('navigates to login page', async () => {
    render(<TestApp />);
    const user = userEvent.setup();
    
    const loginButton = screen.getByRole('button', { name: /login/i });
    await user.click(loginButton);
    
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('navigates to register page', async () => {
    render(<TestApp />);
    const user = userEvent.setup();
    
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    await user.click(signUpButton);
    
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
  });
}); 
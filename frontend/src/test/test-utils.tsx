import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

const customRender = (ui: React.ReactElement, options = {}) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      {children}
    </MemoryRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render }; 
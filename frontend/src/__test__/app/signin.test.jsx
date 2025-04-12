import { act, fireEvent, render, screen } from '@testing-library/react';
import SignIn from '@/app/auth/signin/page';

jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
}));

describe('SignIn', () => {
  test('component renders', () => {
    const { container } = render(<SignIn />);

    expect(container).toBeDefined();
  });

  test('component renders with correct elements', () => {
    const { getByText, container } = render(<SignIn />);

    const heading = getByText('Iniciar sesión');
    const form = container.querySelector('form');
    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = container.querySelector('button[type="submit"]');

    expect(heading).toBeDefined();
    expect(form).toBeDefined();
    expect(emailInput).toBeDefined();
    expect(passwordInput).toBeDefined();
    expect(submitButton).toBeDefined();
  });
  test('form submit handled correctly', async () => {
    const { container } = render(<SignIn />);

    const handleSubmit = jest.fn();
    const form = container.querySelector('form');

    form.onsubmit = handleSubmit;

    const emailInput = container.querySelector('input[name="email"]');
    const passwordInput = container.querySelector('input[name="password"]');
    const submitButton = container.querySelector('button[type="submit"]');

    await act(() => {
      fireEvent.change(emailInput, { target: { value: 'test@test.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.click(submitButton);
    });

    expect(handleSubmit).toHaveBeenCalled();
  });
});

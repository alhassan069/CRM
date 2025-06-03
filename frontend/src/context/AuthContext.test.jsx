import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock component to test the context
const TestComponent = () => {
  const { user, token, isAuthenticated, isAdmin, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </div>
      <div data-testid="admin-status">
        {isAdmin ? 'Admin' : 'Not Admin'}
      </div>
      <div data-testid="user-data">
        {user ? JSON.stringify(user) : 'No user'}
      </div>
      <div data-testid="token-data">
        {token || 'No token'}
      </div>
      <button onClick={() => login({ id: 1, username: 'test', name: 'Test User', role: 'admin' }, 'test-token')}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// Mock fetch
global.fetch = jest.fn();

describe('AuthContext', () => {
  beforeEach(() => {
    // Clear localStorage and mocks before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('provides initial authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    expect(screen.getByTestId('admin-status')).toHaveTextContent('Not Admin');
    expect(screen.getByTestId('user-data')).toHaveTextContent('No user');
    expect(screen.getByTestId('token-data')).toHaveTextContent('No token');
  });

  test('updates authentication state on login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Click login button wrapped in act
    act(() => {
      screen.getByText('Login').click();
    });

    // Wait for state updates to complete
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('admin-status')).toHaveTextContent('Admin');
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify({ id: 1, username: 'test', name: 'Test User', role: 'admin' }));
      expect(screen.getByTestId('token-data')).toHaveTextContent('test-token');
    });

    // Check localStorage
    expect(localStorage.getItem('token')).toBe('test-token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({ id: 1, username: 'test', name: 'Test User', role: 'admin' });
  });

  test('updates authentication state on logout', async () => {
    // Mock fetch for logout
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Logout successful' }),
    });

    // Set initial state with a logged-in user
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test', name: 'Test User', role: 'admin' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Wait for the context to initialize from localStorage
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    });

    // Click logout button wrapped in act
    await act(async () => {
      screen.getByText('Logout').click();
    });

    // Check that state was updated
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
      expect(screen.getByTestId('admin-status')).toHaveTextContent('Not Admin');
      expect(screen.getByTestId('user-data')).toHaveTextContent('No user');
      expect(screen.getByTestId('token-data')).toHaveTextContent('No token');
    });

    // Check localStorage
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  test('initializes state from localStorage', async () => {
    // Set initial state in localStorage
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'test', name: 'Test User', role: 'admin' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Check that state was initialized from localStorage
    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('admin-status')).toHaveTextContent('Admin');
      expect(screen.getByTestId('user-data')).toHaveTextContent(JSON.stringify({ id: 1, username: 'test', name: 'Test User', role: 'admin' }));
      expect(screen.getByTestId('token-data')).toHaveTextContent('test-token');
    });
  });
}); 
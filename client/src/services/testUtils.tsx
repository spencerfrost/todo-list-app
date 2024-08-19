import { render, RenderOptions } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext, AuthContextType } from "../context/AuthContext";
import { ThemeContext, ThemeContextType } from "../context/ThemeContext";

// Mock AuthContext
export const mockAuthContext: AuthContextType = {
  isAuthenticated: true,
  token: 'mock-token',
  loading: false,
  login: jest.fn(),
  logout: jest.fn(),
};

// Mock ThemeContext
export const mockThemeContext: ThemeContextType = {
  primary_color: '#000000',
  secondary_color: '#ffffff',
  dark_mode: false,
  default_sorting: 'dueDate',
  sorting_direction: 'asc',
  tasks_per_page: 10,
  show_completed: false,
  email_notifications: true,
  push_notifications: false,
  notification_frequency: 'daily',
  time_zone: 'UTC',
  language: 'en',
  setTheme: jest.fn(),
  toggleDarkMode: jest.fn(),
};

export const MockProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter>
    <AuthContext.Provider value={mockAuthContext}>
      <ThemeContext.Provider value={mockThemeContext}>
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  </MemoryRouter>
);

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: MockProviders, ...options });

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Override the render method
export { customRender as render };

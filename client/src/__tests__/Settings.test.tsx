import userEvent from '@testing-library/user-event';
import React from 'react';

import Settings from 'pages/Settings';
import { getSettings, updateSettings } from 'services/api';
import { render, screen, waitFor } from 'services/testUtils';
import { UserSettings } from 'services/types';

jest.mock('services/api');
jest.mock('components/layouts/MainLayout', () => ({ children }: { children: React.ReactNode }) => <div>{children}</div>);

describe('Settings', () => {
  const mockSettings: UserSettings = {
    show_completed: false,
    email_notifications: true,
    push_notifications: false,
    notification_frequency: "daily",
    time_zone: "UTC",
    language: "en",
    sort_by: "due_date",
    sort_order: "asc",
    sort_completed_to_bottom: false,
  };

  beforeEach(() => {
    (getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (updateSettings as jest.Mock).mockResolvedValue(mockSettings);
  });

  it('fetches and displays settings', async () => {
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    expect(screen.getByText('Notification Settings')).toBeInTheDocument();
    expect(screen.getByText('Time and Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Notifications:')).toBeInTheDocument();
    expect(screen.getByLabelText('Push Notifications:')).toBeInTheDocument();
    
    const notificationFrequencyTrigger = screen.getByTestId('notification-frequency-trigger');
    expect(notificationFrequencyTrigger).toBeInTheDocument();
    expect(notificationFrequencyTrigger).toHaveTextContent('Daily');
  });

  it('updates settings', async () => {
    const user = userEvent.setup();
    render(<Settings />);
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    // Toggle push notifications
    const pushNotificationsSwitch = screen.getByLabelText('Push Notifications:');
    await user.click(pushNotificationsSwitch);

    // Change notification frequency to Weekly
    const notificationFrequencyTrigger = screen.getByTestId('notification-frequency-trigger');
    await user.click(notificationFrequencyTrigger);

    // Wait for options to appear and select 'Weekly'
    await waitFor(() => {
      const weeklyOption = screen.getByTestId('weekly-notification');
      expect(weeklyOption).toBeInTheDocument();
      return weeklyOption;
    }).then((weeklyOption) => user.click(weeklyOption));

    // Save settings
    const saveButton = screen.getByText('Save Settings');
    await user.click(saveButton);

    // Verify that updateSettings was called with the correct arguments
    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalledWith(expect.objectContaining({
        push_notifications: true,
        notification_frequency: 'weekly',
      }));
    });

    // Verify that the UI reflects the changes
    expect(screen.getByLabelText('Push Notifications:')).toBeChecked();
    expect(screen.getByTestId('notification-frequency-trigger')).toHaveTextContent('Weekly');
  });

  it('displays loading state', async () => {
    (getSettings as jest.Mock).mockReturnValueOnce(new Promise(() => {})); // Never resolves
    render(<Settings />);
    expect(screen.getByText('Loading settings...')).toBeInTheDocument();
  });

  it('displays error state', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (getSettings as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch settings. Please try again.')).toBeInTheDocument();
    });
    expect(consoleSpy).toHaveBeenCalledWith('Error fetching settings:', expect.any(Error));
    consoleSpy.mockRestore();
  });
});
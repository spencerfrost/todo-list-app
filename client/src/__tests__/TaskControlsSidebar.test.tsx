import userEvent from '@testing-library/user-event';
import TaskControlsSidebar from 'components/TaskControlsSidebar';
import { fireEvent, render, screen, waitFor } from 'services/testUtils';
import { UserSettings } from 'services/types';

describe('TaskControlsSidebar', () => {
  const mockSettings: UserSettings = {
    show_completed: false,
    sort_by: 'due_date',
    sort_order: 'asc',
    sort_completed_to_bottom: false,
    email_notifications: true,
    push_notifications: false,
    notification_frequency: 'daily',
    time_zone: 'UTC',
    language: 'en',
  };
  const mockOnUpdateSettings = jest.fn();
  const mockOnUpdatePriorityFilter = jest.fn();

  it('renders controls correctly', () => {
    render(
      <TaskControlsSidebar
        settings={mockSettings}
        priorityFilter={[]}
        onUpdateSettings={mockOnUpdateSettings}
        onUpdatePriorityFilter={mockOnUpdatePriorityFilter}
      />
    );
    
    expect(screen.getByText('Sort By')).toBeInTheDocument();
    expect(screen.getByText('Display Options')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('changes sort criteria', async () => {
    const user = userEvent.setup();

    render(
      <TaskControlsSidebar
        settings={mockSettings}
        priorityFilter={[]}
        onUpdateSettings={mockOnUpdateSettings}
        onUpdatePriorityFilter={mockOnUpdatePriorityFilter}
      />
    );

    const sortSelect = screen.getByTestId('sort-by-trigger');
    await user.click(sortSelect);

    // Wait for options to appear and select 'Title'
    await waitFor(() => {
      const titleOption = screen.getByTestId('title-sort');
      expect(titleOption).toBeInTheDocument();
      return titleOption;
    }).then((titleOption) => user.click(titleOption));
    
    expect(mockOnUpdateSettings).toHaveBeenCalledWith(expect.objectContaining({ sort_by: 'title' }));
  });

  it('changes sort order', () => {
    render(
      <TaskControlsSidebar
        settings={mockSettings}
        priorityFilter={[]}
        onUpdateSettings={mockOnUpdateSettings}
        onUpdatePriorityFilter={mockOnUpdatePriorityFilter}
      />
    );
    
    fireEvent.click(screen.getByText('Ascending'));
    
    expect(mockOnUpdateSettings).toHaveBeenCalledWith(expect.objectContaining({ sort_order: 'desc' }));
  });

  it('updates priority filter', () => {
    render(
      <TaskControlsSidebar
        settings={mockSettings}
        priorityFilter={[]}
        onUpdateSettings={mockOnUpdateSettings}
        onUpdatePriorityFilter={mockOnUpdatePriorityFilter}
      />
    );
    
    fireEvent.click(screen.getByLabelText('High'));
    
    expect(mockOnUpdatePriorityFilter).toHaveBeenCalledWith(['High']);
  });
});
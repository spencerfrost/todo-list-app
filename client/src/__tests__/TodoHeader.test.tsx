import userEvent from '@testing-library/user-event';
import TodoHeader from 'components/ToDoHeader';
import { fireEvent, render, screen } from 'services/testUtils';

describe('TodoHeader', () => {
  const mockOnAddTask = jest.fn();
  const mockOnToggleShowCompleted = jest.fn();

  it('renders correctly', () => {
    render(<TodoHeader onAddTask={mockOnAddTask} onToggleShowCompleted={mockOnToggleShowCompleted} showCompleted={false} />);
    
    expect(screen.getByText('Todo List')).toBeInTheDocument();
    expect(screen.getByTestId('add-task-button')).toBeInTheDocument();
  });

  it('calls onAddTask when add button is clicked', () => {
    render(<TodoHeader onAddTask={mockOnAddTask} onToggleShowCompleted={mockOnToggleShowCompleted} showCompleted={false} />);
    
    fireEvent.click(screen.getByTestId('add-task-button'));
    expect(mockOnAddTask).toHaveBeenCalled();
  });

  it('toggles show completed tasks', async () => {
    const user = userEvent.setup();
    render(<TodoHeader onAddTask={mockOnAddTask} onToggleShowCompleted={mockOnToggleShowCompleted} showCompleted={false} />);
    
    const dropdownTrigger = screen.getByTestId('todo-header-options');
    await user.click(dropdownTrigger);

    const toggleShowCompleted = screen.getByTestId('toggle-show-completed');
    await user.click(toggleShowCompleted);
    
    expect(mockOnToggleShowCompleted).toHaveBeenCalled();
  });
});
import TaskList from 'components/TaskList';
import { render, screen } from 'services/testUtils';

describe('TaskList', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', completed: false, created_at: '2021-01-01T00:00:00Z' },
    { id: 2, title: 'Task 2', completed: true, created_at: '2021-01-02T00:00:00Z' },
  ];
  const mockOnEditTask = jest.fn();
  const mockOnUpdateTask = jest.fn();

  it('renders tasks correctly', () => {
    render(<TaskList tasks={mockTasks} onEditTask={mockOnEditTask} onUpdateTask={mockOnUpdateTask} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });
});
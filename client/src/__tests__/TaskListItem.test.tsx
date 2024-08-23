import TaskListItem from 'components/TaskListItem';
import { updateTask } from 'services/api';
import { fireEvent, render, screen, waitFor } from 'services/testUtils';

jest.mock('services/api');

describe('TaskListItem', () => {
  const mockTask = { id: 1, title: 'Test Task', description: 'Test Description', completed: false, created_at: '2021-01-01T00:00:00Z' };
  const mockOnEdit = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (updateTask as jest.Mock).mockResolvedValue({ ...mockTask });
  });

  it('renders task item correctly', () => {
    render(<TaskListItem task={mockTask} onEdit={mockOnEdit} onUpdate={mockOnUpdate} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('allows inline editing of title', async () => {
    render(<TaskListItem task={mockTask} onEdit={mockOnEdit} onUpdate={mockOnUpdate} />);
    
    const titleElement = screen.getByText('Test Task');
    fireEvent.click(titleElement);
    
    // Simulate typing
    fireEvent.input(titleElement, { target: { textContent: 'Updated Task' } });
    
    // Simulate blurring (finishing edit)
    fireEvent.blur(titleElement);

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ title: 'Updated Task' }));
    });

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  it('allows inline editing of description', async () => {
    render(<TaskListItem task={mockTask} onEdit={mockOnEdit} onUpdate={mockOnUpdate} />);
    
    const descriptionElement = screen.getByText('Test Description');
    fireEvent.click(descriptionElement);
    
    // Simulate typing
    fireEvent.input(descriptionElement, { target: { textContent: 'Updated Description' } });
    
    // Simulate blurring (finishing edit)
    fireEvent.blur(descriptionElement);

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ description: 'Updated Description' }));
    });

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });
});
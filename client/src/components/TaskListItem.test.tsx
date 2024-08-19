import { fireEvent, render, screen } from '@testing-library/react';
import TaskListItem from './TaskListItem';

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
};

test('renders TaskListItem correctly', () => {
  render(
    <TaskListItem
      task={mockTask}
      onDelete={() => {}}
      onComplete={() => {}}
      onEdit={() => {}}
    />
  );
  
  expect(screen.getByText('Test Task')).toBeInTheDocument();
  expect(screen.getByText('Test Description')).toBeInTheDocument();
});

test('calls onComplete when checkbox is clicked', () => {
  const mockOnComplete = jest.fn();
  render(
    <TaskListItem
      task={mockTask}
      onDelete={() => {}}
      onComplete={mockOnComplete}
      onEdit={() => {}}
    />
  );
  
  fireEvent.click(screen.getByRole('checkbox'));
  expect(mockOnComplete).toHaveBeenCalledWith(1);
});

// Add more tests for onDelete and onEdit functionality
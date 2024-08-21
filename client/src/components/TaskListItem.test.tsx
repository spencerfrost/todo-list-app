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
      onUpdate={() => {}}
      onEdit={() => {}}
    />
  );
  
  expect(screen.getByText('Test Task')).toBeInTheDocument();
  expect(screen.getByText('Test Description')).toBeInTheDocument();
});

test('calls onUpdate when checkbox is clicked', () => {
  const mockonUpdate = jest.fn();
  render(
    <TaskListItem
      task={mockTask}
      onUpdate={mockonUpdate}
      onEdit={() => {}}
    />
  );
  
  fireEvent.click(screen.getByRole('checkbox'));
  expect(mockonUpdate).toHaveBeenCalledWith(1);
});

// Add more tests for onDelete and onEdit functionality
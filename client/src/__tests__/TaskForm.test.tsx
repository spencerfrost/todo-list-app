import TaskForm from "components/TaskForm";
import React from "react";
import { createTask, updateTask } from "services/api";
import { fireEvent, render, screen, waitFor } from "services/testUtils";

jest.mock("services/api");

// Mock the Dialog component
jest.mock("components/ui/dialog", () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock("components/CategoryManager", () => ({
  __esModule: true,
  default: ({ onCategorySelect }: { onCategorySelect: (id: number) => void }) => (
    <select
      data-testid="category-manager"
      onChange={(e) => onCategorySelect(Number(e.target.value))}
      aria-label="Select category"
    >
      <option value="1">Category 1</option>
      <option value="2">Category 2</option>
    </select>
  ),
}));

describe("TaskForm", () => {
  const mockTask = {
    id: 1,
    title: "Test Task",
    description: "Test Description",
    completed: false,
    created_at: "2021-01-01T00:00:00Z",
  };
  const mockOnClose = jest.fn();
  const mockOnTaskUpdated = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form correctly", () => {
    render(
      <TaskForm
        task={null}
        onClose={mockOnClose}
        onTaskUpdated={mockOnTaskUpdated}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("Create Task")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("adds a new task", async () => {
    (createTask as jest.Mock).mockResolvedValue({
      id: 2,
      title: "New Task",
      description: "New Description",
      completed: false,
      created_at: "2021-01-01T00:00:00Z",
    });

    render(
      <TaskForm
        task={null}
        onClose={mockOnClose}
        onTaskUpdated={mockOnTaskUpdated}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New Description" },
    });
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Task",
          description: "New Description",
        })
      );
    });

    await waitFor(() => {
      expect(mockOnTaskUpdated).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("edits an existing task", async () => {
    (updateTask as jest.Mock).mockResolvedValue({
      ...mockTask,
      title: "Updated Task",
    });

    render(
      <TaskForm
        task={mockTask}
        onClose={mockOnClose}
        onTaskUpdated={mockOnTaskUpdated}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Task" },
    });
    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(1, expect.objectContaining({ title: "Updated Task" }));
    });
    await waitFor(() => {
      expect(mockOnTaskUpdated).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("deletes a task", async () => {
    render(
      <TaskForm
        task={mockTask}
        onClose={mockOnClose}
        onTaskUpdated={mockOnTaskUpdated}
        onDelete={mockOnDelete}
      />
    );

    fireEvent.click(screen.getByTestId('delete-task-button'));

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });
  
  it("selects a category", async () => {
    render(
      <TaskForm
        task={null}
        onClose={mockOnClose}
        onTaskUpdated={mockOnTaskUpdated}
        onDelete={mockOnDelete}
      />
    );
  
    fireEvent.change(screen.getByTestId("category-manager"), {
      target: { value: "2" },
    });
  
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Task" },
    });
  
    fireEvent.click(screen.getByText("Create"));
  
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Task",
          category_id: 2,
        })
      );
    });
  });
});

import { createTask, deleteTask, getTasks, updateTask } from "../services/api";
import { fireEvent, render, screen, waitFor } from "../services/testUtils";
import ToDoApp from "./ToDoApp";

// Mock the api functions
jest.mock("../services/api", () => ({
  getTasks: jest.fn(),
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
  createTask: jest.fn(),
}));

describe("ToDoApp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo list", async () => {
    const mockTasks = [
      { id: 1, title: "Test Task 1", completed: false },
      { id: 2, title: "Test Task 2", completed: true },
    ];

    (getTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(<ToDoApp />);

    expect(await screen.findByText("Test Task 1")).toBeInTheDocument();
    expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    expect(getTasks).toHaveBeenCalledTimes(1);
  });

  it("deletes a task", async () => {
    const mockTasks = [{ id: 1, title: "Test Task 1", completed: false }];

    (getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (deleteTask as jest.Mock).mockResolvedValue({});

    render(<ToDoApp />);

    await screen.findByText("Test Task 1");
    const deleteButton = screen.getByTestId("delete-task-1");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(deleteTask).toHaveBeenCalledWith(1);
      expect(screen.queryByText("Test Task 1")).not.toBeInTheDocument();
    });
  });

  it("completes a task", async () => {
    const mockTasks = [{ id: 1, title: "Test Task 1", completed: false }];

    (getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (updateTask as jest.Mock).mockResolvedValue({
      ...mockTasks[0],
      completed: true,
    });

    render(<ToDoApp />);

    await screen.findByText("Test Task 1");
    const completeCheckbox = screen.getByTestId("complete-task-1");
    fireEvent.click(completeCheckbox);

    await waitFor(() => {
      expect(updateTask).toHaveBeenCalledWith(1, { completed: true });
    });
  });

  it("opens edit task dialog", async () => {
    const mockTasks = [{ id: 1, title: "Test Task 1", completed: false }];

    (getTasks as jest.Mock).mockResolvedValue(mockTasks);

    render(<ToDoApp />);

    await screen.findByText("Test Task 1");
    const editButton = screen.getByTestId("edit-task-1");
    fireEvent.click(editButton);

    expect(await screen.findByText("Edit Task")).toBeInTheDocument();
  });

  it("creates a new task", async () => {
    const mockTasks: any[] = [];
    const newTask = { id: 1, title: "New Task", completed: false };

    (getTasks as jest.Mock).mockResolvedValue(mockTasks);
    (createTask as jest.Mock).mockResolvedValue(newTask);

    render(<ToDoApp />);

    const addTaskButton = screen.getByTestId("add-task-button");
    fireEvent.click(addTaskButton);
    
    await waitFor(() => {
        expect(screen.getByTestId("task-form-dialog")).toBeInTheDocument();
    });
    
    // Now interact with the form elements
    const titleInput = screen.getByTestId("task-title-input");
    fireEvent.change(titleInput, { target: { value: "New Task" } });
    
    const descriptionInput = screen.getByTestId("task-description-input");
    fireEvent.change(descriptionInput, {
        target: { value: "Task Description" },
    });

    const saveButton = screen.getByTestId("save-task-button");
    fireEvent.click(saveButton);
    
    // Wait for the new task to appear in the list
    await waitFor(() => {
      expect(screen.getByText("New Task")).toBeInTheDocument();
    });
  });

  it("handles error when fetching tasks", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (getTasks as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch tasks")
    );

    render(<ToDoApp />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error fetching tasks:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});

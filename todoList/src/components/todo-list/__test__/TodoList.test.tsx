import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { message } from 'antd';
import { TodoList } from '..';

const mockAddChangeListener = jest.fn();
const mockRemoveChangeListener = jest.fn();
const mockRemoveItem = jest.fn();

jest.mock('../../../utils/storage', () => ({
  LocalStorageUtils: {
    getInstance: jest.fn(() => ({
      addChangeListener: mockAddChangeListener,
      removeChangeListener: mockRemoveChangeListener,
      removeItem: mockRemoveItem,
    })),
  },
}));

jest.mock('../../todo-add-new-item', () => ({
  TodoAddNewItem: jest.fn(() => <div data-testid="todo-add-new-item" />),
}));

jest.mock('../../todo-item', () => ({
  TodoItem: jest.fn(({ item }) => (
    <div data-testid="todo-item">{item.label}</div>
  )),
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
  },
}));

const mockInitialItems: Item[] = [
  { label: 'Incomplete Item', status: 'INCOMPLETE' },
  { label: 'Complete Item', status: 'COMPLETE' },
];

describe('TodoList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the todo list with initial items', () => {
    render(
      <TodoList
        name="Test List"
        items={mockInitialItems}
        storageName="test-storage"
      />,
    );

    expect(screen.getByText('Test List')).toBeInTheDocument();
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2);
    expect(screen.getByText('Incomplete Item')).toBeInTheDocument();
    expect(screen.getByText('Complete Item')).toBeInTheDocument();
    expect(screen.getByText('COMPLETE TASKS')).toBeInTheDocument();
  });

  test('should open modal when add button is clicked', () => {
    render(
      <TodoList
        name="Test List"
        items={mockInitialItems}
        storageName="test-storage"
      />,
    );

    const addButton = screen.getByRole('button', { name: /unordered-list/i });
    fireEvent.click(addButton);

    expect(screen.getByTestId('todo-add-new-item')).toBeInTheDocument();
  });

  test('should remove the list and show success message when delete button is clicked', () => {
    render(
      <TodoList
        name="Test List"
        items={mockInitialItems}
        storageName="test-storage"
      />,
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockRemoveItem).toHaveBeenCalledWith('Test List');
    expect(message.success).toHaveBeenCalledWith('List removed successfully!');
  });

  test('should add and remove change listener on mount and unmount', () => {
    const { unmount } = render(
      <TodoList
        name="Test List"
        items={mockInitialItems}
        storageName="test-storage"
      />,
    );

    expect(mockAddChangeListener).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockRemoveChangeListener).toHaveBeenCalledTimes(1);
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoItem } from '..';

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();

jest.mock('../../../utils/storage', () => ({
  LocalStorageUtils: {
    getInstance: jest.fn(() => ({
      getItem: mockGetItem,
      setItem: mockSetItem,
    })),
  },
}));

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Button: ({ onClick, icon }: any) => (
    <button data-testid="button" onClick={onClick}>
      {icon}
    </button>
  ),
  Checkbox: ({ checked, onChange }: any) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      data-testid="checkbox"
    />
  ),
}));

const mockItem: Item = { label: 'Test Item', status: 'INCOMPLETE' };

describe('TodoItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the todo item with initial data', () => {
    render(
      <TodoItem name="Test List" item={mockItem} storageName="test-storage" />,
    );

    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByTestId('checkbox')).not.toBeChecked();
  });

  test('should remove the item when delete button is clicked', () => {
    mockGetItem.mockReturnValueOnce([mockItem]);

    render(
      <TodoItem name="Test List" item={mockItem} storageName="test-storage" />,
    );

    const deleteButton = screen.getByTestId('button');
    fireEvent.click(deleteButton);

    expect(mockGetItem).toHaveBeenCalledWith('Test List');
    expect(mockSetItem).toHaveBeenCalledWith('Test List', []);
  });

  test('should toggle the item status when checkbox is clicked', async () => {
    mockGetItem.mockReturnValueOnce([mockItem]);

    render(
      <TodoItem name="Test List" item={mockItem} storageName="test-storage" />,
    );

    const checkbox = screen.getByTestId('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith('Test List', [
        { ...mockItem, status: 'COMPLETE' },
      ]);
    });

    mockGetItem.mockReturnValueOnce([{ ...mockItem, status: 'COMPLETE' }]);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith('Test List', [
        { ...mockItem, status: 'INCOMPLETE' },
      ]);
    });
  });

  test('should toggle the item status when label is clicked', async () => {
    mockGetItem.mockReturnValueOnce([mockItem]);

    render(
      <TodoItem name="Test List" item={mockItem} storageName="test-storage" />,
    );

    const label = screen.getByText('Test Item');
    fireEvent.click(label);

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith('Test List', [
        { ...mockItem, status: 'COMPLETE' },
      ]);
    });

    mockGetItem.mockReturnValueOnce([{ ...mockItem, status: 'COMPLETE' }]);
    fireEvent.click(label);

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith('Test List', [
        { ...mockItem, status: 'INCOMPLETE' },
      ]);
    });
  });
});

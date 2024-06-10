import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TodoAddNewItem } from '..';
import { message } from 'antd';

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

jest.mock('antd', () => {
  const originalModule = jest.requireActual('antd');
  return {
    ...originalModule,
    Form: Object.assign(
      ({ children, form, onFinish }: any) => (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form?.submit();
            onFinish();
          }}
        >
          {children}
        </form>
      ),
      { useForm: jest.fn().mockReturnValue([jest.fn(), {}]) },
    ),
    message: {
      success: jest.fn(),
      error: jest.fn(),
    },
  };
});

describe('TodoAddNewItem', () => {
  const mockOnClose = jest.fn();
  const mockListName = 'Test List';
  const mockStorageName = 'test-storage';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the add new item modal', () => {
    render(
      <TodoAddNewItem
        onClose={mockOnClose}
        isOpen={true}
        listName={mockListName}
        storageName={mockStorageName}
      />,
    );

    expect(screen.getByText('Add New Item')).toBeInTheDocument();
    expect(screen.getByText('Item Name')).toBeInTheDocument();
  });

  test('should add a new item to the list when form is submitted', async () => {
    const mockItemName = 'New Item';
    const mockItems = [{ status: 'INCOMPLETE', label: 'Test Item' }];
    mockGetItem.mockReturnValueOnce(mockItems);

    render(
      <TodoAddNewItem
        onClose={mockOnClose}
        isOpen={true}
        listName={mockListName}
        storageName={mockStorageName}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: mockItemName } });

    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(mockSetItem).toHaveBeenCalledWith(mockListName, [
        ...mockItems,
        { status: 'INCOMPLETE', label: mockItemName },
      ]);
      expect(message.success).toHaveBeenCalledWith(
        'New item added to the list successfully!',
      );
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('should show an error message if the list does not exist', async () => {
    mockGetItem.mockReturnValueOnce(null);

    render(
      <TodoAddNewItem
        onClose={mockOnClose}
        isOpen={true}
        listName={mockListName}
        storageName={mockStorageName}
      />,
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New Item' } });

    const okButton = screen.getByText('OK');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        'Failed to add item. The list does not exist.',
      );
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TodoContainer from '..';

const mockGetAllItems = jest.fn();
const mockAddChangeListener = jest.fn();
const mockRemoveChangeListener = jest.fn();

jest.mock('../../../utils/storage', () => ({
  LocalStorageUtils: {
    getInstance: jest.fn(() => ({
      getAllItems: mockGetAllItems,
      addChangeListener: mockAddChangeListener,
      removeChangeListener: mockRemoveChangeListener,
    })),
  },
}));

jest.mock('../../todo-list', () => ({
  TodoList: jest.fn(({ name }) => <div data-testid="todo-list">{name}</div>),
}));

jest.mock('antd', () => {
  const actualAntd = jest.requireActual('antd');
  return {
    ...actualAntd,
    Card: ({ children, className }: any) => (
      <div data-testid="card" className={className}>
        {children}
      </div>
    ),
  };
});

describe('TodoContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the container with no lists when storage is empty', () => {
    mockGetAllItems.mockReturnValueOnce({});

    render(<TodoContainer storageName="test-storage" />);
    expect(screen.queryByTestId('card')).toBeNull();
  });

  test('should render the container with lists from storage', () => {
    mockGetAllItems.mockReturnValueOnce({
      'List 1': [{ label: 'Item 1', status: 'INCOMPLETE' }],
      'List 2': [{ label: 'Item 2', status: 'COMPLETE' }],
    });

    render(<TodoContainer storageName="test-storage" />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getAllByTestId('todo-list')).toHaveLength(2);
    expect(screen.getByText('List 1')).toBeInTheDocument();
    expect(screen.getByText('List 2')).toBeInTheDocument();
  });

  test('should add and remove change listener on mount and unmount', () => {
    const { unmount } = render(<TodoContainer storageName="test-storage" />);

    expect(mockAddChangeListener).toHaveBeenCalledTimes(1);
    unmount();
    expect(mockRemoveChangeListener).toHaveBeenCalledTimes(1);
  });

  test('should update lists when local storage changes', async () => {
    mockGetAllItems.mockReturnValueOnce({
      'List 1': [{ label: 'Item 1', status: 'INCOMPLETE' }],
    });

    render(<TodoContainer storageName="test-storage" />);

    const [onLocalStorageChange] = mockAddChangeListener.mock.calls[0];

    onLocalStorageChange('List 2', [{ label: 'Item 2', status: 'COMPLETE' }]);

    await waitFor(() => {
      expect(screen.getByText('List 1')).toBeInTheDocument();
      expect(screen.getByText('List 2')).toBeInTheDocument();
    });

    onLocalStorageChange('List 1', null);

    await waitFor(() => {
      expect(screen.queryByText('List 1')).toBeNull();
      expect(screen.getByText('List 2')).toBeInTheDocument();
    });
  });
});

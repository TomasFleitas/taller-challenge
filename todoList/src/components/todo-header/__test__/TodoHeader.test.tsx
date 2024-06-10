import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoHeader from '..';

jest.mock('../../todo-add-new-list', () => ({
  TodoAddNewList: jest.fn(() => <div data-testid="todo-add-new-list" />),
}));

jest.mock('antd', () => {
  const actualAntd = jest.requireActual('antd');
  return {
    ...actualAntd,
    Select: Object.assign(
      ({ onChange, defaultValue, style, children }: any) => (
        <select
          data-testid="select"
          defaultValue={defaultValue}
          onChange={(e) => onChange(e.target.value)}
          style={style}
        >
          {children}
        </select>
      ),
      {
        Option: ({ value, children }: any) => (
          <option value={value} data-testid={`select-option-${value}`}>
            {children}
          </option>
        ),
      },
    ),
    Button: ({ onClick, icon }: any) => (
      <button data-testid="button" onClick={onClick}>
        {icon}
      </button>
    ),
  };
});

describe('TodoHeader', () => {
  test('should render the header with default title', () => {
    render(<TodoHeader title="" storageName="test-storage" />);
    expect(screen.getByText('TODO LIST')).toBeInTheDocument();
  });

  test('should render the header with custom title', () => {
    render(
      <TodoHeader title="My Custom Todo List" storageName="test-storage" />,
    );
    expect(screen.getByText('My Custom Todo List')).toBeInTheDocument();
  });

  test('should open modal when add button is clicked', () => {
    render(<TodoHeader title="" storageName="test-storage" />);

    const addButton = screen.getByTestId('button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('todo-add-new-list')).toBeInTheDocument();
  });

  /* test('should trigger onFilter when a filter is selected', () => {
    render(<TodoHeader title="" storageName="test-storage" />);

    const select: any = screen.getByTestId('select');
    fireEvent.change(select, { target: { value: 'completed' } });

    expect(select.value).toBe('completed');
  }); */
});

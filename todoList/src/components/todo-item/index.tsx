import { Button, Checkbox } from 'antd';
import React, { useCallback, useRef } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import './index.css';
import { LocalStorageUtils } from '../../utils/storage';

export const TodoItem = ({ name, item, storageName }: TodoItemProps) => {
  const localStorageUtils = useRef(LocalStorageUtils.getInstance(storageName));
  const Storage = localStorageUtils.current;

  const removeItem = useCallback(() => {
    const listItems = Storage.getItem(name);
    if (listItems) {
      const updatedItems = listItems.filter(
        (innerItem) => innerItem.label !== item.label,
      );
      Storage.setItem(name, updatedItems);
    }
  }, [name, item]);

  const handleCheckboxChange = useCallback(() => {
    const listItems = Storage.getItem(name);

    if (listItems) {
      const updatedItems: Item[] = listItems.map((innerItem) =>
        innerItem.label === item.label
          ? {
              ...innerItem,
              status:
                innerItem.status === 'COMPLETE' ? 'INCOMPLETE' : 'COMPLETE',
            }
          : innerItem,
      );
      Storage.setItem(name, updatedItems);
    }
  }, [name, item]);

  return (
    <div className="todo-item">
      <div className="todo-item-text">
        <Checkbox
          checked={item.status === 'COMPLETE'}
          onChange={handleCheckboxChange}
        />
        <span
          onClick={handleCheckboxChange}
          className={item.status === 'COMPLETE' ? 'completed' : 'incompleted'}
        >
          {item.label}
        </span>
      </div>
      <Button onClick={removeItem} icon={<DeleteOutlined />} />
    </div>
  );
};

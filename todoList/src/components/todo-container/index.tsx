import { Card } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { TodoList } from '../todo-list';
import { LocalStorageUtils } from '../../utils/storage';
import './index.css';

export const TodoContainer = ({ storageName }: TodoContainerProps) => {
  const localStorageUtils = useRef(LocalStorageUtils.getInstance(storageName));
  const Storage = localStorageUtils.current;

  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const initialLists = Storage.getAllItems();

    setLists(
      Object.entries(initialLists || {}).map(([name, items]) => ({
        name,
        items,
      })),
    );

    const onLocalStorageChange = (name: string, items: Item[]) => {
      setLists((prev) => {
        if (!name) return prev;
        const listExists = prev.some((list) => list.name === name);
        if (listExists && items === null) {
          return prev.filter((list) => list.name !== name);
        } else if (!listExists && items !== null) {
          return [...prev, { name, items }];
        }
        return prev;
      });
    };

    Storage.addChangeListener(onLocalStorageChange);
    return () => {
      Storage.removeChangeListener(onLocalStorageChange);
    };
  }, []);

  return (
    <>
      {Boolean(lists.length) && (
        <Card className="todo-container">
          {lists.map((list) => (
            <TodoList key={list.name} storageName={storageName} {...list} />
          ))}
        </Card>
      )}
    </>
  );
};

export default TodoContainer;

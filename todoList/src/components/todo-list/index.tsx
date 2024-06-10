import { Button, Card, Divider, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { TodoAddNewItem } from '../todo-add-new-item';
import { UnorderedListOutlined, DeleteOutlined } from '@ant-design/icons';
import { TodoItem } from '../todo-item';
import './index.css';
import { LocalStorageUtils } from '../../utils/storage';

export const TodoList = ({ name, items: initialItems, storageName }: List) => {
  const localStorageUtils = useRef(LocalStorageUtils.getInstance(storageName));
  const Storage = localStorageUtils.current;

  const [items, setItems] = useState(initialItems);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const onLocalStorageChange = (
      changedName: string,
      changedItems: Item[],
    ) => {
      if (changedName === name) {
        setItems(changedItems);
      }
    };

    Storage.addChangeListener(onLocalStorageChange);
    return () => {
      Storage.removeChangeListener(onLocalStorageChange);
    };
  }, [name]);

  const completed = items?.filter((item) => item.status === 'COMPLETE') || [];
  const incompleted =
    items?.filter((item) => item.status === 'INCOMPLETE') || [];

  const removeList = () => {
    Storage.removeItem(name);
    message.success('List removed successfully!');
  };

  return (
    <>
      <Card
        title={name}
        className="todo-list-component"
        extra={
          <div className="todo-list-component-header">
            <Button
              onClick={() => setOpenModal(true)}
              icon={<UnorderedListOutlined />}
            />
            <Button onClick={removeList} icon={<DeleteOutlined />} />
          </div>
        }
      >
        {incompleted?.map((item, index) => (
          <TodoItem
            storageName={storageName}
            key={`${index}-${name}`}
            name={name}
            item={item}
          />
        ))}

        {Boolean(completed.length) && <Divider>COMPLETE TASKS</Divider>}

        {completed?.map((item, index) => (
          <TodoItem
            storageName={storageName}
            key={`${index}-${name}`}
            name={name}
            item={item}
          />
        ))}
      </Card>
      <TodoAddNewItem
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        listName={name}
        storageName={storageName}
      />
    </>
  );
};

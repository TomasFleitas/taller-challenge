import React, { useState } from 'react';
import './index.css';
import { Button, Select } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { TodoAddNewList } from '../todo-add-new-list';

const { Option } = Select;

export const TodoHeader = ({ title, storageName }: TodoHeaderProps) => {
  const [openModal, setOpenModal] = useState(false);

  const onFilter = () => {};

  return (
    <>
      <div className="todo-list-header">
        <h5>{title || 'TODO LIST'}</h5>
        <div className="todo-list-controller">
          <Select onChange={onFilter} defaultValue="all" style={{ width: 110 }}>
            <Option value="all">All</Option>
            <Option value="completed">Completed</Option>
            <Option value="incompleted">Incompleted</Option>
          </Select>
          <Button
            onClick={() => setOpenModal(true)}
            icon={<AppstoreAddOutlined />}
          />
        </div>
      </div>
      <TodoAddNewList
        storageName={storageName}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </>
  );
};

export default TodoHeader;

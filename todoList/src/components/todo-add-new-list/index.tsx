import { Form, Input, Modal, message } from 'antd';
import React, { useCallback, useRef } from 'react';
import { LocalStorageUtils } from '../../utils/storage';

const { Item } = Form;

type FormValues = {
  name: string;
};

export const TodoAddNewList = ({
  onClose,
  isOpen,
  storageName,
}: TodoAddNewListProps) => {
  const localStorageUtils = useRef(LocalStorageUtils.getInstance(storageName));
  const Storage = localStorageUtils.current;

  const [form] = Form.useForm<FormValues>();

  const createNewTodoList = useCallback((values: FormValues) => {
    if (!Storage.keyExists(values.name)) {
      Storage.setItem(values.name, []);
      message.success('New todo list created successfully!');
      form.resetFields();
      onClose();
    } else {
      message.error(
        'A list with this name already exists. Please choose a different name.',
      );
    }
  }, [Storage]);

  return (
    <Modal
      onOk={form.submit}
      title="Create a new list"
      open={isOpen}
      onClose={onClose}
      onCancel={onClose}
    >
      <Form form={form} onFinish={createNewTodoList}>
        <Item
          label="List Name"
          name="name"
          rules={[
            { required: true, message: 'Please input the name of the list!' },
          ]}
        >
          <Input maxLength={80} showCount />
        </Item>
      </Form>
    </Modal>
  );
};

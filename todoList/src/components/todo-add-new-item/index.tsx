import { Form, Input, Modal, message } from 'antd';
import React, { useCallback, useRef } from 'react';
import { LocalStorageUtils } from '../../utils/storage';

const { Item } = Form;

type FormValues = {
  item: string;
};

export const TodoAddNewItem = ({
  onClose,
  isOpen,
  listName,
  storageName,
}: TodoAddNewItemProps) => {
  const localStorageUtils = useRef(LocalStorageUtils.getInstance(storageName));
  const Storage = localStorageUtils.current;
  const [form] = Form.useForm<FormValues>();

  const addNewItemToList = useCallback(
    (values: FormValues) => {
      const listItems = Storage.getItem(listName);
      if (listItems) {
        const updatedItems: Item[] = [
          ...listItems,
          { status: 'INCOMPLETE', label: values.item },
        ];
        Storage.setItem(listName, updatedItems);
        message.success('New item added to the list successfully!');
        form.resetFields();
        onClose();
      } else {
        message.error('Failed to add item. The list does not exist.');
      }
    },
    [listName],
  );

  return (
    <Modal
      onOk={form.submit}
      title="Add New Item"
      open={isOpen}
      onClose={onClose}
      onCancel={onClose}
    >
      <Form form={form} onFinish={addNewItemToList}>
        <Item
          label="Item Name"
          name="item"
          rules={[{ required: true, message: 'Please input the item!' }]}
        >
          <Input maxLength={150} showCount />
        </Item>
      </Form>
    </Modal>
  );
};

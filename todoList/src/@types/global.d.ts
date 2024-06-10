type LocalStorageChangeCallback = (key: string, newValue: Item[]) => void;

type TodoAddNewListProps = {
  onClose: () => void;
  isOpen: boolean;
  storageName?: string;
};

type Item = {
  label: string;
  status: 'COMPLETE' | 'INCOMPLETE';
};

type List = { name: string; items: Item[]; storageName?: string };

type TodoAddNewItemProps = {
  onClose: () => void;
  isOpen: boolean;
  listName: string;
  storageName?: string;
};

type TodoItemProps = {
  name: string;
  item: Item;
  storageName?: string;
};

type TodoHeaderProps = {
  storageName?: string;
  title?: string;
};

type TodoContainerProps = {
  storageName?: string;
};

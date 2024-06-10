import { LocalStorageUtils } from '../storage';

describe('LocalStorageUtils', () => {
  beforeEach(() => {
    localStorage.clear();
    (LocalStorageUtils as any).instances = {};
    (LocalStorageUtils as any).globalCallbacks = {};
    (LocalStorageUtils as any).originalMethodsOverridden = false;
  });

  test('should create an instance with the default namespace', () => {
    const utils = LocalStorageUtils.getInstance();
    expect(utils).toBeInstanceOf(LocalStorageUtils);
    expect((LocalStorageUtils as any).instances['default']).toBe(utils);
  });

  test('should create instances with different namespaces', () => {
    const utils1 = LocalStorageUtils.getInstance('namespace1');
    const utils2 = LocalStorageUtils.getInstance('namespace2');
    expect(utils1).not.toBe(utils2);
    expect((LocalStorageUtils as any).instances['namespace1']).toBe(utils1);
    expect((LocalStorageUtils as any).instances['namespace2']).toBe(utils2);
  });

  test('should set and get an item', () => {
    const utils = LocalStorageUtils.getInstance('test');
    const item: Item[] = [{ label: 'Test Item', status: 'INCOMPLETE' }];
    utils.setItem('itemKey', item);

    const retrievedItem = utils.getItem('itemKey');
    expect(retrievedItem).toEqual(item);
  });

  test('should remove an item', () => {
    const utils = LocalStorageUtils.getInstance('test');
    const item: Item[] = [{ label: 'Test Item', status: 'INCOMPLETE' }];
    utils.setItem('itemKey', item);
    utils.removeItem('itemKey');

    const retrievedItem = utils.getItem('itemKey');
    expect(retrievedItem).toBeNull();
  });

  test('should clear all items in the namespace', () => {
    const utils = LocalStorageUtils.getInstance('test');
    utils.setItem('itemKey1', [{ label: 'Item 1', status: 'INCOMPLETE' }]);
    utils.setItem('itemKey2', [{ label: 'Item 2', status: 'COMPLETE' }]);
    utils.clear();

    expect(utils.getItem('itemKey1')).toBeNull();
    expect(utils.getItem('itemKey2')).toBeNull();
  });

  test('should check if a key exists', () => {
    const utils = LocalStorageUtils.getInstance('test');
    utils.setItem('itemKey', [{ label: 'Test Item', status: 'INCOMPLETE' }]);

    expect(utils.keyExists('itemKey')).toBe(true);
    expect(utils.keyExists('nonExistentKey')).toBe(false);
  });

  test('should get all items in the namespace', () => {
    const utils = LocalStorageUtils.getInstance('test');
    const item1: Item[] = [{ label: 'Item 1', status: 'INCOMPLETE' }];
    const item2: Item[] = [{ label: 'Item 2', status: 'COMPLETE' }];
    utils.setItem('itemKey1', item1);
    utils.setItem('itemKey2', item2);

    const allItems = utils.getAllItems();
    expect(allItems).toEqual({
      itemKey1: item1,
      itemKey2: item2,
    });
  });

  test('should add and remove change listeners', () => {
    const utils = LocalStorageUtils.getInstance('test');
    const callback = jest.fn();
    utils.addChangeListener(callback);

    utils.setItem('itemKey', [{ label: 'Test Item', status: 'INCOMPLETE' }]);
    expect(callback).toHaveBeenCalledWith('itemKey', [
      { label: 'Test Item', status: 'INCOMPLETE' },
    ]);

    utils.removeChangeListener(callback);
    utils.setItem('itemKey', [{ label: 'Updated Item', status: 'COMPLETE' }]);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

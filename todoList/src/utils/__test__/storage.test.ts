import { LocalStorageUtils } from '../storage';

describe('LocalStorageUtils', () => {
  let storage: { [key: string]: string };
  let localStorageMock: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
    key: jest.Mock;
    length: number;
  };

  beforeEach(() => {
    storage = {};
    localStorageMock = {
      getItem: jest.fn((key) => storage[key] || null),
      setItem: jest.fn((key, value) => {
        storage[key] = value;
      }),
      removeItem: jest.fn((key) => {
        delete storage[key];
      }),
      clear: jest.fn(() => {
        storage = {};
      }),
      key: jest.fn((index) => Object.keys(storage)[index] || null),
      get length() {
        return Object.keys(storage).length;
      },
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  test('should create an instance with the default namespace', () => {
    const instance = LocalStorageUtils.getInstance();
    expect(instance).toBeInstanceOf(LocalStorageUtils);
    expect(instance['namespace']).toBe('default');
  });

  test('should create instances with different namespaces', () => {
    const instance1 = LocalStorageUtils.getInstance('namespace1');
    const instance2 = LocalStorageUtils.getInstance('namespace2');
    expect(instance1).not.toBe(instance2);
  });

  test('should check if a key exists', () => {
    const instance = LocalStorageUtils.getInstance('testNamespace');
    instance.setItem('key1', [{ label: 'test1', status: 'INCOMPLETE' }]);
    expect(instance.keyExists('key1')).toBe(true);
    expect(instance.keyExists('key2')).toBe(false);
  });

  test('should get all items in the namespace', () => {
    const instance = LocalStorageUtils.getInstance('testNamespace');
    const value1: Item[] = [{ label: 'test1', status: 'INCOMPLETE' }];
    const value2: Item[] = [{ label: 'test2', status: 'COMPLETE' }];
    instance.setItem('key1', value1);
    instance.setItem('key2', value2);

    const allItems = instance.getAllItems();
    expect(allItems).toEqual({
      key1: value1,
      key2: value2,
    });
  });

  test('should add and remove change listeners', () => {
    const instance = LocalStorageUtils.getInstance('testNamespace');
    const callback = jest.fn();

    instance.addChangeListener(callback);
    expect(LocalStorageUtils['globalCallbacks']['testNamespace']).toContain(
      callback,
    );

    instance.removeChangeListener(callback);
    expect(LocalStorageUtils['globalCallbacks']['testNamespace']).not.toContain(
      callback,
    );
  });
});

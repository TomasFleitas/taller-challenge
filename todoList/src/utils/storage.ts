export class LocalStorageUtils {
  private static instances: { [namespace: string]: LocalStorageUtils } = {};
  private static originalMethodsOverridden = false;
  private static globalCallbacks: {
    [namespace: string]: LocalStorageChangeCallback[];
  } = {};
  private namespace: string;

  private constructor(namespace: string = 'default') {
    this.namespace = namespace;
    if (!LocalStorageUtils.globalCallbacks[this.namespace]) {
      LocalStorageUtils.globalCallbacks[this.namespace] = [];
    }
    if (!LocalStorageUtils.originalMethodsOverridden) {
      this.overrideOriginalLocalStorageMethods();
      LocalStorageUtils.originalMethodsOverridden = true;
    }
    this.listenToStorageEvents();
  }

  public static getInstance(namespace: string = 'default'): LocalStorageUtils {
    if (!LocalStorageUtils.instances[namespace]) {
      LocalStorageUtils.instances[namespace] = new LocalStorageUtils(namespace);
    }
    return LocalStorageUtils.instances[namespace];
  }

  private getKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  private overrideOriginalLocalStorageMethods() {
    const originalSetItem = localStorage.setItem.bind(localStorage);
    const originalRemoveItem = localStorage.removeItem.bind(localStorage);
    const originalClear = localStorage.clear.bind(localStorage);

    localStorage.setItem = (key, value) => {
      originalSetItem(key, JSON.stringify(value));
      const namespace = key.split(':')[0];
      this.dispatchLocalStorageChangeEvent(key, value, namespace);
    };

    localStorage.removeItem = (key) => {
      const namespace = key.split(':')[0];
      originalRemoveItem(key);
      this.dispatchLocalStorageChangeEvent(key, null, namespace);
    };

    localStorage.clear = () => {
      const keys = Object.keys(localStorage);
      originalClear();
      keys.forEach((key) => {
        const namespace = key.split(':')[0];
        this.dispatchLocalStorageChangeEvent(key, null, namespace);
      });
    };
  }

  private listenToStorageEvents() {
    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage) {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        const namespace = event.key ? event.key.split(':')[0] : null;
        this.handleStorageEvent(event.key!, newValue, namespace!);
      }
    });
  }

  private dispatchLocalStorageChangeEvent(
    key: string,
    newValue: string | null,
    namespace: string,
  ) {
    const event = new CustomEvent('localStorageChange', {
      detail: { key, newValue, namespace },
    });
    window.dispatchEvent(event);
    this.handleStorageEvent(key, newValue, namespace);
  }

  private handleStorageEvent(
    key: string,
    newValue: string | null,
    namespace: string,
  ) {
    if (namespace && key && key.startsWith(namespace + ':')) {
      const shortKey = key.slice(namespace.length + 1);
      if (LocalStorageUtils.globalCallbacks[namespace]) {
        LocalStorageUtils.globalCallbacks[namespace].forEach((callback) => {
          callback(shortKey, newValue && JSON.parse(newValue) || null);
        });
      }
    }
  }

  public addChangeListener(callback: LocalStorageChangeCallback) {
    if (!LocalStorageUtils.globalCallbacks[this.namespace].includes(callback)) {
      LocalStorageUtils.globalCallbacks[this.namespace].push(callback);
    }
  }

  public removeChangeListener(callback: LocalStorageChangeCallback) {
    if (LocalStorageUtils.globalCallbacks[this.namespace]) {
      LocalStorageUtils.globalCallbacks[this.namespace] =
        LocalStorageUtils.globalCallbacks[this.namespace].filter(
          (cb) => cb !== callback,
        );
    }
  }

  public setItem(key: string, value: Item[]) {
    localStorage.setItem(this.getKey(key), JSON.stringify(value));
  }

  public getItem(key: string): Item[] {
    const value = localStorage.getItem(this.getKey(key));
    return value ? JSON.parse(JSON.parse(value)) : null;
  }

  public removeItem(key: string) {
    localStorage.removeItem(this.getKey(key));
  }

  public clear() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(this.namespace + ':')) {
        localStorage.removeItem(key);
      }
    });
  }

  public keyExists(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  public getAllItems(): { [key: string]: Item[] } {
    const items: { [key: string]: Item[] } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.namespace + ':')) {
        const shortKey = key.slice(this.namespace.length + 1);
        items[shortKey] = JSON.parse(
          JSON.parse(localStorage.getItem(key) as string),
        );
      }
    }
    return items;
  }
}

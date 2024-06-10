import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import { TodoContainer, TodoHeader } from './components';

const App = () => (
  <>
    <TodoHeader storageName="test" />
    <TodoContainer storageName="test" />
    <TodoContainer storageName="test" />
    {/* Changing the storage name we changed the namespace, which means, we can work with different TodoHeader and TodoContainer in different places of the react application (in any Node level)  */}
    <TodoHeader storageName="test2" />
    <TodoContainer storageName="test2" />
  </>
);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);

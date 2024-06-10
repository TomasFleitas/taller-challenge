import React from 'react';
import ReactDOM from 'react-dom/client';
import TodoHeader from 'todo/TodoHeader';
import TodoContainer from 'todo/TodoContainer';

import './index.css';

const App = () => (
  <>
    <TodoHeader storageName="test" />
    <TodoContainer storageName="test" />

    {/* Changing the storage name we changed the namespace, which means, we can work with different TodoHeader and TodoContainer in different places of the react application (in any Node level)  */}

    <TodoHeader storageName="test-2" />
    <TodoContainer storageName="test-2" />
  </>
);
const rootElement = document.getElementById('app');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(<App />);

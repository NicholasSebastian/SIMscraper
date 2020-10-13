import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

const server =
    process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 
    'http://localhost:8000/api/data' : '/api/data';

function App () {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [data, setData] = useState<Object>();
  const loginHandler = () => {
    fetch(server, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => setData(data));
  }

  return (
    <div style={{ width: 700, margin: '0 auto', padding: 20, backgroundColor: '#ddd' }}>
      <h1>Login</h1>
      <input type="text" onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={loginHandler}>LOGIN</button>
      <pre>{JSON.stringify(data, null, "\t")}</pre>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();

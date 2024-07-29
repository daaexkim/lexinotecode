import React, { useState } from 'react';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'user' && password === 'pass') {
      onLogin(true);  // 로그인 성공을 true로 전달
    } else {
      onLogin(false);  // 로그인 실패를 false로 전달
      alert('로그인 정보가 올바르지 않습니다.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>로그인</h2>
        <input
          type="text"
          placeholder="사용자 이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;

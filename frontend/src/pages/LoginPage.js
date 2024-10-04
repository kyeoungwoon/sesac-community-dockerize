import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
const API = require("../configs/api.json");

export default function LoginPage() {
  /* 사용되는 두 가지 변수 초기화 */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUserInfo } = useContext(UserContext);
  async function login(event) {
    event.preventDefault(); /* 페이지가 변경되지 않도록 막기 */
    const response = await fetch(API.URL + "/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.status === 200) {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
        alert("로그인에 성공했습니다.");
        setRedirect(true);
      });
    } else {
      alert("로그인에 실패했습니다.");
    }
  }
  /* React의 상태 관리를 통해 redirect가 true가 되는 순간 이동 */
  if (redirect) {
    return <Navigate to={"/"} />;
  }
  return (
    /* 버튼을 클릭하면 login() 함수가 호출 */
    <form className="login" onSubmit={login}>
      <h2>로그인</h2>
      {/* onChange() 함수: username 및 password 변수의 값을 변경 */}
      <input
        type="text"
        placeholder="아이디"
        onChange={(event) => setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        onChange={(event) => setPassword(event.target.value)}
      />
      <button>로그인</button>
    </form>
  );
}

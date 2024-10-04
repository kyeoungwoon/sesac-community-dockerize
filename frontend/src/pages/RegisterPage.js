import { useState } from "react"; /* state 사용하기 */
const API = require("../configs/api.json");

export default function RegisterPage() {
  /* 사용되는 두 가지 변수 초기화 */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  async function register(event) {
    event.preventDefault(); /* 페이지가 변경되지 않도록 막기 */
    const response = await fetch(API.URL + "/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("회원가입에 성공했습니다.");
    } else {
      alert("회원가입에 실패했습니다.");
    }
  }
  return (
    /* 버튼을 클릭하면 register() 함수가 호출 */
    <form className="register" onSubmit={register}>
      <h2>회원가입</h2>
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
      <button>회원가입</button>
    </form>
  );
}

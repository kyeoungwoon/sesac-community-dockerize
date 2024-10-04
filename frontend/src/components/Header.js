import { Link } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
const API = require("../configs/api.json");

// git test
// git test2

export default function Header() {
  const { userInfo, setUserInfo } = useContext(UserContext);

  useEffect(() => {
    fetch(API.URL + "/profile", {
      credentials: "include",
    }).then((response) => {
      if (response.ok) {
        console.log("RESPONSE OK");
        response.json().then((userInfo) => {
          setUserInfo(userInfo);
        });
      }
    });
  }, [setUserInfo]);

  function logout() {
    fetch(API.URL + "/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">
        우주 블로그
      </Link>
      <nav>
        {username && (
          <>
            <Link to="/create">글쓰기</Link>
            <a onClick={logout}>로그아웃</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">로그인</Link>
            <Link to="/register">회원가입</Link>
          </>
        )}
      </nav>
    </header>
  );
}

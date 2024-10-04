const express = require("express");
const cors = require("cors"); /* CORS 오류 해결 */
const app = express(); /* Express 서버 객체 초기화 */
const mongoose = require("mongoose");

const User = require("./models/User");
const Post = require("./models/Post");

const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const config = require("./config.json");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploaded/" });
const fs = require("fs");

// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
const corsOptions = {
  origin: [
    "http://test.skyofseoul.synology.me",
    "https://test.skyofseoul.synology.me",
    "http://localhost:3000",
  ], // 허용할 출처
  credentials: true, // 자격 증명 허용
};
app.use(cors(corsOptions));
app.use(express.json()); /* JSON 형식으로 반환 */
app.use(cookieParser());
app.use("/uploaded", express.static(__dirname + "/uploaded"));

mongoose.connect(config.db_string);
const secret = config.jwt_key;

/* POST 방식으로 회원가입 API 열어주기 */
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await User.create({ username, password });
    res.json(result);
  } catch (e) {
    res.status(400).json(e);
  }
});

/* POST 방식으로 로그인 API 열어주기 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = await User.findOne({ username });
  if (result == null) {
    res.status(400).json("Incorrect information.");
  } else {
    /* 사용자가 입력한 비밀번호가 정확하다면 */
    const check = password == result.password;
    if (check) {
      /* JWT 토큰 발급 */
      jwt.sign({ username, id: result._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          username,
          id: result._id,
        });
      });
    } else {
      res.status(400).json("Incorrect information.");
    }
  }
});

app.get("/profile", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File not uploaded" });
  }

  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;

  // 비동기적 파일명 변경
  fs.rename(path, newPath, (err) => {
    if (err) {
      return res.status(500).json({ error: "File rename failed" });
    }

    const token = req.cookies.token;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { title, summary, content } = req.body;

      try {
        const result = await Post.create({
          title,
          summary,
          content,
          cover: newPath,
          author: info.id,
        });
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: "Failed to create post" });
      }
    });
  });
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id);
    if (!postDoc) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(postDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

app.listen(7777, () => {
  console.log("Server is running");
});

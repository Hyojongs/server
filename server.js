var express = require("express");
const request = require("request");
const cors = require("cors");
const app = express();
const crypto = require("crypto");

const port = 5000;

// 복호화 키
let enckey = "VQB!9Ys^UCJziJ6PjGWXXERV1agfzgaT";

// 디코딩 function
function decrypt(text, key) {
  const buf = Buffer.from(text, "base64");
  const iv = buf.slice(0, 16);
  const data = buf.toString("base64", 16);

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decryptedText = Buffer.concat([
    decipher.update(data, "base64"),
    decipher.final(),
  ]).toString("utf-8");

  return decryptedText;
}

app.use(express.json());
app.use(cors());

app.post("/serch", (req, res, next) => {});

// 요청 보내기
app.get("/serch", function (req, res) {
  let api_url = "https://api.thecheat.co.kr/api/v2/fraud/search";
  let client_id =
    "ZnAxZ0RyY0tsTEV0bFFJUVVkLzZKNm0xWEx2L3J1U1R8dkFxMGN0SU5Ud289";
  console.log("query: " + req.query.keywordtype);
  let options = {
    url: api_url,
    body: JSON.stringify({
      keyword_type: `${req.query.keywordtype}`,
      keyword: `${req.query.keyword}`,
    }),

    headers: {
      "X-TheCheat-ApiKey": client_id,
    },
  };
  console.log(options.body);

  // 응답 보내기
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      let code = JSON.parse(body);
      console.log(code);
      let beftext = code.content;
      let afttext = decrypt(beftext, enckey);
      console.log(afttext);
      res.json(afttext);
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
});

app.use((error, req, res, next) => {
  if (error) {
    res.status(400).send("error");
  } else {
    res.status(500).send("sorry try later");
  }
});

app.listen(port, function () {
  console.log(
    `http://localhost:${port}/translate app listening on port ${port}!`
  );
});

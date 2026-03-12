// 로컬 환경에서 .env 파일의 변수를 불러오기 위함 (Render에서는 자체 환경변수를 사용함)
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const app = express();
// Render는 내부적으로 포트를 할당하므로 process.env.PORT를 사용해야 합니다.
const port = process.env.PORT || 3000;

// Neon 데이터베이스 연결 풀 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon DB 연결 시 SSL 필수
  }
});

app.get('/', async (req, res) => {
  try {
    // test 테이블에서 레코드 1개만 조회
    const query = 'SELECT name FROM test LIMIT 1;';
    const result = await pool.query(query);

    // 데이터가 존재하는 경우
    if (result.rows.length > 0) {
      const name = result.rows[0].name;
      res.send(`Hello ${name}`);
    } else {
      // 테이블에 데이터가 없는 경우의 예외 처리
      res.send('Hello (데이터가 없습니다)');
    }
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).send('데이터베이스 조회 중 오류가 발생했습니다.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

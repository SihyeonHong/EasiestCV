import { Pool } from "pg";

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  ssl: {
    rejectUnauthorized: false, // 개발 목적으로만 사용; 실제 운영 환경에서는 유효한 SSL 인증서를 사용하세요
  },
});

export async function query<T = unknown>(
  text: string,
  params?: (string | number | boolean | null)[],
) {
  const res = await pool.query(text, params);
  return res.rows as T[];
}

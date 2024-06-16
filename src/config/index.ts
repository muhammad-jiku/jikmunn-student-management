import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  port: process.env.PORT,
  db_uri: process.env.DB_URI,
  default_user_pass: process.env.DEFAULT_USER_PASS,
}

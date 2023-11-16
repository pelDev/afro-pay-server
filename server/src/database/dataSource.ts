import path from 'path'
import { DataSource } from 'typeorm'
import { readEnv } from '../setup/readEnv'


const DB_HOSTNAME: string = readEnv('DB_HOST', 'localhost') as string
const PORT: number = readEnv('DB_PORT', 3306, true) as number
const DB_USERNAME: string = readEnv('DB_USERNAME', 'root') as string
const DB_PASSWORD: string = readEnv('DB_PASSWORD', '') as string
const DB_DATABASE: string = readEnv('DB_DATABASE', 'test_ecommerce') as string

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOSTNAME,
  port: PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: false,
  entities: [
    path.join(__dirname, '../entity/*.{js,ts}')
  ],
  migrations: [],
  subscribers: []
})

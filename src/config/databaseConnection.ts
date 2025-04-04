import pgPromise from "pg-promise"
import { DATABASE_URL } from "@config/constants.ts"

const pgp = pgPromise()
export const db = pgp(DATABASE_URL)
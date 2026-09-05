import { db } from './src/server/db/index.js';
import { businesses } from './src/server/db/schema.js';

async function run() {
  try {
    const res = await db.query.businesses.findFirst();
    console.log(res);
  } catch (err: any) {
    console.error(err.message);
  }
}
run();

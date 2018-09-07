import { createConnection, getManager, Repository} from "typeorm";
import 'reflect-metadata';

import { config } from "../../config";
import { User } from "../../entity/User";
import { Pet } from "../../entity/Pet";
import { AuthToken } from "../../entity/AuthToken";

async function initDB() {
  let connection = await createConnection({
    type: 'sqlite',
    database: config.DB_URL,
    synchronize: true,
    logging: false,
    entities: [
       'entity/**/*.ts'
    ]
 })

 await connection.getRepository(User).clear();

 await connection.getRepository(Pet).clear();

 await connection.getRepository(AuthToken).clear();

 return connection;
}

async function closeDB() {
 let manager = getManager();

 await manager.getRepository(User).clear();

 await manager.getRepository(Pet).clear();

 await manager.getRepository(AuthToken).clear();

 await manager.connection.close()
}



export { initDB, closeDB }
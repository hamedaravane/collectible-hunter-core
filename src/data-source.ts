import "reflect-metadata"
import { DataSource } from "typeorm"
import {TokenEntity} from "./entity/token.entity";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "11559933",
    database: "test",
    entities: [TokenEntity],
    synchronize: true,
    logging: false,
});

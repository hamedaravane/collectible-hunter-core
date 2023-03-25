import "reflect-metadata"
import { DataSource } from "typeorm"
import {TokenEntity} from "./entity/token.entity";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "11559933",
    database: "test",
    entities: [TokenEntity],
    synchronize: true,
    logging: true,
});

AppDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!")
    // const token = await tokenRepo.find()
}).catch((err) => {
    console.log(err.message);
});

export default AppDataSource;
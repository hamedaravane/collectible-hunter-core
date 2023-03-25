import { DataSource } from "typeorm"

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "11559933",
    database: "test",
    entities: [],
    synchronize: true,
    logging: false,
});

AppDataSource.initialize().then(() => {

}).catch((err) => {
    console.log(err);
})
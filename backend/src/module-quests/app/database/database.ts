// import {Sequelize} from 'sequelize'
// const fs = require('fs');

// let sequelize: Sequelize;

// /*************** WHEN TESTING CHANGE DB *****************/
// const DB_NAME = process.env.NODE_ENV == "test" ? process.env.TEST_DB_NAME : process.env.DB_NAME;

// /*************** IN PRODUCTION CHANGE DB DIALECT OPTIONS *****************/
// const dialectOpt = process.env.NODE_ENV == "production" ? {
//   bigNumberStrings: true,
//   /*
//   ssl: {
//     require: true,
//     ca: fs.readFileSync("/cert/ca-certificate.crt")
//   }
//   */
// } : {};

// /*************** SEQUELIZE ESTABLISHES CONECTION WITH DB *****************/
// sequelize = new Sequelize(
//     DB_NAME as string,
//     process.env.DB_USERNAME as string,
//     process.env.DB_PASSWORD as string,
//     {
//         host: process.env.DB_HOST,
//         dialect: 'postgres',
//         logging: false,
//         port: parseInt(process.env.DB_PORT!),
//         ssl: true,
//         dialectOptions: dialectOpt
// });


// export {
//     sequelize
// }
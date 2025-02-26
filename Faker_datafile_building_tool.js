const { faker } = require('@faker-js/faker');
const fs = require('fs'); // Import the filesystem module
const path = require('path'); // for cross-platform compatibility - platfomų kelio išsaugojimas
const readline = require('readline'); // for reading user input - vartotojo įvedamų duoenų nuskaitymui

// Functions for creation of databases

let productIdCounter = 1;
function gererateProduct() {
    return {
        "id": productIdCounter++,
        "title": faker.commerce.productName(),
        "description": faker.commerce.productDescription(),
        "department": faker.commerce.department(),
        "price": faker.commerce.price({ min: 0.99, max: 9.99, decimal: 2, symbol: '€' })
    }
}

let categoryIdCounter = 1;
function generateCategory() {  // sukuria vieną kategoriją
    return {
        "id": categoryIdCounter++,
        "title": faker.commerce.department(),
        "description": faker.commerce.productDescription()
    }
}

let userIdCounter = 1;
function generateUser() {
    return {
        "id": userIdCounter++,
        "name": faker.person.firstName(),
        "surname": faker.person.lastName(),
        "phoneNo": faker.phone.number(),
        "email": faker.internet.email(),
        "userName": faker.internet.username(),
        "password": faker.internet.password(),
        "birthDate": faker.date.birthdate(),
        "bio": faker.person.bio()
    }
}

let companyIdCounter = 1
function generateCompany() {
    return {
        "companyId": companyIdCounter++,
        "name": faker.company.name(),
        "address": faker.location.streetAddress(),
        "city": faker.location.city(),
        "country": faker.location.country(),
        "phone": faker.phone.number()
    }
}

// functions for saving data in JSON and CSV formats

function jsonToCsv(jsonArray) {
    const csvHeader = Object.keys(jsonArray[0]).join(',') + '\n';
    let csvRows = "";
    for (let i = 0; i < jsonArray.length; i++) {
        let csvRow = Object.values(jsonArray[i]).join(',') + '\n';
        csvRows += csvRow;
    }
    return csvHeader + csvRows;
}

function createJSONresource(filePath, databaseElement, dataCount) {
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(databaseElement, null, 2), 'utf-8');
    const fileName = path.basename(filePath);
    console.log(`Duomenų bazė "${fileName}" sukurta ir išsaugota adresu "${filePath}"!. Joje yra ${dataCount} elementai(-ų/-as)`);
}

function createCSVresource(filePath, databaseElement, dataCount) {
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    fs.writeFileSync(filePath, jsonToCsv(databaseElement));
    const fileName = path.basename(filePath);
    console.log(`Duomenų bazė "${fileName}" sukurta ir išsaugota adresu "${filePath}"!. Joje yra ${dataCount} elementai(-ų/-as)`);
}

// User input for the amount of data to be generated

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question(`Ši programa sukuria duomenų bazes "products", "companies", "users", "category". Kiek duomenų objektų norite suvesti į kiekivieną duomenų failą? \n`, (dataCount) => {
    console.log(`Jūs paprašytas sukurti kiekvieno tipo objektų skaičius: ${dataCount}`);

    // Creation of "products" and saving the data in JSON and CSV formats

    const product = Array.from({ length: dataCount }, gererateProduct);
    createJSONresource("database_data/json/product.json", product, dataCount);
    createCSVresource("database_data/csv/product.csv", product, dataCount);

    // creation of "companies" and saving the data in JSON and CSV formats

    const company = Array.from({ length: dataCount }, generateCompany);
    createJSONresource("database_data/json/companies.json", company, dataCount);
    createCSVresource("database_data/csv/companies.csv", company, dataCount);

    // creation of "category" and saving the data in JSON and CSV formats

    const category = Array.from({ length: dataCount }, generateCategory);
    createCSVresource("database_data/csv/category.csv", category, dataCount);
    createJSONresource("database_data/json/category.json", category, dataCount);

    // creation of "users" and saving the data in JSON and CSV formats

    const users = Array.from({ length: dataCount }, generateUser);
    createJSONresource("database_data/json/users.json", users, dataCount);
    createJSONresource("database_data/csv/users.csv", users, dataCount);

    rl.close();
})
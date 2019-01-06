# Coffee Machine Project

Web Application which is Coffee Machine System. Client layer application is responsible for requesting new coffees and to manage coffee machine via diagnostic panel. Server layer is responsible for preparation of coffee and to keep machine clean and stable.

## Getting Started

Project local setup guide

### Prerequisites

* Install Node.js in version of 8.12.0+ using binaries from official website https://nodejs.org/en/download/
* Install Vue.js following instructions from https://vuejs.org/v2/guide/installation.html
* Install Nest.js following instructions from https://docs.nestjs.com/

### Installing

* Clone project sources from repository using command
```
git clone https://github.com/mszumiel/coffee-machine-app.git 
```
* Switch to folder 'coffee-machine-client' and execute command
```
npm install 
```
* Switch to folder 'coffee-machine-server' and execute command
```
npm install 
```
* Start Backend Layer using command (it should start listening on port 3030)
```
npm run start
```
* Start Frontend Layer using command (it should start listening on port 3030)
```
npm run serve 
```
* To verify if application is working go to http://localhost:8080

## Running the tests

To run tests on backend layer execute following command
```
npm run test
```

## Deployment

* Build production package using following command (command is the same for both backend and frontend)
```
npm run build
```
* Built packages are ready to be deployed on selected server

## Built With

* [Nest.js](https://nestjs.com/) - The web framework used for backend layer
* [NPM](https://www.npmjs.com/) - Dependency Management and project build tool
* [Vue.js](https://vuejs.org/) - The web framework used for frontend layer
* [Google Material](https://material.io/design/) - Used for frontend design

## Authors

* **Maciej Szumielewicz** - https://github.com/mszumiel

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

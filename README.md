# StoraniZed

Project 2 - Pair progaming Nidian Martin & Adrián Díaz for Module 2 of WPTMAD0420",

## 1 - Scaffolding

![Scaffolding](https://res.cloudinary.com/dobsg5z2w/image/upload/v1598436813/scafolding.png "Folders structure")


### 1.1 - Create files:
* /app.js
* /.env
* /.env.template
* /.gitignore 
    - node_modules
    - package-lock.json
    - .env
    - .DS_Store

### 1.2 - npm init -y

Force install npm and configure package.json after.

### 1.3 - Add packages 
npm install:

* dependencies
  * express - Framework for node 
  * connect-mongo - Conect to DB
  * mongoose - Manage DB
  * dotenv - Use Environment Variables
  * cookie-parser - Manage cookies (userLogin)
  * bcrypt - Encrypt data (pass)
  * express-session - Create LOCAL sessions for loged users
  * passport -  Manage proccess login/register users
  * passport-google-oauth20 - Manage proccess login/register users (RRSS)
  * passport-slack - Manage proccess login/register users (RRSS)
  * faker - Get random data
  * hbs - Template engine
  * morgan - Manage logs on app
  * multer - Uploads files to cloud (Dependence)
  * multer-storage-cloudinary - Uploads files to cloud (Specific dependence)
  * cloudinary - Uploads files to cloud (provider) 
  * nodemailer - Send transactional emails
  * qrcode - generate qr


* devDependencies
  * nodemon - Wathcher changes and reload dev server
  * faker - Generate massive data


`npm i express connect-mongo mongoose dotenv bcrypt cookie-parser express-session passport passport-google-oauth20 passport-slack faker hbs morgan multer multer-storage-cloudinary cloudinary nodemailer qrcode --save & npm i nodemon faker --save-dev`

### 1.5 - Config scripts commands cli on package.json 

  * start: "node app.js",
  * dev: "nodemon -e ejs,js,css app.js",
  * seeds: "node ./bin/seeds"

### 1.5 - Add essentials Global Variables 

    /.env -> Add .gitignore file please
    /.env.template -> Rename for use

* PORT=
* CLOUDINARY_NAME=
* CLOUDINARY_KEY=
* CLOUDINARY_SECRET=
* MONGODB_URI=
* NM_PASS=
* NM_USER=
* SLACK_CLIENT_ID=
* SLACK_CLIENT_SECRET=
* GOOGLE_CLIENT_ID=
* GOOGLE_CLIENT_SECRET=
* SESSION_SECRET=
* SESSION_SECURE=
* SESSION_MAX_AGE=

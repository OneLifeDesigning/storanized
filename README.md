# StoraniZed

Project 2 - Pair programming Nidian Martin & Adrián Díaz for Module 2 of WPTMAD0420,

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

### 1.6 - Add essentials Global Variables 

    /.env -> Add .gitignore file please
    /.env.template -> Rename for use

## 2 - Models
  
## 3 - Routes

    User -[ PRIVATE ]-
    —Login—
    '/login' → get [view form login]
    '/login' → post [controller authenticate user]

    —Login RRSS—
    '/auth/slack' →  get [controller login RRSS]
    '/auth/google' →  get [controller login RRSS]
    '/auth/facebook' →  get [controller login RRSS]

    —Logout—
    '/logout' → post [controller disconect user]

    —Singnup—
    '/singnup' → get [view form create new user]
    '/singnup' → post [controller create new user]
    '/activate/:id/:token → get [controller validate/activate user]
    
    —Recoveries—
    '/password' →  get [view form change password]
    '/password' →  post [controller save new password]
    '/activate/:id/token' → get [view generate new activate token]
    '/activate/:id/token' → post [controller send new activate token to user]

    —Dashboard—
    '/dashboard' → get
    '/dashboard/:id/edit/' → post


    —Storage—
    '/storages/' → get [view all user storages]
    '/storages/create' → get
    '/storages/create' → post
    '/storages/:id/edit' → get
    '/storages/:id/save' → post
    '/storages/:id/delete' → post

    —Box—
    '/boxes/' → get [view all user boxes]
    '/boxes/create' → get
    '/boxes/create' → post
    '/boxes/:id/edit' → get
    '/boxes/:id/save' → post
    '/boxes/:id/delete' → post
    '/boxes/:id/label' → get

    —Product—
    '/products/' → get [view all user products]
    '/products/create' → get [view for form to create product]
    '/products/create' → post [controller to save new product]
    '/products/:id/show' → get [view single user product]
    '/products/:id/edit' → get [view form to edit product]
    '/products/:id/save' → post [controller to update product]
    '/products/:id/delete' → post [controller to delete product]
 



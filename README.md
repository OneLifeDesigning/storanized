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
  * ejs - Template engine
  * express-ejs-layouts - Template layout engine
  * morgan - Manage logs on app
  * multer - Uploads files to cloud (Dependence)
  * multer-storage-cloudinary - Uploads files to cloud (Specific dependence)
  * cloudinary - Uploads files to cloud (provider) 
  * nodemailer - Send transactional emails

* devDependencies
  * nodemon - Wathcher changes and reload dev server
  * faker - Generate massive data


`npm i express connect-mongo mongoose dotenv bcrypt cookie-parser express-session passport passport-google-oauth20 passport-slack faker ejs morgan multer multer-storage-cloudinary cloudinary nodemailer express-ejs-layouts & npm i nodemon faker --save-dev`

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

### 1.6 - Add template files
    /views/layout.ejs
          …index.ejs
          …/users/all.ejs
                …show.ejs
                …edit.ejs
                …login.ejs
                …recovery.ejs
                …register.ejs
          …/projects/all.ejs
                …show.ejs
                …edit.ejs
                …create.ejs

### 2.0 - Create db.config.js
/config/db.config.js

    Add: 
      1. mongoose
      2. mongoose_uri .env || localhost
      3. mongoose.connect(options).promise
      4. proccess.on('SIGNIT', mongoose.connection.close(process.exit(0))) <-- Close all connexions with db

### 3.0 - Models
/models/user.model.js
  * name
  * lastname
  * email
  * username
  * avatar
  * profileImage
  * password
  * bio
  * company
  * location
  * website
  * activation
    * active
    * token
  * socialLogin: 
      * slack
      * google
  * socialProfiles
    * slack
    * github
    * google
    * linkedin
    * twitter
    * facebook
  * role 
  * terms

/models/project.model.js
  * name
  * description
  * url
  * image
  * ownerId -> userId
  * Virtuals
    * gallery -> attachment -| Relation 1 to N
    * files -> attachment -| Relation 1 to N

/models/attachment.model.js
  * name
  * type
  * src
  * projetcId
  * userId

#### TODO:
    /models/like.model.js
      · projetcId
      · commentId
      · userId

    /models/comment.model.js
      · text
      · commentId
      · projetcId
      · userId

    // BONUS:
      /models/collaborator.model.js
        · userId
        · projetcId

      /models/organization.model.js
        · name
        · description
        · owner -> userId
        · collaborator -> {userId, userId, userId}

### 4.0 - Seeds
/bin/seeds.js

    Import DB connexion `require("../config/db.config")`

    Use Schema Model for Collections:
    `const User = require("../models/user.model");`
    `const Project = require("../models/project.model");`
    `const Attachment = require("../models/attachment.model");`

    // RANDOM DATA GENERATOR
      const faker = require("faker");

### 5.0 - Routes/Controllers

  #### 5.1 - Routes
  /config/routes.js
  
  ##### Public routes (logged or not)
      1. home
        - Wellcome page -> render
      2. project
        - View all projects  -> get
        - View single project (Attachments, comments)  -> get
      3. user
        - View all users -> get
        - View single users  -> get
        - Login -> get/post
        - Create new user -> get/post
        - Validate token -> get
        - Refresh token -> get/post
        - Change password -> get/post
        - Login Social -> get
      5. errors page -> get

  ##### Auth routes (only if logged)
      1. project (own projects)
        - Create, Edit -> get/post
        - Delete -> post
      2. user
        - Edit profile user  -> get/post
      3. comment
        - Create, Edit -> get/post
        - Delete -> post
      4. like
        - Mark/unmark like -> post

  #### 5.1 - Controllers
  
  /controlers/user.controller.js
    all -> View all users
    register -> View register page
    doRegister -> View create new user
               -> Send email confirm account
    activateUser -> Validate/activate url token
    login -> View login page
    doLogin -> Check/validate credentials for user
            -> Save user session 
    doSocialLogiSlack -> Login whit Slack
    doSocialLoginGoogle -> Login whit Google

  /controlers/project.controler.js


### 6.0 - Login/Register
  Basic login User/Pass
  Social Auth

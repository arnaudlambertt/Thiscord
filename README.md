
# Chat application - final project

*presentation, introduction, ...*

## Usage

*how to start and use the application, run the tests, ...*

* Clone this repository, from your local machine:
  ```
  git clone https://github.com/adaltas/ece-webtech-2021-fall.git webtech
  cd webtech/courses/webtech/project
  ```
* Install [Go](https://golang.org/) and [Dex](https://dexidp.io/docs/getting-started/). For example, on Ubuntu, from your project root directory:   
  ```
  # Install Go
  apt install golang-go
  # Download Dex
  git clone https://github.com/dexidp/dex.git
  # Build Dex
  cd dex
  make
  make examples
  ```
  Note, the provided `.gitignore` file ignores the `dex` folder.
* Register your GitHub application, get the `clientID` and `clientSecret` from GitHub and report them to your Dex configuration. Modify the provided `./dex-config/config.yml` configuration to look like:
  ```yaml
  - type: github
    id: github
    name: GitHub
    config:
      clientID: xxxx98f1c26493dbxxxx
      clientSecret: xxxxxxxxx80e139441b637796b128d8xxxxxxxxx
      redirectURI: http://127.0.0.1:5556/dex/callback
  ```
* Inside `./dex-config/config.yml`, the front-end application is already registered and CORS is activated. Now that Dex is built and configured, you can start the Dex server:
  ```yaml
  cd dex
  bin/dex serve dex-config/config.yaml
  ```
* Start the back-end
  ```bash
  cd back-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Optional, fill the database with initial data
  bin/init
  # Start the back-end
  bin/start
  ```
* Start the front-end
  ```bash
  cd front-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Start the front-end
  yarn start
  ```

## Author

*name, email, ...*

## Tasks

Project management

* Naming convention   
  *place your graduation and comments*
* Project structure   
  *place your graduation and comments*
* Code quality   
  *place your graduation and comments*
* Design, UX   
  *place your graduation and comments*
* Git and DevOps   
  *place your graduation and comments*

Application development

* Welcome screens   
  *place your graduation and comments*
* New channel creation   
  *place your graduation and comments*
* Channel membership and access   
  *place your graduation and comments*
* Ressource access control   
  *place your graduation and comments*
* Invite users to channels   
  *place your graduation and comments*
* Message modification   
  *place your graduation and comments*
* Message removal   
  *place your graduation and comments*
* Account settings   
  *place your graduation and comments*
* Gravatar integration   
  *place your graduation and comments*
* Avatar selection   
  *place your graduation and comments*
* Personal custom avatar   
  *place your graduation and comments*

## Bonus

*place your graduation and comments*

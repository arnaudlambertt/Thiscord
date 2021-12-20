
# Chat application « Thiscord » - Final project

Welcome to our chat application **Thiscord**. Inspired by the famous desktop app Discord, this final project shows our capabilities in full-stack developpment, within a short span of time. Indeed, this project was made in roughly 10 days. Clement was mainly responsible for the front-end part of the app, including design, attention to details, responsiveness, etc; whereas Arnaud worked mostly on the backend and the flows between frontend and backend, including authentification & security, unit tests, routes, db management, etc.

## Usage

* Clone this repository, from your local machine:
  ```
  git clone https://github.com/bloomkail/Web-technologies.git bouvardLambert
  cd bouvardLambert
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
* Copy the provided `./dex-config/config.yaml` configuration to your dex folder:

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
  # Start the back-end
  bin/start
  ```
* Start the front-end
  ```bash
  cd front-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Start the front-end (use yarn or npm)
  yarn start
  ```

## Author

Arnaud Lambert
lambert.arnaud@edu.ece.fr

Bouvard Clément
bouvard.clement@edu.ece.fr

## Tasks

Project management

* Naming convention   
  graduation: 2/2
  
    The files and variables names are clear and descriptive.
* Project structure   
  graduation: 4/4

    The project is well organized in folder for back end and front end but also with folders for react components related to each other
* Code quality   
  graduation: 3.5/4

    Large use of ES6 javascript, no warning or errors.
    The code is well indented and as optimized as possible. A few unnecessary re-renders might still be present.
* Design, UX   
  graduation: 3/4

    The website is intuitive and good looking. Additionally, you can change your theme as desired. The buttons are at logical locations and easy to use.
    The design is also adapted to mobile phone usage.
* Git and DevOps   
  graduation: 3/4

  Good use of git overall, a new branch for each relatively big features, and commit names respecting conventions. Although the urls are pointing to localhost, the front-end has been deployed to [netlify](https://thiscord.netlify.app/). No docker image, nor linter though.

Application development

* Welcome screens   
  graduation: 3/4

    The welcome page informs about the functionalities of the website and allow you to login with your GitHub account.
    The page could still have a better design and the call to action could be more obvious.
* New channel creation   
  graduation: 6/6

    The channel creation is a simple dialog, once the channel is created it is added in database with the creator in its members.
    You can also cancel the creation in the dialog.
    Once the channel is created you can manage it in a very intuitive manner.
* Channel membership and access   
  graduation: 4/4

    Every request sent to the API server contains the user access token in the HTTP header.
    The channels has an array with the ids of every member.
* Resource access control   
  graduation 4/4

    A user only has access to channels to which he has been invited or he created.
     It is impossible for a user to gain access of a channel he is not part of.
     Every database request returns an appropriate response either if it works or fails.
* Invite users to channels   
  graduation: 6/6

    It is possible for any member of a channel to invite other members by searching other people via their username,
    for security reasons, it is impossible for a user to see all the users of the application
    you can also leave a channel or delete a channel.
    A channel has at least one member,if it has no members it is deleted.
    Any member of a channel can delete the channel
* Message modification   
  graduation: 1.5/2

    A user can modify each of his messages, if a message has been modified, it is indicated in the message for every user of the channel
    Instead of using a dialog we would have loved the message to transform into a form.
* Message removal   
  graduation: 2/2

    a user can remove his messages from any channel he is a part of
* Account settings   
  graduation: 4/4

    Any user can edit his username, choosing any non-used username.
    he can also choose from a light or dark theme which are saved in his profile and apply through the whole website.
    The user can choose which type of avatar he want from this settings menu, this avatar is also saved in his profile and seen by other member of a channel
* Gravatar integration   
  graduation: 2/2

    Every user has an associated gravatar. If they modifify their gravatar on the gravatar website, the change will be taken into account. It appears in their settings but also next to their messages.
* Avatar selection   
  graduation: 4/4

    Every user can choose an avatar from a wonderful preselection of profile pictures. The image selected is saved and will appear next to their messages instead of their previous picture.
* Personal custom avatar   
  graduation: 6/6

    You can upload your own profile picture and it will be saved in your profile as your avatar (limit of 500kb).
    
## Bonus

* Username (+1)

  Every user has a **unique** username and can modify it. It is impossible to get the whole list of usernames without entering specific characters.
  When a user first logs in, he is asked to create one.
  
* Delete channel (+1)

  Every channel can be deleted. If a channel doesn't have any member, it is also deleted. All the messages will also be deleted, and the users will be updated accordingly.
  
* Delete user (+1.5)

  Every user can delete their account. The deleted users will appear as [deleted] in the messages they've sent before their deletion.

* Customized light/dark theme (+1.5)

  Customized from mui, mode dark or light, this setting is saved in the db.
  
* Socket.io (+??)

  Use of Socket.io to update **in real time the client of each user connected**. The channels, the members and the messages (creation, update and deletion), are all shared across the concerned clients. This feature is what makes this chat a real time chat app. And it works beautifully.

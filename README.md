# Frontend node service for data collected from [palantiri](https://gitlab.com/danlrobertson/palantiri)

There is some additional setup that needs to be completed for the app. Further instructions for the setup can
be found in [docs/DatabaseSetup.md](docs/DatabaseSetup.md).

## Getting Started

### Install

```
    $ git clone https://gitlab.com/drobertson/ht-archive.git
    $ cd ht-archive
    $ npm install
```

### Running

```
    $ node app.js --usr your-mongodb-user # the app will launch on port 3000
```

### First use

On first use you will need to create a user. After you create a user you will be directed to the login screen.
Initally your account is in a locked state. Open mongodb and find the document for your user which should contain
your username, a sha1 hash of your password, your email, and a boolean flag to ensure that you have been confirmed
as a valid user. Run the following to unlock your account. Eventually a more user friendly method may be used for
this, but for the time being this will have to do.

```
    $ mongo
    > use crawler
    > db.users.update({"_id": "your-username"}, { "$set": { "confirmed": true } })
```

After you unlock your account you may log in and you will be directed to a rather bland welcom page :smile:
Click "Search" on the nav bar and start exploring some data! The app uses cookies, so your log in should
persist over multiple sessions.

# Frontend node service for data collected from [palantiri](https://github.com/anidata/palantiri.git)

## Getting Started

### Install

```
    $ git clone https://github.com/anidata/ht-archive.git
    $ cd ht-archive
    $ npm install
```
### Database

[Use Docker or command line](https://github.com/anidata/ht-archive/wiki) if you already PostgreSQL server running.

### Running

```
    $ node app.js --usr postgres-user --host hostname --db database # the app will launch on port 8080
```

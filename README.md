# Frontend node service for data collected from [palantiri](https://github.com/anidata/palantiri.git)

## Getting Started

### Install
Installing this code base requires the use of the `npm` command available within the nodejs install. You will need to install it locally before moving on with the installation.

[npmjs getting started](https://docs.npmjs.com/getting-started/installing-node)

[Download nodejs](https://nodejs.org/en/download/)
```
    $ git clone https://github.com/anidata/ht-archive.git
    $ cd ht-archive
    $ npm install
```
### Database

This guide will walk you through the process of setting up a local PostgreSQL server and importing the database backups so that you can use the `ht-archive` web application.

_Scroll down for command line installation instructions._

## Docker installation instructions

**Suggested Method:** If you decide to use Docker (install by selecting your OS on this page, https://www.docker.com/products/overview), start PostgreSQL with the following command on the command line after replacing `/SOME_FOLDER` with a folder on your computer that is easily accessible:

1. If you haven't already installed Docker, follow the directions on the Docker website: https://www.docker.com/products/overview.  Using macports or brew is not suggested.

1. Run the PostgreSQL server
  ```
  $ sudo docker run -d -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=dbadmin -e POSTGRES_DB=sandbox \ 
  -v /SOME_FOLDER:/var/lib/postgresql/data -p 5432:5432 --name postgres postgres
  ```

1. Download the PostgreSQL backup from one of the following places:
    * https://drive.google.com/open?id=0B0yTlb-C_V2ZN0tNUFIzNGh1T00
    * https://s3.amazonaws.com/anidata-ht/crawler_er.tar.gz

1. Extract the SQL file from the downloaded `crawler_er.tar.gz`, using the following command on the command line or an archive tool:
    ```
    $ tar xzf /THE_FOLDER_WITH_DOWNLOADED_FILE/crawler_er.tar.gz
    ```
1. Copy the the `crawler.sql` file that was extracted from `crawler_er.tar.gz` to `/SOME_FOLDER`
    ```
    $ cp /THE_FOLDER_WITH_DOWNLOADED_FILE/crawler.sql /SOME_FOLDER
    ```
1. Load the SQL into PostgreSQL
    ```
    $ sudo docker exec postgres psql --username dbadmin -c "CREATE DATABASE crawler" sandbox
    $ sudo docker exec postgres psql --username dbadmin -f /var/lib/postgresql/data/crawler.sql crawler
    ```

1. Start the web application

    a. Start the application with
    ```
    $ sudo docker run -d -p 8080:8080 --link postgres:postgres --name ht-archive bmenn/ht-archive --db crawler --usr dbadmin --pwd 1234 --host postgres
    ```

    b. If you have made some changes and want to see the updated application run
    ```
    $ node app.js --db crawler --usr dbadmin --pwd 1234 --host REPLACE_ME_WITH_DOCKER_OR_POSTGRES_IP
    ````

## Command line installation instructions
Follow these steps if you already have a PostgreSQL server running locally and would rather not use Docker.  

1. Download the PostgreSQL backup from one of the following places:
    * https://drive.google.com/open?id=0B0yTlb-C_V2ZN0tNUFIzNGh1T00
    * https://s3.amazonaws.com/anidata-ht/crawler_er.tar.gz

2. Extract the SQL file from the downloaded `crawler_er.tar.gz`, using the following command on the command line or an archive tool:
    ```
    $ tar xzf /the_folder_with_backup/crawler_er.tar.gz
    ```
3. Set up your local database
    
    Log into your postgres server as root and create a new superuser named `dbadmin` with login permissions.
    ```
    postgres> CREATE ROLE dbadmin WITH SUPERUSER LOGIN PASSWORD 1234;
    ```

4. Load the SQL into PostgreSQL
    
    Create a database called `crawler`, exit psql and run the following command. _Be patient_ - the query can take 15 minutes or so to run.
    ```
    $ psql --host=localhost --dbname=crawler --username=dbadmin -f <path/to/.sql/file>
    ```

5. Once the data has been loaded into PostgreSQL, start the web application and navigate to `localhost:8080` in your browser.
    ```
    $ node app.js --db crawler --usr dbadmin --pwd 1234 --host REPLACE_ME_WITH_DOCKER_OR_POSTGRES_IP
    ````

### Running

```
    $ node app.js --usr postgres-user --host hostname --db database # the app will launch on port 8080
```

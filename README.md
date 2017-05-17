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

## Recommended Method - Docker Container(s)

Two docker containers are used: 1) a PostgreSQL server and 2) the web application running node.js that runs the web search. The database is mounted to the PostgreSQL docker container via an easily accessilble folder (referred as `/SOME_FOLDER`).

1. If you haven't already installed Docker, follow the directions on the Docker website: https://www.docker.com/products/overview.  Using macports or brew is not suggested.

1. Download the (~300 MB) PostgreSQL backup from one of the following places (destination is referred to as `/THE_FOLDER_WITH_DOWNLOADED_FILE`):
    * https://drive.google.com/open?id=0B0yTlb-C_V2ZN0tNUFIzNGh1T00
    * https://s3.amazonaws.com/anidata-ht/crawler_er.tar.gz

1. Extract the SQL file from the downloaded `crawler_er.tar.gz` to `/THE_FOLDER_WITH_DOWNLOADED_FILE` using the following command on the command line or an archive tool:
    ```
    $ tar xzf /THE_FOLDER_WITH_DOWNLOADED_FILE/crawler_er.tar.gz
    ```

1. Build/run the PostgreSQL server. **Ensure /SOME_FOLDER is empty and be sure to complete the next two steps before stopping the docker container.** Otherwise, the docker container will need to be fixed (removing is simplest). Note that if successful, it will leave a terminal window running, and further commands will require a different/new terminal window.  
    ```
    $ sudo docker run -d -e POSTGRES_PASSWORD=1234 -e POSTGRES_USER=dbadmin -e POSTGRES_DB=sandbox -v /SOME_FOLDER:/var/lib/postgresql/data -p 5432:5432 --name postgres postgres
    ```
    * The command downloads, partially configures, and runs the docker image and container `postgres`: 
    * `-d` sets it as a daemon that will run in the background 
    * `-e` sets environment variables
    * `-v` mounts the folder `\SOME_FOLDER` to the container
    * `-p` sets the network port
    * `--name` names the names the container `postgres`
    * `postgres` references the docker standard PostgreSQL image

1. Copy the the `crawler.sql` file that was extracted from `crawler_er.tar.gz` to `/SOME_FOLDER`
    ```
    $ cp /THE_FOLDER_WITH_DOWNLOADED_FILE/crawler.sql /SOME_FOLDER
    ```

1. Load the crawler database into the PostgreSQL server. This step will take a few minutes and will return to the command line when finished. If it fails, see below for some troubleshooting suggestions.
    ```
    $ sudo docker exec postgres psql --username dbadmin -c "CREATE DATABASE crawler" sandbox
    ```
    * The `docker exec` runs a command in the previously created docker container named `postgres`  
    * `psql` runs the postgreSQL  
    * `--username` runs the following psql command under the username `dbadmin`
    * `-c` runs the psql command "CREATE DATABASE crawler"  
    * `sandbox` is the default database specified earlier

    ```
    $ sudo docker exec postgres psql --username dbadmin -f /var/lib/postgresql/data/crawler.sql crawler
    ```
    * `-f` runs the commands in the postgres file crawler.sql that we linked to `\SOME_FOLDER`
    *  `crawler` use the crawler database created in the previous step  

1. Start the web application  
    a. Start the application with the following.
    ```
    $ sudo docker run -d -p 8080:8080 --link postgres:postgres --name ht-archive bmenn/ht-archive --db crawler --usr dbadmin --pwd 1234 --host postgres
    ```
    * The command downloads, configures, and runs the docker image and container named `ht-archive`: 
    * `-d` sets it as a daemon that will run in the background 
    * `-p` sets the network port 
    * `--link` allow networking to the first container named `postgres`
    * `--name` names the names the container `ht-archive`
    * `bmenn/ht-archive` uses the docker image from github located at bmenn/ht-archive 
    The following are all for the app.js web application and specify the username, database, password and host:
    * `--db` sets the database name 
    * `--usr` sets the username
    * `--pwd` sets the database password
    * `--host` sets the name of the server hosting the database (`postgres`)

    b. Open a web browser and enter the following in the address: 
    ```
    localhost:8080
    ```

1. Stopping, starting the services:  
    All running docker containers are visible via:
    ```
    $ docker ps
    ```
    
    a. To stop the running containers 'postgres' and 'ht-archive', enter:
    ```
    $ docker stop ht-archive
    $ docker stop postgres
    ```
    
    b. To restart the services run the following. All of the port settings, environment variables, mounts, etc. are all preserved in the docker container, so only `docker start <container name>` is needed.
    ```
    $ docker start postgres
    $ docker start ht-archive
    ```

1. If you have made some changes and want to see the updated application run
    ```
    $ node app.js --db crawler --usr dbadmin --pwd 1234 --host REPLACE_ME_WITH_DOCKER_OR_POSTGRES_IP
    ```


#### TROUBLESHOOTING NOTE: 
If the `$ docker exec` command fails with "Error response from daemon: Container #### is not running", a likely cause is that the database isn't reachable or running. Perhaps the simplest fix is to remove the docker container (named 'postgres'). Keep in mind all docker containers are visible via `$ docker ps -a` and all docker images are visible via `$ docker images`:  

a. Remove the docker container `postgres`:    
```
$ docker rm postgres
```
b. Ensure that the `/SOME_FOLDER` is empty. Re-run the setup from the PostgreSQL `$ sudo docker run ...` from earlier. Be sure to complete all `docker exec` steps completely before exiting the `postgres` docker container.

## Alternate Method - Local PostgreSQL
Installation
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

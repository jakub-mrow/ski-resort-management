# Ski resort management


## Contents
* [General](#general)
* [Setup](#setup)
  * [Docker ](#using-docker)
    * [Backend](#backend)
* [Usage](#usage)
* [Technologies](#used-technologies)
* [Further ideas](#further-ideas)

## General

Quick overview of the project

## Setup

### Using Docker
> Note: Requires [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/) to run.

Clone repository
```
git clone https://github.com/jakub-mrow/ski-resort-management
```
Open repo directory
```
cd ski-resort-management
```
#### Backend
>Note: Backend and frontend have to be build separately

Go to server directory
```
cd server
```

Build image and run container
```
docker-compose build
docker-compose up 
```
To kill container use
```
docker-compose down
```


## Usage

Verify the deployment by navigating to your server address in
your preferred browser.
>Note: Default server works on http://127.0.0.1:8000/api/
```
http://127.0.0.1:8000/api/
```


## Used Technologies

| Name                  | Version |
|-----------------------|---------|
| Python                | 3.9.7   |
| Django                | 4.0.3   |
| Django Rest Framework | 3.13.1  |
| Postgresql            | latest  |



## Further ideas
* add unit tests
* add integration tests
* add logging status codes to a file
    
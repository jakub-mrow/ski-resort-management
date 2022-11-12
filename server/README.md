# Ski resor management backend


* [Developers guide](#developers-guide)
* [Git flow](#git-flow)


## Developers guide

How to connect to the database to see tables and for debugging

```
docker-compose exec db-postgres bash
```
In the container
```
psql -d postgres -U postgres
```
To list all the tables
```
\dt
```
Now you can run example queries
```
select * from skiresort_room;
```


## Git flow

Each feature should be developed and tested on different branch.
```
git checkout -b "branch name"
```
Create pull request on github to merge to main
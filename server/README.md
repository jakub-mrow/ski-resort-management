# Ski resor management backend


* [Developers guide](#developers-guide)


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
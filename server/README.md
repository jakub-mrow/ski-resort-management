# Ski resor management backend


* [Git flow](#git-flow)
* [Developers guide](#developers-guide)

## Git flow

Each feature should be developed and tested on different branch.
```
git checkout -b "branch name"
```
Create pull request on github to merge to main


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

Too list all available procedures 
```
SELECT
    routine_schema,
    routine_name
FROM 
    information_schema.routines
WHERE 
    routine_type = 'PROCEDURE';
```
Too list all avaliable functions
```
SELECT
    routine_schema,
    routine_name
FROM 
    information_schema.routines
WHERE 
    routine_type = 'FUNCTION';
```
Example procedure to change room price

```
create or replace procedure changePrice(roomId int, newPrice dec)
language plpgsql
as $$
begin
	update skiresort_room set price = newPrice where id=roomId;
end;
$$;
```
How to call procedure in postgres container
```
call changeprice(1, 400);
```

How to call procedure directly from python

```
from django.db import connection
...
with connection.cursor() as cursor:
    cursor.execute("call changePrice(1, 500);")
```
# Installation
## Install Postgresql + Postgis
(on Ubuntu, please read before copy+paste)
```bash
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg-testing main 12" |sudo tee  /etc/apt/sources.list.d/pgdg-testing.list

sudo apt-get install postgis postgresql-12-postgis-3 postgresql-12-postgis-3-scripts gdal-bin

# Enter the postgres shell
# (maybe you'll have to create a postgres user first) 
su - postgres
psql
```

```sql
CREATE ROLE ccc_zvuky WITH LOGIN PASSWORD 'secret';

CREATE DATABASE ccc_zvuky ENCODING=UTF8 LC_COLLATE='cs_CZ.utf-8' TEMPLATE=template0;
GRANT ALL PRIVILEGES ON DATABASE ccc_zvuky TO ccc_zvuky;
```
(end with ctrl+d)
```bash
##
# Now connect to the new database
psql ccc_zvuky
```
```sql
CREATE EXTENSION postgis;
SELECT postgis_full_version();
```



### Concepts
# Point technical usage
```sql
select * from technicke_vyuziti where ST_CONTAINS( wkb_geometry, 'POINT(14.3227433 50.0938078)'::geography::geometry);
```
# Format: JSON with a walk
* list of points, every point has
 * coordinate
 * vector of nearness (propertyXproperty_value => 0..1)
 

```sql
select * from technicke_vyuziti where ST_CONTAINS( wkb_geometry, 'POINT(14.3227433 50.0938078)'::geography::geometry);

 SELECT *
 FROM technicke_vyuziti
 WHERE  wkb_geometry 
     && -- intersects,  gets more rows  -- CHOOSE ONLY THE
     -- @ -- contained by, gets fewer rows -- ONE YOU NEED!
     ST_MakeEnvelope (
         14.320, 50.093, -- bounding 
         14.325, 50.094, -- box limits)
    -- last param my_srid
```


```sql
 SELECT ctvuk_kod, ctvuk_popis, ST_UNION(wkb_geometry)
 FROM technicke_vyuziti
 WHERE  wkb_geometry 
     && -- intersects,  gets more rows  -- CHOOSE ONLY THE
     -- @ -- contained by, gets fewer rows -- ONE YOU NEED!
     ST_MakeEnvelope (
         14.320, 50.093, -- bounding 
         14.325, 50.094  -- box limits
         )
     group by ctvuk_kod,ctvuk_popis
```

```sql
SELECT st_AsText( ST_Project('POINT(14.3225442 50.0926567)'::geography::geometry, 1000, radians(90.0)) );
```

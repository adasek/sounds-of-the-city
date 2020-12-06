## Install Postgresql + Postgis
(on Ubuntu, please read before copy+paste)
```bash
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" |sudo tee  /etc/apt/sources.list.d/pgdg.list
echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg-testing main 12" |sudo tee  /etc/apt/sources.list.d/pgdg-testing.list

# Create czech locale
sudo locale-gen cs_CZ.utf8
sudo update-locale

sudo apt-get install postgis postgresql-12-postgis-3 postgresql-12-postgis-3-scripts gdal-bin


# Enter the postgres shell
# (maybe you'll have to create a postgres user first) 
su - postgres
psql
```

```sql
CREATE ROLE ccc_zvuky WITH LOGIN PASSWORD 'secret';

CREATE DATABASE ccc_zvuky ENCODING=UTF8 LC_COLLATE='cs_CZ.UTF-8' TEMPLATE=template0;
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

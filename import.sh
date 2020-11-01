#!/bin/bash

DATABASE_NAME=ccc_zvuky
DATABASE_USER=ccc_zvuky
DATABASE_PASSWORD="AG5nnadoqLBEQ056.q"


# Cyklotrasy
ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/cyklo/DOP_Cyklotrasy_l.json" -nln cyklo_trasy -progress -overwrite

# Kulturni body
ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/kultura/FSV_Kultura_b.json" -nln kultura_body -progress -overwrite


# WC
ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/odpad/FSV_VerejnaWC_b.json" -nln odpad_wc -progress -overwrite

# Tridene kontejnery
ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/odpad/ZPK_O_Kont_TOstan_b.json" -nln odpad_tridene_kontejnery -progress -overwrite

ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/odpad/ZPK_O_SberOdpadu_b.json" -nln odpad_sber -progress -overwrite


# Police stations
ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/policie/BEZ_ObjektMPP_b.json" -nln policie -progress -overwrite


ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/priroda/OPK_PamStromy_OP_p.json" -nln priroda_pamatne_stromy -progress -overwrite



ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/priroda/OPK_PrirodniParky_p.json" -nln priroda_prirodni_parky -progress -overwrite



ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
  "data/priroda/OPK_USES_p.json" -nln priroda_pouziti -progress -overwrite

# Technicke vyuziti
#ogr2ogr -f "PostgreSQL" PG:"dbname=$DATABASE_NAME user=$DATABASE_USER password=$DATABASE_PASSWORD" \
#  "data/technicke_vyuziti/TMTVU_P.gml" -nln technicke_vyuziti -progress -overwrite


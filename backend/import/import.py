#!/usr/bin/env python3

# Configuration
#  Configure POSTGRES connection via .env in parent directory (../)
#
# Depends on:
#  * python-dotenv package
#  * ogr2ogr command (in gdal-bin package)
#
# Install dependencies:
# pip3 install python-dotenv
# sudo apt-get install postgis postgresql-12-postgis-3 postgresql-12-postgis-3-scripts gdal-bin

import json
from pathlib import Path
import subprocess
import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path('..','.env'))

with open(Path('..','data_sources.json')) as data_sources_file:
    data_sources = json.load(data_sources_file)

    for source in data_sources:
        if source['type'] == 'geojson':
            # Load geojson to database
            filename = Path('..', *(os.getenv('DATA_DIRECTORY').split('/')), *(source['filename']).split('/'))
            print(f"Importing {source['filename']} -> {source['table_name']}")
            import_process = subprocess.run([
                "ogr2ogr", "-f", "PostgreSQL",
                f"PG:dbname={os.getenv('PGDATABASE')} user={os.getenv('PGUSER')} password={os.getenv('PGPASSWORD')}",
                filename, '-nln', source['table_name'], '-overwrite'
                ], capture_output=True, check=True)
            #print(import_process.stderr.decode('utf-8'))
            #print(import_process.stdout.decode('utf-8'))
        elif source['type'] == 'osm':
            pass
        else:
            raise Exception("Unknown type", type)

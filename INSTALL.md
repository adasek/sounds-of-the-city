## Fresh Ubuntu:

#### Install POSTGRES
Follow [INSTALL-PSQL.md](INSTALL-PSQL.md) instructions

#### Install dependencies

```bash
# Install node
curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
chmod +x nodesource_setup.sh
./nodesource_setup.sh

# Install python and modules
sudo apt install python3 python3-pip
pip3 install python-env

# Install nginx as reverse proxy
sudo apt install nginx
```

### Nginx reverse proxy
In file `/etc/nginx/sites-enabled/zvukyprahy.m42.cz`
```
server {
	listen 80;
	listen [::]:80;

	server_name zvukyprahy.m42.cz;

	location / {
		proxy_pass http://localhost:8090;
	}

}

```


```bash
cd frontend
npm install
npm run build  # compile frontend
cd ..
cd backend
npm install
cp .env.example .env
# edit .env to configure postgres database
```


### Run the backend
```bash
# Use import scripts to import to postgresql
npm run start # build+run server
```

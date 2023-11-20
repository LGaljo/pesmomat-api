Backend built on Nest framework for pesmomat project.

## Raspberry set up
```bash
# Install updates
sudo apt update  
sudo apt upgrade  
# Enable ssh

# Node.js recommends
sudo apt-get install gcc g++ make
# Install Node.js 16 LTS
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Increase swap size
sudo dphys-swapfile swapoff
sudo nano /etc/dphys-swapfile
# Set CONF_SWAPSIZE=4096
sudo dphys-swapfile swapon


# Install MongoDB
# https://andyfelong.com/2021/08/mongodb-4-4-under-raspberry-pi-os-64-bit-raspbian64/
mkdir mongo
# Download precompiled binary as compilation takes few a hours on RPi
wget https://andyfelong.com/downloads/raspbian_mongodb_5.0.5.gz
tar zxvf raspbian_mongodb_5.0.5.gz
sudo mv mongo* /usr/bin
sudo chown root:root /usr/bin/mongo*
sudo chmod 755 /usr/bin/mongo*
sudo adduser --no-create-home --disabled-login mongodb
# Do other configuration from tutorial linked above, then start service
sudo service mongodb start

# Run this to start mongodb at boot
sudo systemctl enable mongodb.service
```


## Installation (Linux - Ubuntu)
Install prerequisite libraries to be able to install it.
```bash
$ curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - &&\
$ sudo apt install build-essential libcups2-dev nodejs -y
```

```bash
$ git clone https://github.com/LGaljo/pesmomat-api
```

```dotenv
# Set Azure API key
API_PORT=4400
API_HOST=localhost
MONGO_URI=mongodb://127.0.0.1:27017/pesmomat
ON_RPI=true
AZURE_API_KEY=<API_KEY>
```

```bash
$ npm i
# If you get some errors about printer package, use this to use prebuilt
# First uninstall printer package
$ npm uninstall printer
$ npm install printer --target_arch=x64
# Or build it from source
$ npm install printer --build-from-source=node_printer --update-binary --force

```

## Running the app

```bash
# development
$ npm run start
$ npm run start:dev
$ npm run start:debug

# production mode
$ npm run build
$ npm run start:prod
```

## Use PM2 to run at startup
```bash
# Have pm2 install ie 
npm install -g pm2

pm2 start dist/main.js --name=pesmomat-api

pm2 startup systemd
# PM2 asks you to execute sth like:
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi

pm2 save
```

## Export data
Create tmp folder. Run from project root.
```bash
node --nolazy -r ts-node/register .\src\scripts\export-songs.ts
```

## Import data
Have files inside tmp folder. Run from project root.
```bash
node --nolazy -r ts-node/register .\src\scripts\import-songs-int.ts
```

# CitiBoard

### Prerequisites
Installing postgresql, nginx, node, redis

### Installing
If you have mac install them through homebrew
i.e
brew update
brew install nginx
brew install postgresql
brew install redis
brew install node

### Nginx
Nginx will serve the production build files from react so dont worry about that right now

### Postgres
Start Postgres Server using:
```
brew services start postgresql
```

Load in the required SQL Database and Tables using
```
psql -U <your user account name> -d citiboard -a -f /path/to/citiboard/init_database.sql
```

### Redis
Turn redis server on using
```
redis-server /usr/local/etc/redis.conf
```

You can interact with redis server using the redis-cli
```
redis-cli
```

Make sure server is running through the cli by using
```
ping
```

### Frontend and Backend
Run npm install on both citiboard and client folder to download the node modules
```
npm install
```

To run the backend (from the citiboard folder) run:
```
node index.js
```

To run the frontend (from the client folder) run:
```
npm run start
```
Go to localhost:3000

# CitiBoard (Examples)

Navigate to http://35.203.25.149/ for users page, http://35.203.25.149/admin for admins page

There are 40 boards in the system, 10 stations, and 6 dummy user accounts, 1 dummy admin account

Usernames for dummy user accounts are:
```
u1, u2, u3, u4, u5, u6
```
And all of their passwords are:
```
u
```

Username for dummy admin accounts is:
```
a
```
And its password is:
```
u
```

Feel free to create your own account on the register page (http://35.203.25.149/register)
Theres also some random data you can load by pressing a button on the Station Simulator section of the Admin Panel
Be sure to click the "Generate Reports" button on the Reports section of the Admin Panel to get the latest report data


# CitiBoard (Local Mac Development)

### Prerequisites
Installing postgresql, nginx, node, redis, apache-spark

### Installing
If you have mac install them through homebrew
i.e. :
```
brew update
brew install nginx
brew install postgresql
brew install redis
brew install node

brew cask install java
brew install scala
brew install apache-spark
```

### Nginx
On terminal, run:
```
sudo nginx // to start
sudo nginx -s stop // to stop
```

Nginx.conf should look like:
```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;

    keepalive_timeout  65;


    server {
        listen 80 default_server;
        return 403;
    }

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            proxy_pass    http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }


        location /api  {
            proxy_pass    http://localhost:4000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

    }
    include servers/*;
}
```


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
Go to localhost/ for users page, localhost/admin for admins page

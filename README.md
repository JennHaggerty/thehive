DEVELOPMENT SETTINGS
  - Spin up docker-compose.yml
      $ docker-compose up -d --remove-orphans
  - Points virtual hosts to local host, updates /etc/hosts
      $ echo -e "127.0.0.1\tINSERTNAMEHERE.local" | sudo tee -a /etc/hosts
FRONT
  - wordpress
  - react
    * If it cannot find the pages, create new app and copy pages over. 
  - javaScript
  - vue
  - angular
  - flash(?)
  - html
BACK
  - docker-compose
  - mysql
  - nginx
  - knex
  - express
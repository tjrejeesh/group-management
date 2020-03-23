# group-management

The group management application will help you to add/edit/delete/view group and others can subscribe.

##Technologies
```bash
1. React
2. Node.js
3. PostgreSQL
```


Steps to run the application locally

## Create Database
```bash
Import the database `groupdb` and it's tables
The schema is available at `database` directory

OR

Execute the below queries after creating the database `groupdb`.

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    email text NOT NULL,
    password text NOT NULL
);


CREATE TABLE public.group_details (
    id integer NOT NULL,
    gname character varying(255),
    description text,
    created_by numeric,
    member_id numeric,
    created_at text
);

CREATE TABLE public.group_members (
    id integer NOT NULL,
    group_id integer,
    member_id integer
);


Configuration:

PG_USER = 'postgres'
PG_PASS = '*** yourpassword *****'
PG_DATABASE = 'groupdb'
PG_PORT = '5433'
```
## Clone the project repository
```bash
git clone https://github.com/tjrejeesh/group-management.git
```

## Server Side
```bash
cd server

install the dependancies:
npm install

run server:
npm start

Local:            http://localhost:5000

```

## Client side
```bash
cd client

install the dependancies:
npm install

run client
npm start

Local:            http://localhost:3000
```

## Demo
```bash
https://www.loom.com/share/b9890609876f4f0cbff7f19fe90a7d1f
```


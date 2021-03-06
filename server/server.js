const dotenv = require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const pg = require("pg");
const cors = require("cors");
const app = express();
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const config = {
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASS,
    port: process.env.PG_PORT
};

const PORT = 5000;

const pool = new pg.Pool(config);

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

app.post("/api/login", (req, res) => {
    pool.connect(function(err, client, done) {
        if (err) {
            console.log("Unable to connect to the database due to " + err);
        }
        const sql = 'SELECT * FROM users WHERE email=$1 and password=$2';
        const param = [req.body.values.email.toLowerCase(), req.body.values.password]
        client.query(sql, param, function(err, result) {
            done();
            if (err) {
                console.log(err);
                res.status(400).send(err);
            }
            else if(result.rows.length === 0) {
                res.json({
                    login_status: 'invalid',
                    message: 'No records found!'
                })
            }else{
                const user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email,
                };
                jwt.sign({user}, 'secretkey', {expiresIn: '1h'}, (err, token) => {
                    res.json({
                        token,
                        id: user.id,
                        name: user.name,
                        email: user.email
                    })
                });
            }
        });
    });
});

app.post("/api/register", (req, res) => {
    try {
        pool.connect(function (err, client, done) {
            if (err) {
                console.log("Unable to connect to the database due to " + err);
            }
            const sql = 'INSERT INTO users (name, email, password) ' +
                'VALUES ($1, $2, $3);';
            const param = [req.body.values.name, req.body.values.email.toLowerCase(), req.body.values.password];
            client.query(sql, param, function (err, result) {
                done();
                if (err) {
                    console.log(err);
                    res.status(400).send(err);
                }
                if(result)res.status(200).send(result.rows);
            });
        });
    }
    catch (e) {
        console.log(e);
    }
});

function verifyToken(req, res, next){
    const bearerHeader = req.body.headers['authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403)
    }
}

app.post("/api/users", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                client.query("SELECT * FROM users", function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }

    });
});

app.post("/api/group/add", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'INSERT INTO group_details (gname, description, created_by, member_id, created_at) ' +
                    'VALUES ($1, $2, $3, $4, $5);';
                const param = [
                    req.body.values.gname,
                    req.body.values.description,
                    req.body.values.userId,
                    req.body.values.userId,
                    req.body.values.createdAt
                ];
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }

    });
});

app.post("/api/group/update", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'UPDATE group_details SET gname = $1, description = $2 WHERE id = $3';
                const param = [
                    req.body.values.gname,
                    req.body.values.description,
                    req.body.values.groupId,
                ];
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }

    });
});

app.post("/api/groups", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'SELECT users.id as user_id, users.name, gname, member_id, ' +
                    'created_by, created_at, description, group_details.id as group_id FROM ' +
                    'users INNER JOIN group_details ON ' +
                    'group_details.created_by = users.id';
                client.query(sql, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }
    });
});

app.post("/api/mygroups", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'SELECT users.id as user_id, users.name, gname, member_id, ' +
                    'created_by, created_at, description, group_details.id as group_id FROM ' +
                    'users INNER JOIN group_details ON ' +
                    'group_details.created_by = users.id where users.id=$1';
                const param = [
                    req.body.values.userId,
                ];
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }
    });
});


app.post("/api/group/join", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                let sql = '';
                let param = [req.body.values.group_id, req.body.values.user_id];
                if(req.body.values.action === 'select') {
                    sql = 'select count(*) from group_members  ' +
                    'where group_id = $1 and member_id = $2';
                }else if(req.body.values.action === 'insert'){
                    sql = 'INSERT INTO group_members (group_id, member_id) ' +
                        'VALUES ($1, $2);';
                }else if(req.body.values.action === 'delete'){
                    sql = 'delete from group_members where group_id = $1 and member_id = $2'
                }
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result,
                        authData: authData
                    })
                });
            });
        }
    });
});
app.post("/api/group/delete", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'delete from group_details where id = $1';
                const param = [req.body.values.groupId];
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result,
                        authData: authData
                    })
                });
            });
        }
    });
});


app.post("/api/group/edit", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'select * from group_details where id = $1';
                const param = [req.body.values.group_id];
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }
    });
});

app.post("/api/group/list", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'SELECT * FROM group_members INNER JOIN users ' +
                    'ON group_members.member_id = users.id where group_members.group_id=$1';
                const param = [req.body.values.group_id];
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }
    });
});


app.post("/api/group/membership", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err){
            res.sendStatus(403);
        }else{
            pool.connect(function(err, client, done) {
                if (err) {
                    console.log("Unable to connect to the database due to " + err);
                }
                const sql = 'select * from group_members ' +
                    'INNER JOIN group_details ON group_details.id = group_members.group_id ' +
                    'INNER JOIN users ON users.id = group_details.created_by ' +
                    'where group_members.member_id = $1'
                const param = [req.body.values.user_id];
                client.query(sql, param, function(err, result) {
                    done();
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    }
                    res.json({
                        results: result.rows,
                        authData: authData
                    })
                });
            });
        }
    });
});

app.listen(PORT, () =>{
    console.log(`Server is listening to port ${PORT}`);
});

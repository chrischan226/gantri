const Pool = require('pg').Pool
const pool = new Pool({
  user: '',
  host: 'localhost',
  database: 'tate',
  password: '',
  port: 5432,
})

const getArt = (req, res) => {
    pool.query('SELECT * FROM art ORDER BY id DESC', (error, results) => {
      if (error) res.status(400);
      if(res.statusCode === 200) {
          res.send(results.rows);
      } else {
          res.send(error)
      }
    })
}

const getArtByID = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(`SELECT * FROM art WHERE id = ${id}`, (error, results) => {
        if (error) res.status(400);
        if(res.statusCode === 200) {
            res.send(results.rows);
        } else {
            res.send(error)
        }
    })
}
    
getArtInfo = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(`SELECT * FROM art WHERE id = ${id}`, (error, results) => {
            if (error) throw error;
            resolve(results.rows);
        })
    });
}

updateComments = (id, comments) => {
    return new Promise((resolve, reject) => { 
        pool.query(`UPDATE art SET comments = '${comments}' WHERE id = ${id}`, (error, results) => {
            if (error) throw error
            resolve('success');
        })
    });
}

addComments = (id, userID, name, content) => {
    if(userID) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO comments(userID, artID, name, content) VALUES(${userID},${id},'${name}','${content}')`, (error, results) => {
                if (error) throw error
                resolve('success');
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO comments(artID, name, content) VALUES(${id},'${name}','${content}')`, (error, results) => {
                if (error) throw error
                resolve('success');
            })
        })
    }
}

const postComment =  async (req, res) => {
    const id = parseInt(req.params.id);
    const { userID, name, content } = req.body;

    try {
        let art = await getArtInfo(id);
        if(art.length > 0) {
            let comments = art[0].comments;
            if(!userID) {
                for(let i = 0; i < comments.length; i++) {
                    if(comments[i].name === name) {
                        res.status(406);
                        break;
                    }
                }
            }
            if(res.statusCode !== 406) {
                comments.push({
                    'userID': userID,
                    'name': name,
                    'content': content
                });
                comments = JSON.stringify(comments);
                var status = await updateComments(id, comments);
            }
            if(status === 'success') status = await addComments(id, userID, name, content);
            if(status === 'success') {
                res.send('Comment added successfully')
            } else {
                res.send('Only one comment per unverified user, comment was unable to be added')
            };
        }
        else {
            res.status(400).send('Art ID is invalid');
        }
    }
    catch(e) {
        throw e;
    }
}

const createUser = (req, res) => {
    const { name, age, location } = req.body

    pool.query(`INSERT INTO users (name,age,location) VALUES ('${name}', ${age}, '${location}')`, (error, results) => {
        if (error) res.statusCode(400)
        if(res.statusCode === 200) {
            res.send('User successfully created')
        } else {
            res.send(error)
        }
    })
}

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) res.statusCode(400);
        if(res.statusCode === 200) {
            res.send(results.rows)
        } else {
            res.send(error)
        }
    })
}

module.exports = {
    getArt,
    getArtByID,
    postComment,
    createUser,
    getUsers,
};
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
      if (error) {
        throw error
      }
      res.send(results.rows)
    })
}

const getArtByID = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(`SELECT * FROM art WHERE id = ${id}`, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

async function getCommentsByArtID(id) {
    let promise = new Promise((resolve, reject) => {
        pool.query(`SELECT comments FROM art WHERE id = ${id}`, (error, results) => {
            if (error) reject(error);
            if(results.rows.length === 0) {
                resolve([]);
            } else {
                resolve(results.rows[0].comments);
            }
        });
    });
    
    let comments = await promise;
    return comments;
}

async function updateComments(id, comments) {
    let promise = new Promise((resolve, reject) => { 
        pool.query(`UPDATE art SET comments = '${comments}' WHERE id = ${id}`, (error, results) => {
            if (error) {
                reject(error)
            }
                resolve('success');
            })
    });

    let status = await promise;
    return status;
}

const postComment = (req, res) => {
    const id = parseInt(req.params.id);
    const { userID, name, content } = req.body;
    
    getCommentsByArtID(id)
        .then(comments => {
            for(let i = 0; i < comments.length; i++) {
                if(comments[i].name === name) {
                    res.status(406);
                    break;
                }
            }
            return comments;
        })
        .then(comments => {
            comments.push({
                'userID': userID,
                'name': name,
                'content': content
            });
            comments = JSON.stringify(comments);
            updateComments(id, comments).then(status => res.status(status));
        })
        .then(() => {
            if(res.statusCode === 200) {
                res.send('Comment added successfully');
            } else {
                res.send('Only one comment per unverified user, comment unable to be added')
            }
        })
        .catch(err => res.send(err));
}

const createUser = (req, res) => {
    const { name, age, location } = req.body

    pool.query(`INSERT INTO users (name,age,location) VALUES ('${name}', ${age}, '${location}')`, (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json('User successfully created')
    })
}

const getUsers = (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).json(results.rows)
    })
}

module.exports = {
    getArt,
    getArtByID,
    postComment,
    createUser,
    getUsers,
};
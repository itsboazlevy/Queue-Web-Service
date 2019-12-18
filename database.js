var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author text, 
            item text
            )`,
        (err) => {
            if (err) {
                // Table already created
            }else{
                // Table just created, creating some rows
                var insert = 'INSERT INTO queue (author, item) VALUES (?,?)'
                db.run(insert, ["author1","item1"])
                db.run(insert, ["author2","item2"])
            }
        });  
    }
});

module.exports = db

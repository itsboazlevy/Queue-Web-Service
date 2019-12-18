// Create express app
let express = require("express")
let app = express()

// Link database
let db = require("./database.js")

// Parser
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
let HTTP_PORT = 8000 

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// PEEK
app.get("/api/items/", (req, res, next) => {
    let sql = "select * from queue"
    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":rows
        })
      });
});

// ENQUEUE
app.post("/api/item/", (req, res, next) => {
    let errors=[]
    if (!req.body.author){
        errors.push("No author specified");
    }
    if (!req.body.item){
        errors.push("No item specified");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    let data = {
        author: req.body.author,
        item: req.body.item,
    }
    let sql ='INSERT INTO queue (author, item) VALUES (?,?)'
    let params =[data.author, data.item]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id" : this.lastID
        })
    });
})

// DEQUEUE
app.get("/api/item/", (req, res, next) => {
    let sql = "select * from queue where id = (select MIN(id) from queue)"
    let params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
        db.run("DELETE FROM queue WHERE id = (SELECT id FROM queue LIMIT 1);");
      });
});


// Default response for any other request
app.use(function(req, res){
    res.status(404);
});


const express = require("express");
const {open} = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors")
const path = require("path");
const app = express();
app.use(express.json());
app.use(cors());

const dbPath = path.join(__dirname , "good.db");

let db = null;

const initializeDbAndServer =async ()=>{
    try{

        db = await open({
            filename:dbPath,
            driver:sqlite3.Database
        });
        
        app.listen(4000 ,()=>{
            console.log("server in running at http://localhost:4000");
        });
    }
    catch(e){
        console.log(`DB error : ${e.message}`);
        process.exit(1);
    }
}
initializeDbAndServer();

app.get("/get" , async (request , response)=>{
    const query = `SELECT * from users ORDER BY Location ASC;`;
    const name = await db.all(query);
    response.send(name);
})

app.post('/addUser' , async (request, response) => {
    const userDetails = request.body
    const { name , age , location , profession } = userDetails;
  
    const addUserQuery = `
          INSERT INTO 
              users(name , age , Location ,Profession)
          VALUES
              (   
                 '${name}',
                  ${age},
                 '${location}',
                 '${profession}'
              )
          ;`;
  
    await db.run(addUserQuery);
    response.send("User Successfully Added");
  });
  
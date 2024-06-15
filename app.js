const parser = require ('body-parser');
const express = require('express');
const mysql = require('mysql');
const hash = require('./lib/hash') 
const app = express();
app.use(parser.json());
 app.use(parser.urlencoded({ extended: false }))
const port = 8009;

var con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"ems"
})


con.connect(function(err){
if(err){
    throw err;
}
console.log('database connection sucessful');
})
app.get('/',(req,res)=>{
    console.log('server is up')
    res.send('server is up')
})

app.post('/register',(req,res)=>{
    if(!req.body.fname || !req.body.lname || !req.body.email || !req.body.username || !req.body.password || !req.body.phone || !req.body.dob || !req.body.dept || !req.body.position || !req.body.role){
        return res.send({message:'All Value is required'});
    }

    let hash_pass = hash.hashPassword(req.body.password)

    con.query('INSERT INTO user (first_name, last_name, email, username, password, phone, dob, department, position, role) VALUES (?,?,?,?,?,?,?,?,?,?);',[req.body.fname,req.body.lname,req.body.email,req.body.username,hash_pass,req.body.phone,req.body.dob,req.body.dept,req.body.position,req.body.role],(err,result)=>{
        if(err){
            console.log("data not inserted",err,)
            res.send({err: 'Data not Added'})
        }else{
            res.send({message:'Data is Added'});
        }
    });
})

app.post('/login',(req,res)=>{
    if(!req.body.username && !req.body.password){
       return res.send({status:0,message:'Username and Password is require'})
    }
    con.query("SELECT * from user WHERE username=? limit 1",(req.body.username),function(err,result){
        if(err){
            console.log(err)
            return res.send({ status:0,message:err.message})
        }
        if(!result.length){
            return res.send({status:0, message: 'No user found'})
        }

        if(hash.validate(req.body.password,result[0].password)){
            return res.send({status:1, message: 'Login sucessfull' })
        }else{
            return res.send({status:0, message: "Incorrect Password"})
        }
    })
    
})

app.listen(port,()=>{
console.log('app listening on',port)
});
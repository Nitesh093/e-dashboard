const express=require("express");
const cors=require("cors");
require('./db/config');
const User=require("./db/User");
const product=require("./db/Product");
const Jwt=require('jsonwebtoken');
const JwtKey='e-comm'
const app=express();

app.use(express.json());
app.use(cors());
app.post('/register',async (req,res)=>{
    let instance=new User(req.body);
    let result= await instance.save();
    if(result){
        Jwt.sign({result},JwtKey,{expiresIn:"5h"},(err,token)=>{
            if(err){
                res.send({result:"something went wrong"})
            }
            else{
                res.send({result,auth:token});
            }
        })
    }
    
});
app.post('/login',async (req,res)=>{
    if(req.body.email && req.body.password){
        let user= await User.findOne(req.body);
        
        if(user){
            Jwt.sign({user},JwtKey,{expiresIn:"5h"},(err,token)=>{
                if(err){
                    res.send({result:"something went wrong"})
                }
                else{
                    res.send({user,auth:token});
                }
            })
        }
    }
    else{
        res.send({result:"No record found"});
    }
})

app.post('/add-product',async (req,res)=>{
    let instance=new product(req.body);
    let result=await instance.save();
    res.send(result);
})
app.get("/list-products",async(req,res)=>{
    const products=await product.find();
    
    res.send(products);
    
});
app.delete("/product/:id",async (req,resp)=>{
    const result=await product.deleteOne({_id:req.params.id})
    resp.send(result);
});
app.get("/product/:id",async (req,res)=>{
    let result=await product.findOne({_id:req.params.id});
    if(result){
        res.send(result);
    }
    else{
        res.send({result:'no record found'});
    }
})
app.put("/product/:id",async (req,res)=>{
    let result=await product.updateOne({_id:req.params.id}
        ,{
            $set:req.body
        })
        res.send(result);
})
app.get("/search/:key",async (req,res)=>{
    let result=await product.find({
        "$or":[{name:{$regex:req.params.key}},
            {company:{$regex:req.params.key }},
            {category:{$regex:req.params.key }},
        ]
    })
    res.send(result);
})

func

app.listen(5000);
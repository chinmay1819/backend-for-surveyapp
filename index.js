const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const formRouter = require("./routes/formRoutes");
const cors=require('cors');
const responseRouter = require("./routes/responseRoutes");
const app = express();
app.use(cors());
const ejs=require('ejs');
app.set('view engine','ejs');
const {parse}=require('json2csv');  
const fs=require('fs'); 
const port =process.env.port || 5000

app.use((req,res,next)=>{
	console.log("HTTP METHOD - " + req.method + ", URL -" + req.url);
	next();
});

app.use(express.json());

app.use("/users", userRouter);
app.use("/form", formRouter);
app.use("/response",responseRouter);
app.use('/public', express.static('public'));
app.get('/',(req,res)=>{
  res.send('working....');
})

mongoose.connect(
    "mongodb+srv://chinmay1819:c9403000981@cluster0.8j3na.mongodb.net/SurveyForms?retryWrites=true&w=majority"
    // "mongodb+srv://vkpatil22:MongoAtlas2206@cluster0.8j3na.mongodb.net/SurveyForms?retryWrites=true&w=majority"

  )
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started ${port} and connected to Database`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

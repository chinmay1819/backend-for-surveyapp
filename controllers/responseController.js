const express = require("express");

// const { Parser }=require('json2csv');
const { parse } = require('json2csv');
const fs = require('fs')
const responseModel = require('../models/response')
const formModel = require('../models/form');


//FOR CREATING A RESPONSE TO THE FORM...
const createResponse = async (req, res) => {

  responseModel.create({
    'title': req.body.title,
    'survey': req.body.survey,
    'email': req.body.email,
    // 'responseContent': req.body.responseContent, 
    'userId': req.userId,
    'formId': req.body.formId,
    // 'questionId':req.body.questionId,

  },
    (err, result) => {
      if (err) {
        console.log('error', err)
        res.send('Something went wrong...')
      } else {
        res.status(200).send(result);
      }
    })


};



//FOR GETTING RESPONSE --> it only returns response of that user
const getResponse = async (req, res) => {
  let qid = req.body.questionId;
  let fid = req.body.formId;
  try {
    // const response = await responseModel.find({
    //   userId: req.userId,
    //   questionId:req.body.questionId,
    //   formId:req.body.formId
    // });

    const requiredForm = await responseModel.find({ formId: fid });

    res.status(200).json({
      requiredForm
    });




  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong..." });
  }
};



// FOR GETTING ALL RESPONSES OF A QUESTION (ONLY FOR ADMIN)
const getAllResponses = async (req, res) => {
 // let qid = req.body.questionId;
  let fid = req.params.id;
  // try {
  //   const responses = await responseModel.find({ "questionId": qid, "formId": fid })
  //   res.status(200).json(responses);

  // }
  // catch (error) {
  //   console.log(error);
  //   res.status(500).json({ message: "Something went wrong..." });
  // }

  try{
    console.log(fid)
    const requiredForm=await responseModel.find({formId:fid});
    console.log(requiredForm)
    console.log(requiredForm[0].survey)

    q=["email"]
    a=[]
    for(let question of requiredForm[0].survey){
      q.push(question.question)
    }
    for(let i of requiredForm){
      dummy=[i.email]
      for(let j of i.survey){
        dummy.push(j.answer)
      }
      a.push(dummy)
    }
    console.log(q)
    console.log(a)
    obj={question:q, answer:a}
    res.status(200).json({
      obj
    });

  }catch(error){
    console.log(error);
  }

};







//FOR DELETING A RESPONSE BY USING ID 
const deleteResponse = async (req, res) => {
  const id = req.params.id;

  const response = await responseModel.findByIdAndRemove(id);
  res.status(202).json(response);


};


// FOR UPDATING A RESPONSE BY USING ID


const updateResponse = async (req, res) => {
  const id = req.params.id;
  const { responseContent, questionId, formId } = req.body;
  const newResponse = {
    responseContent: responseContent,
    questionId: questionId,
    formId: formId
  };
  try {
    await responseModel.findByIdAndUpdate(id, newResponse, { new: true });
    res.status(200).json(newResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong.." });
  }
};


const fillResponse = async (req, res) => {
  const id = req.params.id;
  try {
    // const form=await formModel.findById(id)
    // const title=form.title;
    // res.send(title);
    let questionsArray = [];
    let formTitle;
    let formDescription;

    formModel.findOne({ _id: id }, function (err, document) {
      let formToBeResponded = document;
      formTitle = formToBeResponded.title;
      formDescription = formToBeResponded.formDescription
      for (let i = 0; i < formToBeResponded.questions.length; i++) {
        questionsArray.push(formToBeResponded.questions[i]);
      }
      res.render("fillResponse", {
        questions: questionsArray,
        title: formTitle,
        description: formDescription
      });
    })
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong..." });
  }

}




// FOR DOWNLOADING CSV FILE 

const downloadCSVofResponses = async (req, res) => {
  let fid = req.params.id;

  let responses = await responseModel.find({ formId: fid });

  const fields = ['email', 'formId', 'survey'];
  const opts = { fields };
  try {
    const csv = parse(responses, opts);
    fs.writeFile(`response__${fid}.csv`, csv, function (error) {
      if (error) throw error;
      console.log('write successfully..');
    })
  }
  catch (err) {
    console.log(err);
  }






  //THIS WORKS......
  // const json2csvParser=new Parser();
  // const csv=json2csvParser.parse(responses);

  // fs.writeFile("responses.csv", csv, function(err) {
  //   if(err) {
  //   throw err;
  //   }

  //   })



}


//For getting all responses of a form using form id


const getResponesFormId = async (req, res) => {

  let fid = req.params.formId;
  try {
    let responses = await responseModel.findOne({ formId: fid });
    res.status(201).json(responses);


  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong..." });
  }

}







module.exports = {
  createResponse,
  getResponse,
  deleteResponse,
  updateResponse,
  getAllResponses,
  fillResponse,
  getResponesFormId,
  downloadCSVofResponses
}






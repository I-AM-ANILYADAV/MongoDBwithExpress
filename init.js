const mongoose = require('mongoose');
const Chat = require("./Models/chat.js");
main().then(() =>{
    console.log("Connection Successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsApp');
}

let allchats = [
    
    {
        from :"Anil",
        to :"Rohit",
        message:"Send me your Exam sheets",
        created_at:new Date()
    },

    {
        from :"Ritik",
        to :"Dhruv",
        message:"Send me your Exam sheets",
        created_at:new Date()
    },

    {
        from :"Sankalp",
        to :"Jatin",
        message:"Send me your Exam sheets",
        created_at:new Date()
    },
    {
        from :"Paarth",
        to :"Anil",
        message:"Send me your Exam sheets",
        created_at:new Date()
    },
    {
        from :"Tushar",
        to :"Sanket",
        message:"Send me your Exam sheets",
        created_at:new Date()
    },

]

Chat.insertMany(allchats);
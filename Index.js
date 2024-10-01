const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./Models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const port = 8080;
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsApp');
    console.log("Connection Successful");
}

main().catch(err => console.log(err));

// Index Route
app.get("/chats",asyncWrap ( async (req, res) => {
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs", { chats });
}));

function asyncWrap(fn){
    return function (req, res, next){
        fn(req,res,next).catch((err)=>  next(err))
    }
}

// New Route
app.get("/chats/new", asyncWrap((req, res) => {
    throw new ExpressError (404 ,"Page not found")
    res.render("new.ejs");
}));

// Create Route
app.post("/chats", asyncWrap(async (req, res) => {
        let { from, to, message } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at: new Date()
    });
    await newChat.save();
    console.log("Chat was saved:", newChat);
    res.redirect("/chats");
})); 

// Show Route
app.get("/chats/:id", async (req, res, next) => {
    try{
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
        return next(new ExpressError(404, "Chat not found"));
    }
    res.render("edit.ejs", { chat });
    } catch(err){
        next(err);
    }


});


// Edit Route
app.get("/chats/:id/edit", async (req, res) => {
    try{
    let { id } = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
    }catch(err){
        next(err)
    }
    
});

// Update Route
app.put("/chats/:id", async (req, res) => {
    try{
    let { id } = req.params;
    let { message } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(id, { message: message }, { runValidators: true, new: true });
    console.log("Updated Chat:", updatedChat);
    res.redirect("/chats");
    }catch(err){
        next(err);
    }
});

// Destroy Route
app.delete("/chats/:id", async (req, res) => {
    try{
    let { id } = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log("Deleted Chat:", deletedChat);
    res.redirect("/chats");    
    }catch(err) {
        next(err);
    }
});


app.get("/", (req, res) => {
    res.send("Root is working");
});

const handleValidationErr = (err) =>{
    console.log("thsi is a validation error.Please follow rules")
    console.dir(err.message);
    return err;
    
}

app.use((err, req, res,next) =>{
    console.log(err.name);
    if(err.name ==="validationError"){
       err = handleValidationErr(err);
    }
    next(err);
})
// Error Handling Middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error occurred" } = err;
    res.status(status).send(message);
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

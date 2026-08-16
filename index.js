const express = require("express");
const app = express();
const mongoose = require('mongoose');
const Chat = require("./models/chat.js");
const path = require("path");
const methodOverride = require("method-override");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

main()
    .then(() => {
        console.log("connection successful");
})
.catch((err) => {
    console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');    
}

// INDEX ROUTE

app.get("/chats", async(req,res) => {
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs", { chats });
    // res.send("hekko");
});

//new route
app.get("/chats/new", (req,res) => {
    res.render("new.ejs");
});

//create route
app.post("/chats", (req,res) => {
    let {from, to, msg} = req.body;
    let newChat = new Chat({
        from: from,
        msg: msg,
        to: to,
        created_at: new Date()
    });
    console.log(newChat);

    newChat
    .save()
    .then((res) => {
        console.log("chat was saved");
    })
    .catch((err) => {
        console.log(err);
    })
    res.redirect("/chats");
});

// edit route
app.get("/chats/:id/edit", async(req, res) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", {chat});
});

//Update Route
app.put("/chats/:id", async(req, res) => {
    let { id } = req.params;
    let {msg: newMsg} = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
        id, 
        {msg: newMsg}, 
        {runValidators: true, new: true}
    );
    console.log(updatedChat);
    res.redirect("/chats"); 
});

//DELETE ROUTE
app.delete("/chats/:id", async(req, res) => {
    let { id } = req.params;
    let deleteChat = await Chat.findByIdAndDelete(id);
    console.log(deleteChat);
    res.redirect("/chats"); 
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(8080, () => {
  console.log(" Server is listening on port 8080");
});

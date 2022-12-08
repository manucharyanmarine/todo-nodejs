const express = require ("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { check, validationResult } = require("express-validator")
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true }));  
mongoose.connect("mongodb+srv://todoListApp:test@cluster0.ejoarlx.mongodb.net/?retryWrites=true&w=majority");

const urlencodedParser=bodyParser.urlencoded({extended: false})

const itemSchema={
    name: String,
};

const Item=mongoose.model("Item", itemSchema);

const d=[];
Item.insertMany(d,function(err){
    if(err){
        console.log(err);
    } else{
        console.log("Successfully saved items to database");
    }
});

app.get("/", function(req, res){
    
    Item.find({}, function (err, f) {
        if (f.length === 0){
            Item.insertMany(d, function (err) {
                if(err){
                    console.log(err);
                } else {
                    console.log("Successfully saved items to database");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {newListItem: f});
        }
    })
});

app.post("/", urlencodedParser,[
    check("n", "list item must be 3+ characters long")
        .exists()
        .isLength({min: 3})
], function (req, res) {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).jsonp(errors.array())
    }
    i=req.body.n;
    const item = new Item({
        name: i,
    });
    item.save();
    res.redirect("/");
})

app.post("/delete", function (req, res) {
    Item.findByIdAndRemove(req.body.checkbox, function (err) {
        if(!err){
            console.log("Succressfully deleted");
            res.redirect("/");
        }
    });
});

app.listen(3000, function() {
    console.log("listening on port 3000.");
});
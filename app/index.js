var express = require("express");
var axios = require('axios')
var app = express();

//here we connect to a mongoose database
const mongoose = require("mongoose")
const localDB = 'mongodb://localhost:27017/csfdb';
const connectDB = async () => {
  await mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("Database connected");
}
connectDB();

//set up schema(a basic form for user registration)
const emailForm = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String
})

const Form = mongoose.model("registration", emailForm);
app.use(express.json());

//create user schema
app.post('/', (req, res) => {
    const {name, username, email, password} = req.body;
    axios.get(`https://www.disify.com/api/email/${email}`)
    .then(res => {
        if(!res.data.disposable && res.data.format && res.data.dns) {
            //do nothing
        } else {
            return res.status(400).send("Invalid email provided!");
        }
    }).catch(err => {
        return res.status(500).send(err.message);
    })
    const form = new Form({name, username, email, password});

    form.save((err, res) => {
        if(err) {
            return res.status(500).send(err.message);
        }
        return res.status(201).json({id: form_id});

    })
})

app.get('/:id', (req, res) => {
    const {id} = req.params;

    Form.findById(id, (err, form) => {
        if(err) {
            return res.status(500).send(err.message);
        }
        if(!form) {
            return res.status(404).send("form not found!");
        }

        res.json(form);
    });
})

app.get('/', (req, res) => {
    Form.find({}, (err, form) => {
        if(err) {
            return res.status(500).send(err.message)
        }
        if(!form) {
            return res.status(404).send("empty database");
        }
        res.json(form);
    })
})



app.listen(3000, () => {
    console.log("Server started at port 3000");
})
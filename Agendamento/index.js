const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const appointmentService = require("./services/AppointmentService");
const AppointmentService = require("./services/AppointmentService");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/agendamento", {useNewUrlParser: true, useUnifiedTopology: true});

app.get("/", (req, res) => {
    res.render("index")
});

app.get("/cadastro", (req, res) => {
    res.render("create");
})

app.post("/create", async (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var cpf = req.body.cpf;
    var description = req.body.description;
    var date = req.body.date;
    var time = req.body.time;
    var status = await appointmentService.create(name, email, description, cpf, date, time);
    if(status){
        res.redirect("/")
    } else{
        res.send("Ocorreu uma falha.")
    }
})

app.get("/getcalendar", async (req, res) => {
    var consultas = await AppointmentService.getAll(false);
    res.json(consultas);
})

app.get("/event/:id", async (req, res) => {
    var appointment = await AppointmentService.getById(req.params.id);    
    res.render("event", {appo: appointment});
})

app.post("/finish", async (req, res) => {
    var id = req.body.id;
    var result = await AppointmentService.finish(id);

    res.redirect("/");
})

app.listen(8080, () => {})


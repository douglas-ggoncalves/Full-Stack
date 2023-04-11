var appointment = require("../models/Appointment")
var mongoose = require("mongoose");
var nodemailer = require("nodemailer")
var AppointmentFactory = require("../factories/AppointmentFactory");
var AppointmentModel = mongoose.model("Appointment", appointment)

class AppointmentService{
    async create(name, email, description, cpf, date, time){
        var newAppointmentModel = new AppointmentModel({
            name,
            email,
            description,
            cpf,
            date, 
            time,
            finished: false,
            notified: false
        });
        
        try{
            await newAppointmentModel.save();
            return true;
        }
        catch(err){
            console.log(err);
            return false;
        }
    }

    async getAll(showFinished){
        if(showFinished){
            return await AppointmentModel.find();  // aqui vamos trazer todos os dados
        } else{
            var appos = await AppointmentModel.find({'finished' : false}); // aqui vamos trazer só os dados não finalizados
            var appointments = [];

            appos.forEach(element => {
                if(element.date != undefined){
                    appointments.push(AppointmentFactory.Build(element));
                }
            });

            return appointments;
        }
    }

    async getById(id){
        try{
            var event = await AppointmentModel.findOne({"_id": id});
            return event;
        } catch(err) {
            console.log(err);
        }
    }

    async finish(id){
        try{
            await AppointmentModel.findByIdAndUpdate(id, {finished: true});
            return true;
        }
        catch(err){
            console.log(err);        
            return false;
        }
    }

    async search(query){
        try{
            var appos = await AppointmentModel.find().or([{email: query}, {cpf: query}]);
            return appos;
        } catch(err){
            console.log(err)
            return [];
        }
    }

    async sendNotification(){
        var appos = await this.getAll(false);
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "9b0b965e44097c",
              pass: "dcdc07ac7a0cf1"
            }
        });

        appos.forEach(async app => {
            var date = app.start.getTime();
            var hour = 1000 * 60 * 60;
            var gap = date - Date.now();

            if(gap <= hour){
                if(!app.notified){
                    await AppointmentModel.findByIdAndUpdate(app.id, {notified: true});
                    
                    transporter.sendMail({
                        from: "Douglas Gonçalves <douglas@guia.com.br>",
                        to: app.email,
                        subject: "Sua consulta vai acontecer em breve.",
                        text: "Sua consulta vai acontecer em 1 hora"
                    }).then(res => {
                        console.log("Resposta " + res)
                    }).catch(err => {
                        console.log("Erro " + err)
                    })
                }
            }
        })
    }
}

module.exports = new AppointmentService();
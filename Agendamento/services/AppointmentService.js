var appointment = require("../models/Appointment")
var mongoose = require("mongoose");
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
            finished: false
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
}

module.exports = new AppointmentService();



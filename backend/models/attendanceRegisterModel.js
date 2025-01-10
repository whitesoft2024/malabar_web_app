const mongoose = require('mongoose')

const attendanceRegisterSchema = new mongoose.Schema({
    userId: String,
    checkIn: String,
    checkOut: String,
    date: String,
    location: String,
    leave: String,
    onDuty: String,
    latereason: String,
    branch:String,
    Dutytime:String,
})

const AttendanceRegister = mongoose.model('AttendanceRegister', attendanceRegisterSchema)

module.exports = AttendanceRegister
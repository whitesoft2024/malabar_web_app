const AttendanceRegister = require('../models/attendanceRegisterModel')

//Create and save a new attendance register
exports.create = async (req, res) => {
    const newAttendanceRegister = new AttendanceRegister(req.body)
    try {
        const savedAttendanceRegister = await newAttendanceRegister.save()
        res.status(201).json({
            success: true,
            message: 'Attendance registered successfully',
            AttendanceRegister: savedAttendanceRegister
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message,
        })
    }
}

//Fetch all attendance registers
exports.getAll = async (req, res) => {
    try {
        const attendanceRegisters = await AttendanceRegister.find({})
        res.status(200).json({
            success: true,
            message: 'Attendance registers fetched successfully',
            data: attendanceRegisters
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message
        })
    }
}

// Update an existing attendance register
exports.update = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedAttendanceRegister = await AttendanceRegister.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedAttendanceRegister) {
            return res.status(404).json({
                success: false,
                message: 'Attendance register not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Attendance register updated successfully',
            AttendanceRegister: updatedAttendanceRegister
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again',
            error: error.message
        });
    }
}
const Appointment = require("../models/Appointments");
const Doctor = require("../models/Doctors");
const User = require("../models/Users");



const createDoctorController = async (req, res) => {
    try {
        console.log(req.body, 'req body from doctor register');
        const newDoctor = new Doctor({ ...req.body, personalInformation: req.userId })

        await newDoctor.save()
        res.status(200).send({ message: 'Doctor inserted successfully!', data: newDoctor })
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
}

const getAllDoctorsController = async (req, res) => {
    // const allDoctors = await Doctor.find({}).select({ __v: 0 })
    const { status, specialty, minConsultationFee, maxConsultationFee, sortBy, availability, rating } = req.query

    console.log(`Specialty: ${specialty}, Min Consultation Fee: ${minConsultationFee}, Max Consultation Fee: ${maxConsultationFee}, Sort By: ${sortBy}, Availability: ${availability}, Rating: ${rating}`);


    let find = {}
    let sort = {}

    if (status) {
        find = { ...find, status: { $in: status } }
    }
    if (specialty) {
        const specialtyArray = specialty.split(',')
        find = { ...find, medical_specialty: { $in: specialtyArray } }
    }
    if (minConsultationFee) {
        find = { ...find, consultationFee: { ...find.consultationFee, $gte: Number(minConsultationFee) } }
    }
    if (maxConsultationFee) {
        find = { ...find, consultationFee: { ...find.consultationFee, $lte: Number(maxConsultationFee) } }
    }


    if (availability) {

    }
    if (rating) {

    }

    if (sortBy) {
        if (sortBy === 'ascending') {
            sort = { consultationFee: 'asc' }
        }
        if (sortBy === 'descending') {
            sort = { consultationFee: 'desc' }
        }
        if (sortBy === 'experience') {
            sort = { total_experience_year: 'desc' }
        }
    }



    try {
        const allDoctors = await Doctor.find(find, { __v: 0 }).sort(sort).populate('personalInformation', 'name avatar gender email phone -_id')

        // console.log(allDoctors, 'allDoctors');


        const modifiedDoctors = allDoctors.map(doctor => {
            const docObj = doctor.toObject()
            if (docObj.district) {
                docObj.personalInformation.district = docObj.district
            }
            delete docObj.district
            return docObj
        })

        if (modifiedDoctors) {
            res.status(200).send({
                message: 'Doctors found!',
                data: modifiedDoctors
            })
        } else {
            res.status(500).send({ errors: { common: { msg: 'Doctors not found!' } } })
        }
    }
    catch (e) {
        res.status(500).send({ errors: { common: { msg: `There was a server side error! ${e}` } } })
    }

}

const getExpectedDoctorByIdController = async (req, res) => {
    try {
        const _id = req.params?.id
        const expectedDoctor = await Doctor.findById(_id).select({ __v: 0 }).populate('personalInformation', 'name avatar gender email phone _id')
        if (expectedDoctor) {
            res.status(200).send({
                message: 'Expected doctor found!',
                data: expectedDoctor
            })
        } else {
            res.status(500).send({ errors: { common: { msg: 'Expected doctor not found!' } } })
        }
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }

}

const deleteDoctorByIdController = async (req, res) => {
    try {

        const _id = req.params?.id
        const deleteDoctor = await Doctor.findByIdAndDelete(_id)
        // const deleteDoctor = await Doctor.deleteOne({doctorName: 'test'})
        // const deleteDoctors = await Doctor.deleteMany({doctorName: 'test'})
        if (deleteDoctor) {
            res.status(200).send({
                message: 'Deleted doctor!',
                data: deleteDoctor
            })
        } else {
            res.status(500).send({ errors: { common: { msg: 'Doctor not found to delete!' } } })
        }
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
}

const approveDoctorByIdController = async (req, res) => {
    try {
        const _id = req.params?.id
        const updatedDoctor = await Doctor.findByIdAndUpdate(_id, { status: 'approve' })
        if (!updatedDoctor) {
            return res.status(404).send({ errors: { common: { msg: 'Doctor not found!' } } });
        }

        // Update corresponding user's role
        const userId = updatedDoctor.personalInformation;
        const updateUser = await User.findByIdAndUpdate(userId, { role: 'doctor' });

        if (!updateUser) {
            // Rollback doctor status update if user role update fails
            await Doctor.findByIdAndUpdate(_id, { status: 'pending' })
            return res.status(500).send({ errors: { common: { msg: 'Failed to update user role!' } } });
        }


        res.status(200).send({
            message: 'Doctor approved!',
            data: updatedDoctor
        })

    } catch (e) {
        res.status(500).send({ errors: { common: { msg: `Server error: ${e}` } } })
    }
}

const rejectDoctorByIdController = async (req, res) => {
    try {
        const _id = req.params?.id
        const updatedDoctor = await Doctor.findByIdAndUpdate(_id, { status: 'reject' })
        if (!updatedDoctor) {
            return res.status(404).send({ errors: { common: { msg: 'Doctor not found!' } } });
        }

        // Update corresponding user's role
        const userId = updatedDoctor.personalInformation;
        const updateUser = await User.findByIdAndUpdate(userId, { role: 'user' });

        if (!updateUser) {
            // Rollback doctor status update if user role update fails
            await Doctor.findByIdAndUpdate(_id, { status: 'pending' })
            return res.status(500).send({ errors: { common: { msg: 'Failed to update user role!' } } });
        }

        res.status(200).send({
            message: 'Doctor Rejected!',
            data: updatedDoctor
        })
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: `Server error: ${e}` } } })
    }
}

const updateDoctorByIdController = async (req, res) => {
    try {

        const _id = req.params?.id
        const updatedDoctor = await Doctor.findByIdAndUpdate(_id, {
            $set: {
                ...req.body
            }
        })
        if (updatedDoctor) {
            res.send(`Updated doctor: ${updatedDoctor}`)
        } else {
            res.status(500).send({ errors: { common: { msg: 'Doctor not found!' } } })
        }
    } catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
}



// Appointment controller ****
const bookAppointmentController = async (req, res) => {
    try {
        const data = req.body
        const newAppointment = new Appointment(data)
        await newAppointment.save()

        res.status(200).send({ message: 'Appointment booked successfully!', data: newAppointment })
    }
    catch (e) {
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
}

const getExpectedDoctorAppointmentsByIdController = async(req, res)=> {
    const _id = req?.params?.id
    try{
        const expectedAppointments = await Appointment.find({doctorInfo: _id}, {__v:0}).populate('patientUserInfo', 'name avatar email phone gender').populate('doctorUserInfo', 'name avatar email phone gender')
        if(expectedAppointments){
            res.status(200).send({
                message: 'Expected doctor appointments found!',
                data: expectedAppointments
            })
        } else{
            res.status(500).send({ errors: { common: { msg: 'Expected doctor appointments not found!' } } })
        }
    }
    catch(e){
        res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
    }
}

module.exports = { createDoctorController, getAllDoctorsController, getExpectedDoctorByIdController, deleteDoctorByIdController, approveDoctorByIdController, rejectDoctorByIdController, updateDoctorByIdController, bookAppointmentController, getExpectedDoctorAppointmentsByIdController}
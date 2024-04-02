const Specialty = require("../models/Specialty")

const addSpecialtyController = async (req, res) => {

    try {
        const { specialtyName, specialtyDescription, specialtyLogo } = req.body

        let newSpecialty
        if (req?.files?.length > 0) {
            newSpecialty = new Specialty({ specialtyName, specialtyDescription, specialtyLogo: `${process.env.SERVER_BASE_URL}/${req?.files[0]?.filename}`, admin: req.userId })
        } else {
            newSpecialty = new Specialty({ ...req.body })
        }
        await newSpecialty.save()
        if (newSpecialty) {
            res.status(200).send({ msg: `Specialty inserted successfully!`, _id: newSpecialty?._id })
        } else {
            // Remove the uploaded file
            if (req.files?.length > 0) {
                unlink(path.join(__dirname, `../upload/specialty/${req.files[0]?.filename}`), err => {
                    if (err) console.log(err?.message, 'error from specialty remove file');
                })
            }
            throw createError('There was a server side error')
        }
    } catch (e) {

        console.log(e, 'err form  add specialty');
        // Remove the uploaded file
        if (req.files?.length > 0) {
            unlink(path.join(__dirname, `../upload/specialty/${req.files[0]?.filename}`), err => {
                if (err) console.log(err?.message, 'error from remove file');
            })
        }
        if (e) {
            return res.status(500).send({ errors: { common: { msg: e } } })
        } else {
            return res.status(500).send({ errors: { common: { msg: "There was a server side error!" } } })
        }
    }
}

const getSpecialtyController = async (req, res) => {
    try {
        const specialties = await Specialty.find({}, { __v: 0 }).populate("admin", "name email -_id")
        if (specialties) {
            return res.status(200).send(specialties)
        }
        return res.status(500).send({ errors: { common: { msg: 'Specialties not found!' } } })
    } catch (e) {
        if (e?.message) {
            return res.status(500).send({ errors: { common: { msg: e?.message } } })
        }
        return res.status(500).send({ errors: { common: { msg: "There was a server side error!" } } })
    }
}

const updateSpecialtyController = async (req, res) => {
    const id = req.params?.id
    const receivedData = req.body
    let updatedData

    console.log(receivedData, 'receivedData');

    try {
        if (req.files?.length > 0) {
            updatedData = { ...receivedData, specialtyLogo: `${process.env.SERVER_BASE_URL}/${req.files?.[0]?.filename}` }
        } else {
            updatedData = { ...receivedData, specialtyLogo: req.body?.specialtyLogo }
        }
        const updatedSpecialty = await Specialty.findByIdAndUpdate(id, updatedData, { new: true })
        if (updatedSpecialty) {

            // Deleted prev file from server
            if (updatedSpecialty?.specialtyLogo && req.files?.length > 0) {
                const fileName = updatedSpecialty?.specialtyLogo.split('/').at(-1)
                unlink(path.join(__dirname, `../upload/specialty/${fileName}`), err => {
                    if (err) console.log(err?.message, 'error from remove file');
                })
            }
            res.status(200).send({ message: 'Specialty updated', updatedSpecialty })
        } else {
            throw createError('Specialty not found to update')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
        }
    }

}

const deleteSpecialtyController = async (req, res) => {
    const id = req.params?.id
    try {
        const deleteSpecialty = await Specialty.findByIdAndDelete(id)
        if (deleteSpecialty) {
            // Remove the uploaded file
            if (deleteSpecialty?.specialtyLogo) {
                const fileName = deleteSpecialty?.specialtyLogo.split('/').at(-1)
                unlink(path.join(__dirname, `../upload/specialty/${fileName}`), err => {
                    if (err) console.log(err?.message, 'error from remove file');
                })
            }
            res.status(200).send({
                message: 'Specialty deleted successfully'
            })
        } else {
            throw createError('Specialty not found to delete')
        }
    } catch (e) {
        if (e?.message) {
            res.status(500).send({ errors: { common: { msg: e?.message } } })
        } else {
            res.status(500).send({ errors: { common: { msg: 'There was a server side error!' } } })
        }
    }

}

module.exports = { addSpecialtyController, getSpecialtyController, updateSpecialtyController, deleteSpecialtyController }

const {getMedicine} = require('../../models/medicine.model')


function responseMessage(req, res){
    if(Object.keys(req.body).length === 0){
        return res.status(204).send("Please fill the body.");
    }

    const medName = getMedicine(req.body.name);

    if(!medName) return res.status(400).send("Medicine Name Incorrect");


    return res.status(200).json(medName)
}

module.exports = {
    responseMessage,
}
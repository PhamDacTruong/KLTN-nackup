import patientService from "../services/patientService"
let postBookAppoinment =  async (req, res) => {
    try{
        let info = await patientService.postBookAppoinment(req.body)
        return res.status(200).json(info);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode : -1,
            errMessage : 'Error from server'
         
        })
        
    }
}

let postVerifyBookAppointment =  async (req, res) => {
    try{
        let info = await patientService.postVerifyBookAppointment(req.body)
        return res.status(200).json(info);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode : -1,
            errMessage : 'Error from server'
         
        })
        
    }
}
module.exports = {
    postBookAppoinment : postBookAppoinment,
    postVerifyBookAppointment : postVerifyBookAppointment
}
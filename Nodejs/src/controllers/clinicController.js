import clinicService from "../services/clinicService"
let createClinic =  async (req, res) => {
    
    try{
        let info = await clinicService.createClinic(req.body)
        return res.status(200).json(info);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode : -1,
            errMessage : 'Error from server'
        })
        
    }
}
let getAllClinic =  async (req, res) => {
    
    try{
        let info = await clinicService.getAllClinic(req.body)
        return res.status(200).json(info);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode : -1,
            errMessage : 'Error from server'
        })
        
    }
}
let getDetailClinicById =  async (req, res) => {
    
    try{
        let info = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(info);
    }catch(e){
        console.log(e);
        return res.status(200).json({
            errCode : -1,
            errMessage : 'Error from server'
        })
        
    }
}

let handleDeleteClinic = async (req, res) => {
    if(!req.body.id){
        return res.status(200).json({
            errCode : 1,
            errMessage : "Missing required parameter"
        })
    }
    let message = await clinicService.deleteClinic(req.body.id);
   return res.status(200).json(message);
 }

 let handleEditClinic = async (req, res) => {
    let data = req.body;
    let message = await clinicService.updateClinic(data);
    return res.status(200).json(message);
 }
module.exports = {
    createClinic : createClinic,
    getAllClinic : getAllClinic,
    getDetailClinicById : getDetailClinicById,
    handleDeleteClinic : handleDeleteClinic,
    handleEditClinic : handleEditClinic
   
 }
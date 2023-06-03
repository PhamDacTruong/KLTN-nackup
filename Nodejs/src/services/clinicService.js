const db = require("../models");
require("dotenv").config();

let createClinic = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.imageBase64 ||
        !data.descriptionMarkdown ||
        !data.descriptionHTML
      ) {
        console.log(data)
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        await db.Clinic.create({
          name: data.name,
          address: data.address,
          image: data.imageBase64,
          descriptionMarkdown: data.descriptionMarkdown,
          descriptionHTML: data.descriptionHTML,
        });
        resolve({
          errCode: 0,
          errMessage: "ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
let getAllClinic = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll({});
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer.from(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "ok",
        data,
      });
    } catch (e) {
      reject(e);
    }
  });
};
let getDetailClinicById = async (inputId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameter",
        });
      } else {
        let data = await db.Clinic.findOne({
          where: {
            id: inputId,
          },
          attributes: ["name","address","descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorClinic = [];
            doctorClinic = await db.Doctor_Infor.findAll({
              where: { clinicId: inputId },
              attributes: ["doctorId"],
            });
          data.doctorClinic = doctorClinic;
        } else data = {};
        resolve({
          errCode: 0,
          errMessage: "ok",
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};


let deleteClinic = (clinicId) => {
  return new Promise( async (resolve, reject) => {
      let foundClinic = await db.Clinic.findOne({
          where : {id : clinicId}
      })
      if(!foundClinic){
          resolve({
              errCode : 2,
              errMessage : 'The user is not exist'
          })
      }
     
      await db.Clinic.destroy({
          where : {id : clinicId}
      })
      resolve({
          errCode : 0,
          message : `The user is deleted successfully`
      })
  })
          
}


let updateClinic = (data) => {
  return new Promise( async (resolve, reject) => {
      try{
          if(!data.id ){
              resolve({
                  errCode : 2,
                  errMessage : 'Missing required parameter'
              })
          }
          let clinic = await db.Clinic.findOne({
              where : {id : data.id},
              raw : false
            });
            if(clinic){
           
              clinic.name = data.name;
              clinic.address = data.address;
              clinic.descriptionHTML = data.descriptionHTML;
              clinic.descriptionMarkdown = data.descriptionMarkdown;
               if(data.imageBase64){
                clinic.image = data.imageBase64;
               }
              
              await clinic.save();
              resolve({
                  errCode : 0,
                  message : 'Update the user successfully'
              })
            }else{
              resolve({
                  errCode : 1,
                  errMessage : 'User not found'
              })
            }
      }catch(e){
          reject(e);
      }
  })
          
}
module.exports = {
  createClinic: createClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById,
  deleteClinic : deleteClinic,
  updateClinic : updateClinic
};

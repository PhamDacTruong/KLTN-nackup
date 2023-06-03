import db from "../models/index"
require('dotenv').config();
import _ from "lodash";
import emailService from "../services/emailService"
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE
let getTopDoctorHome = (limitInput) => {
    return new Promise( async (resolve, reject) => {
        try{
            
            let users = await db.User.findAll({
                    limit : limitInput,
                    where :  { roleId : 'R2'},
                    order : [['createdAt', 'DESC']],
                    attributes : {
                        exclude : ['password']
                    },
                    include : [
                        {model : db.Allcode , as : 'positionData', attributes : ['valueEn','valueVi']},
                        {model : db.Allcode , as : 'genderData', attributes : ['valueEn','valueVi']},
                    ],
                    raw : true,
                    nest : true
            })
            resolve({
                errCode: 0,
                data : users
            })

        }catch(e){
            reject(e);
        }
    })
            
}

let getAllDoctors = () => {
    return new Promise( async (resolve, reject) => {
        try{
            let doctors = await db.User.findAll({
                where : { roleId : 'R2' },
                attributes : {
                    exclude : ['password', 'image']
                },
            });
            resolve({
                errCode: 0,
                data : doctors
            })
        }catch(e){
            reject(e);
        }
    })
            
}
let checkRequiredFields = (inputData) => {
    let arrFiled = ['doctorId','contentHTML','contentMarkdown','action','selectedPrice','selectedPayment','selectProvince','nameClinic',
                'addressClinic','note','specialtyId'
            ]

    let isValid = true;
    let element = '';
    for(let i = 0; i < arrFiled.length; i++) {
        if(!inputData[arrFiled[i]]){
            isValid = false;
            element = arrFiled[i];
            break;
        }
    }
    return {
        isValid : isValid,
        element : element
    }

}
let saveDetailInfoDoctor = (inputData) => {
    return new Promise( async (resolve, reject) => {
        try{
            let checkObj = checkRequiredFields(inputData);
           if(checkObj.isValid === false){
            resolve({
                errCode: 1, 
                errMessage: `Invalid parameter : ${checkObj.element}`
            })
           }else {
            if(inputData.action === 'CREATE'){
                await db.Markdown.create({
                    doctorId  : inputData.doctorId,
                    contentHTML : inputData.contentHTML,
                    contentMarkdown : inputData.contentMarkdown,
                    description : inputData.description,
                    
                })
            }else if(inputData.action === 'EDIT'){
                let doctorMarkdown = await db.Markdown.findOne({
                    where : {doctorId : inputData.doctorId},
                    raw : false
                })

                if(doctorMarkdown){
                    doctorMarkdown.contentHTML = inputData.contentHTML;
                    doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                    doctorMarkdown.description = inputData.description;
                    doctorMarkdown.updateAt = new Date()
                    await doctorMarkdown.save()
                }
            }

            let doctorInfo = await db.Doctor_Infor.findOne({
                where : {
                    doctorId : inputData.doctorId,
                   
                },
                raw : false
            })
            if(doctorInfo){
                doctorInfo.doctorId = inputData.doctorId;
                doctorInfo.priceId = inputData.selectedPrice;
                doctorInfo.provinceId = inputData.selectProvince;
                doctorInfo.paymentId = inputData.selectedPayment;

                doctorInfo.nameClinic = inputData.nameClinic;
                doctorInfo.addressClinic = inputData.addressClinic;
                doctorInfo.note = inputData.note;
                doctorInfo.specialtyId = inputData.specialtyId;
                doctorInfo.clinicId = inputData.clinicId;
                await doctorInfo.save()
            }else {
                await db.Doctor_Infor.create({
                    doctorId : inputData.doctorId,
                    priceId : inputData.selectedPrice,
                    provinceId : inputData.selectProvince,
                    paymentId : inputData.selectedPayment,
                    nameClinic : inputData.nameClinic,
                    addressClinic : inputData.addressClinic,
                    note : inputData.note,
                    specialtyId : inputData.specialtyId,
                    clinicId : inputData.clinicId 
                    
                })
            }
           
            resolve({
                errCode: 0,
                errMessage: "Save info successfully"
            })
           }
        
            
        }catch(e){
            reject(e);
        }
    })
            
}


let getDetailDoctorById = (inputId) => {
    return new Promise( async (resolve, reject) => {
        try{
          if(!inputId){
            resolve({
                errCode: 1,
                errMessage: "Invalid parameter"
            })
          }else{
            let data = await db.User.findOne({
                where : {
                    id: inputId
                },
                attributes : {
                    exclude : ['password']
                },
                include : [
                
                    {model : db.Markdown, attributes  : ['description','contentHTML','contentMarkdown']},
                    {model : db.Allcode , as : 'positionData', attributes : ['valueEn','valueVi']},
                    {model : db.Doctor_Infor, 
                        attributes : {
                            exclude : ['id','doctorId']
                        },
                        include : [
                            {model : db.Allcode , as : 'priceTypeData', attributes : ['valueEn','valueVi']},
                            {model : db.Allcode , as : 'provinceTypeData', attributes : ['valueEn','valueVi']},
                            {model : db.Allcode , as : 'paymentTypeData', attributes : ['valueEn','valueVi']},
                        ]

                    },
                ],
                raw : false, 
                nest : true
            })
            if(data && data.image){
                data.image = new Buffer.from(data.image, 'base64').toString('binary');
            }
            if(!data) data = {};
            resolve({
                errCode: 0,
                data : data
            })
            
          }
          
            
        }catch(e){
            reject(e);
        }
    })
            
}

let bulkCreateSchedule = (data) => {
    return new Promise( async (resolve, reject) => {
        try{
            if(!data.arrSchedule || !data.doctorId || !data.formatDate){
                resolve({
                    errCode: 1,
                    errMessage: "Invalid parameter"
                })
            }else{
                let schedule = data.arrSchedule;
                if(schedule  && schedule.length> 0){
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item;
                    })
                }
              

                let existing = await db.Schedule.findAll(
                    { 
                        where : {doctorId : data.doctorId, date : data.formatDate},
                        attributes : ['timeType','date','doctorId','maxNumber'],
                        raw : true
                    });
             

                let toCreate = _.differenceWith(schedule, existing,(a,b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
            

                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }
                resolve({
                    errCode: 0,
                    errMessage: "Ok"
                })
            }
           
        }catch(e){
            reject(e);
        }
    })
            
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise( async (resolve, reject) => {
        try{
            if( !doctorId || !date){
                resolve({
                    errCode: 1,
                    errMessage: "Invalid parameter"
                })
            }else{
                let dataSchedule = await db.Schedule.findAll({
                    where : {
                        doctorId:doctorId,
                        date: date
                    },
                    include : [
                        {model : db.Allcode , as : 'timeTypeData', attributes : ['valueEn','valueVi']},
                        {model : db.User , as : 'doctorData', attributes : ['firstName','lastName']},

                        {model : db.Doctor_Infor , as : 'doctorInfo', attributes : ['addressClinic']},
                    ],
                    raw : false,
                    nest : true
                    
                })
                if(!dataSchedule)  dataSchedule =[];

                resolve({
                    errCode: 0,
                    data: dataSchedule
                })

            }
           
        }catch(e){
            reject(e);
        }
    })
            
}


let getExtraInforDoctorBy = (idInput) => {
    return new Promise( async (resolve, reject) => {
        try{
            if( !idInput ){
                resolve({
                    errCode: 1,
                    errMessage: "Invalid parameter"
                })
            }else{
                let data = await db.Doctor_Infor.findOne({
                    where : {
                        doctorId : idInput,
                    },
                    attributes : {
                        exclude : ['id','doctorId']
                    },
                    include : [
                        {model : db.Allcode , as : 'priceTypeData', attributes : ['valueEn','valueVi']},
                        {model : db.Allcode , as : 'provinceTypeData', attributes : ['valueEn','valueVi']},
                        {model : db.Allcode , as : 'paymentTypeData', attributes : ['valueEn','valueVi']},
                    ],
                    raw : false, 
                    nest : true
                 
                    
                })
                if(!data) data = {};
                resolve({
                    errCode: 0,
                    data: data
               })
            }
        }catch(e){
            reject(e);
        }
    })
            
}

let getProfileDoctorById = (doctorId) => {
    return new Promise( async (resolve, reject) => {
        try{
            if( !doctorId ){
                resolve({
                    errCode: 1,
                    errMessage: "Invalid parameter"
                })
            }else{
                let data = await db.User.findOne({
                    where : {
                        id: doctorId
                    },
                    attributes : {
                        exclude : ['password']
                    },
                    include : [
                        {model : db.Markdown, attributes  : ['description','contentHTML','contentMarkdown']},
                        {model : db.Allcode , as : 'positionData', attributes : ['valueEn','valueVi']},
                        {model : db.Doctor_Infor, 
                            attributes : {
                                exclude : ['id','doctorId']
                            },
                            include : [
                                {model : db.Allcode , as : 'priceTypeData', attributes : ['valueEn','valueVi']},
                                {model : db.Allcode , as : 'provinceTypeData', attributes : ['valueEn','valueVi']},
                                {model : db.Allcode , as : 'paymentTypeData', attributes : ['valueEn','valueVi']},
                            ]
    
                        },
                    ],
                    raw : false, 
                    nest : true
                })
                if(data && data.image){
                    data.image = new Buffer.from(data.image, 'base64').toString('binary');
                }
                if(!data) data = {};
                resolve({
                    errCode: 0,
                    data : data
                })
            }
        }catch(e){
            reject(e);
        }
    })
            
}


let getListPatientForDoctor = (doctorId, date) => {
    return new Promise( async (resolve, reject) => {
        try{
            if( !doctorId || !date ){
                resolve({
                    errCode: 1,
                    errMessage: "Invalid parameter"
                })
            }else{
                let data = await db.Booking.findAll({
                    where: {
                        statusId : 'S2',
                        doctorId : doctorId,
                        date : date
                    },
                    include : [
                        {
                            model : db.User,as : 'patientData' , attributes  : ['email','firstName','address','gender','phoneNumber','lastName'],
                            include : [
                                {model : db.Allcode , as : 'genderData', attributes : ['valueEn','valueVi']},
                            ]
                        },
                        {
                            model : db.Allcode , as : 'timeTypeDataPatient', attributes : ['valueEn','valueVi'],
                        },
                        {
                            model : db.Doctor_Infor , as : 'doctorInfo1', attributes : ['addressClinic'],
                        },
                        {model : db.User , as : 'patientData1', attributes : ['firstName','lastName']},
                    ],
                    raw : false, 
                    nest : true
                })
                resolve({
                    errCode: 0,
                    data : data
                })
            }
        }catch(e){
            reject(e);
        }
    })
            
}


let sendRemedy = (data) => {
    return new Promise( async (resolve, reject) => {
        try{
            if( !data.email || !data.doctorId || !data.patientId | !data.timeType){
                resolve({
                    errCode: 1,
                    errMessage: "Invalid parameter"
                })
            }else{
                let appointment = await db.Booking.findOne({
                    where : {
                        
                        doctorId : data.doctorId,
                        patientId : data.patientId,
                        timeType : data.timeType,
                        statusId : 'S2'
                    },
                    raw : false
                })
                if(appointment && appointment.doctorId === data.doctorId && appointment.patientId === data.patientId && appointment.timeType.toString() === data.timeType && appointment.date === data.date ){
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                await emailService.sendAttachment(data)
                resolve({
                    errCode: 0,
                    errMessage : 'ok'
                })


                if (appointment && appointment.statusId === 'S3') {
                    await db.Booking.destroy({
                        where: {
                            statusId: 'S3'
                            // patientId: data.patientId
                        }
                    });
                }

            }
        }catch(e){
            reject(e);
        }
    })
            
}







module.exports = {
    getTopDoctorHome : getTopDoctorHome,
    getAllDoctors : getAllDoctors,
    saveDetailInfoDoctor : saveDetailInfoDoctor,
    getDetailDoctorById : getDetailDoctorById,
    bulkCreateSchedule : bulkCreateSchedule,
    getScheduleByDate : getScheduleByDate,
    getExtraInforDoctorBy : getExtraInforDoctorBy,
    getProfileDoctorById : getProfileDoctorById,
    getListPatientForDoctor : getListPatientForDoctor,
    sendRemedy : sendRemedy,
    
}

















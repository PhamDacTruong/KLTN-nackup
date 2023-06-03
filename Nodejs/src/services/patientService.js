import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
const { Op } = require("sequelize");
let buildUilEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

  return result;
};
let postBookAppoinment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.timeType ||
        !data.date ||
        !data.fullName ||
        !data.selectedGender ||
        !data.address || 
        !data.reason
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing parameters",
        });
      } else {
        let token = uuidv4();
        await emailService.sendSimpleEmail({
          receiverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          language: data.language,
          redirectLink: buildUilEmail(data.doctorId, token),
          doctorInfo : data.doctorInfo,
          reason: data.reason,
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
            phoneNumber: data.phoneNumber,
            lastName: data.reason
          },
        });
        
        if (user && user[0]) {
          // Kiểm tra nếu người dùng đã tồn tại
          if (user[1] === false) {
            // Người dùng đã tồn tại, cập nhật thông tin
            await db.User.update(
              {
                roleId: "R3",
                gender: data.selectedGender,
                address: data.address,
                firstName: data.fullName,
                phoneNumber: data.phoneNumber,
                lastName: data.reason
              },
              {
                where: { id: user[0].id } // Cập nhật người dùng có id tương ứng
              }
            );
          }
        
          const existingBooking = await db.Booking.findOne({
            where: {
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        
          if (!existingBooking) {
            await db.Booking.create({
              statusId: "S1",
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token: token,
            });
          }
        }


        await db.Schedule.destroy({
            where: {
              doctorId: data.doctorId,
              date: data.date,
              timeType: data.timeType,
            },
          });

        resolve({
          errCode: 0,
          errMessage: "Save Infor patient succeed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postVerifyBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: "User not found",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
           
          await appointment.save();
         
          
          resolve({
            errCode: 0,
            errMessage: "Update the  appointment successfully",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist ",
          });
        }
      }

      resolve({
        errCode: 0,
        errMessage: "Save Infor patient succeed",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppoinment: postBookAppoinment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
// if(user && user[0]){
//     await db.Booking.findOrCreate({
//         where : {patientId : user[0].id},
//         defaults : {
//             statusId : 'S1',
//             doctorId : data.doctorId,
//             patientId : user[0].id,
//             date : data.date,
//             timeType : data.timeType,
//             token : token
//         }

//     })

// }
// let [user, created] = await db.User.findOrCreate({
        //   where: { email: data.email },
        //   defaults: {
        //     email: data.email,
        //     roleId: "R3",
        //     gender: data.selectedGender,
        //     address: data.address,
        //     firstName: data.fullName,
        //     phoneNumber: data.phoneNumber,
        //     lastName : data.reason
        //   },
        // });
        
        // if (!created) {
        //   // Người dùng đã tồn tại, tiến hành cập nhật thông tin
        //   await db.User.update(
        //     {
        //       lastName : data.reason
        //     },
        //     { where: { email: data.email } }
        //   );
        // }
        

        // if (user && user[0]) {
        //   const existingBooking = await db.Booking.findOne({
        //     where: {
        //       patientId: user[0].id,
        //       date: data.date,
        //       doctorId: data.doctorId,
        //     },
        //   });
          
        //   if (!existingBooking) {
        //     await db.Booking.create({
        //       statusId: "S1",
        //       doctorId: data.doctorId,
        //       patientId: user[0].id,
        //       date: data.date,
        //       timeType: data.timeType,
        //       token: token,
        //     });
           
        //   }
          
        // }

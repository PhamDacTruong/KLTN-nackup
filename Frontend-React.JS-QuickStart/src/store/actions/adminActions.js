import actionTypes from './actionTypes';
import { toast } from 'react-toastify';
import { getAllCodeService,createNewUserService,createNewClinic,editClinicService,createNewSpecialty,
    getAllUsers, deleteUserService, editUserService, editSpecialtyService,
    getDoctorHomeService, getAllDoctors,saveDetailDoctorService, getAllSpecialty, getAllClinic, deleteSpecialtyService,deleteClinicService } from '../../services/userService';
// export const fetchGenderStart = () => ({
//     type: actionTypes.FETCH_GENDER_START,
// })


export const fetchGenderStart = () => {
    return async(dispatch,getState) => {
        try {
            dispatch({type :actionTypes.FETCH_GENDER_START})
            let res = await getAllCodeService("GENDER")
            if(res && res.errCode === 0 ){
                dispatch(fetchGenderSuccess(res.data)) ;
            }else{
                dispatch(fetchGenderFailed()) ;
           
            }
    
        }catch(e){
            dispatch(fetchGenderFailed()) ;
            console.log('fetchGenderFailed', e)
        }
    }
   


}

export const fetchGenderSuccess =  (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data : genderData
})

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED
})

export const fetchPositionSuccess =  (positionData) => ({
    type: actionTypes.FETCH_POSITION_SUCCESS,
    data : positionData
})

export const fetchPositionFailed = () => ({
    type: actionTypes.FETCH_POSITION_FAILED
})

export const fetchRoleSuccess =  (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data : roleData
})

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED
})


export const fetchPositionStart = () => {
    return async(dispatch,getState) => {
        try {

            let res = await getAllCodeService("POSITION")
            if(res && res.errCode === 0 ){
                dispatch(fetchPositionSuccess(res.data)) ;
            }else{
                dispatch(fetchPositionFailed()) ;
           
            }
    
        }catch(e){
            dispatch(fetchPositionFailed()) ;
            console.log('fetchPositionFailed', e)
        }
    }
}

export const fetchRoleStart = () => {
    return async(dispatch,getState) => {
        try {

            let res = await getAllCodeService("ROLE")
            if(res && res.errCode === 0 ){
                dispatch(fetchRoleSuccess(res.data)) ;
            }else{
                dispatch(fetchRoleFailed()) ;
           
            }
    
        }catch(e){
            dispatch(fetchRoleFailed()) ;
            console.log('fetchRoleFailed', e)
        }
    }
}

export const createNewUser = (data) => {
    return async(dispatch,getState) => {
        try {

            let res = await createNewUserService(data);
      
            if(res && res.errCode === 0 ){
                toast.success("Created new user successfully")
                dispatch(saveUserSuccess()) ;
                dispatch(fetchAllUsersStart());
            }else{
                toast.error("Fetch all  user error");
                dispatch(saveUserFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Fetch all  user error");
            dispatch(saveUserFailed()) ;
            console.log('fetchRoleFailed', e)
        }
    }

}

export const saveUserSuccess = () => ({
    type : actionTypes.CREATE_USER_SUCCESS
})
export const saveUserFailed = () => ({
    type : actionTypes.CREATE_USER_FAILED
})
   
    
export const fetchAllUsersStart = () => {
    return async(dispatch,getState) => {
        try {

            let res = await getAllUsers("ALL")
            if(res && res.errCode === 0 ){

                dispatch(fetchAllUsersSuccess(res.users.reverse())) ;
            }else{
                dispatch(fetchAllUsersFailed()) ;
           
            }
    
        }catch(e){
            dispatch(fetchAllUsersFailed()) ;
            console.log('fetchAllUsersFailed', e)
        }
    }
}
export const fetchAllUsersSuccess = (data) => ({
    type : actionTypes.FETCH_ALL_USERS_SUCCESS,
    users : data
})

export const fetchAllUsersFailed = () => ({
    type : actionTypes.FETCH_ALL_USERS_FAILED
})


export const deleteNewUser = (userId) => {
    return async(dispatch,getState) => {
        try {

            let res = await deleteUserService(userId);
      
            if(res && res.errCode === 0 ){
                toast.success("Delete user successfully")
                dispatch(deleteUsersSuccess()) ;
                dispatch(fetchAllUsersStart());
            }else{
                toast.error("Delete user error")
                dispatch(deleteAllUsersFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Delete user error");
            dispatch(deleteAllUsersFailed()) ;
            console.log('deleteAllUsersFailed', e)
        }
    }

}

export const deleteUsersSuccess = (data) => ({
    type : actionTypes.DELETE_USER_SUCCESS,
    users : data
})

export const deleteAllUsersFailed = () => ({
    type : actionTypes.DELETE_USER_FAILED
})

export const editNewUser = (data) => {
    return async(dispatch,getState) => {
        try {

            let res = await editUserService(data);
      
            if(res && res.errCode === 0 ){
                toast.success("Cập nhập người dùng thành công")
                dispatch(editUsersSuccess()) ;
                dispatch(fetchAllUsersStart());
            }else{
                toast.error("Update the user error")
                dispatch(editAllUsersFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Update the user error");
            dispatch(editAllUsersFailed()) ;
            console.log('editAllUsersFailed', e)
        }
    }

}

export const editUsersSuccess = () => ({
    type : actionTypes.EDIT_USER_SUCCESS,
   
})

export const editAllUsersFailed = () => ({
    type : actionTypes.EDIT_USER_FAILED
})

export const fetchTopDoctor = () =>{
    return async(dispatch,getState) => {
        try {
            let res = await getDoctorHomeService('');
            if(res && res.errCode === 0){
                dispatch({
                    type : actionTypes.FETCH_TOP_DOCTORS_SUCCESS,
                    dataDoctors : res.data
                })
            }else{
                dispatch({
                        type : actionTypes.FETCH_TOP_DOCTORS_FAILED,
                })
            }
        }catch(e){
            console.log('FETCH_TOP_DOCTORS_FAILED : ',e)
            dispatch({
                type : actionTypes.FETCH_TOP_DOCTORS_FAILED,
        })
        }
    }
}


export const fetchAllDoctor = () =>{
    return async(dispatch,getState) => {
        try {
            let res = await getAllDoctors();
            if(res && res.errCode === 0){
                dispatch({
                    type : actionTypes.FETCH_ALL_DOCTORS_SUCCESS,
                    dataDr : res.data
                })
            }else{
                
                dispatch({
                        type : actionTypes.FETCH_ALL_DOCTORS_FAILED,
                })
            }
        }catch(e){
            console.log('FETCH_ALL_DOCTORS_FAILED : ',e)
            dispatch({
                type : actionTypes.FETCH_ALL_DOCTORS_FAILED,
        })
        }
    }
}



export const saveDetailDoctor = (data) =>{
    return async(dispatch,getState) => {
        try {
            let res = await saveDetailDoctorService(data);
            if(res && res.errCode === 0){
                toast.success("Save info doctor successfully")
                dispatch({
                    type : actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
           
                })
            }else{
                console.log('SAVE_DETAIL_DOCTOR_FAILED : ',res)
                toast.error("Lưu bác sĩ thất bại")
                dispatch({
                        type : actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
                })
            }
        }catch(e){
            toast.error("Lưu bác sĩ thành công")
            console.log('SAVE_DETAIL_DOCTOR_FAILED : ',e)
            dispatch({
                type : actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
        })
        }
    }
}

export const fetchAllScheduleTime = () =>{
    return async(dispatch,getState) => {
        try {
            let res = await getAllCodeService("TIME");
            if(res && res.errCode === 0){
                dispatch({
                    type : actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
                    dataTime : res.data
                })
            }else{
                
                dispatch({
                        type : actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
                })
            }
        }catch(e){
            console.log('FETCH_ALLCODE_SCHEDULE_TIME_FAILED : ',e)
            dispatch({
                type : actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
        })
        }
    }
}



export const getRequireDoctorInfor = () => {
    return async(dispatch,getState) => {
        try {
            dispatch({type :actionTypes.FETCH_REQUIRE_DOCTOR_INFO_START})
            let resPrice = await getAllCodeService("PRICE")
            let resPayment = await getAllCodeService("PAYMENT")
            let resProvince = await getAllCodeService("PROVINCE")
            let resSpecialty = await getAllSpecialty();
            let resClinic = await getAllClinic();
            if(resPrice && resPrice.errCode === 0 && 
                resPayment && resPayment.errCode === 0 && 
                resProvince && resProvince.errCode === 0 && 
                resSpecialty && resSpecialty.errCode === 0 && resClinic && resClinic.errCode === 0
                ){
                    let data = {
                        resPrice : resPrice.data,
                        resPayment : resPayment.data,
                        resProvince : resProvince.data,
                        resSpecialty : resSpecialty.data,
                        resClinic : resClinic.data
                    }
                dispatch(getRequireDoctorInforSuccess(data)) ;
            }else{
                dispatch(getRequireDoctorInforFailed()) ;
           
            }
    
        }catch(e){
            dispatch(getRequireDoctorInforFailed()) ;
            console.log('getRequireDoctorInforFailed', e)
        }
    }
   


}

export const getRequireDoctorInforSuccess =  (allRequiredData) => ({
    type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_SUCCESS,
    data : allRequiredData
})

export const getRequireDoctorInforFailed = () => ({
    type: actionTypes.FETCH_REQUIRE_DOCTOR_INFO_FAILED
})



export const fetchSpecialtyStart = () => {
    return async(dispatch,getState) => {
        try {

            let res = await getAllSpecialty("ALL")
            if(res && res.errCode === 0 ){
                dispatch(fetchAllSpecialtySuccess(res.data.reverse())) ;
            }else{
                dispatch(fetchAllSpecialtyFailed()) ;
           
            }
    
        }catch(e){
            dispatch(fetchAllSpecialtyFailed()) ;
            console.log('fetchAllSpecialtyFailed', e)
        }
    }
}

export const fetchAllSpecialtySuccess =  (data) => ({
    type: actionTypes.FETCH_ALL_SPECIALTY_SUCCESS,
    specialty : data
})

export const fetchAllSpecialtyFailed = () => ({
    type: actionTypes.FETCH_ALL_SPECIALTY_FAILED
})
////////////////
export const createNewSpecialtyRedux = (data) => {
    return async(dispatch,getState) => {
        try {

            let res = await createNewSpecialty(data);
            if(res && res.errCode === 0 ){
                toast.success("Created specialty successfully")
                dispatch(saveSpecialtySuccess()) ;
                dispatch(fetchSpecialtyStart());
            }else{
                toast.error("Fetch all specialty error");
                dispatch(saveSpecialtyFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Fetch all  specialty error");
            dispatch(saveSpecialtyFailed()) ;
            console.log('saveSpecialtyFailed', e)
        }
    }

}

export const saveSpecialtySuccess = () => ({
    type : actionTypes.CREATE_SPECIALTY_SUCCESS
})
export const saveSpecialtyFailed = () => ({
    type : actionTypes.CREATE_SPECIALTY_FAILED
})

///////////
export const deleteSpecialty = (specialtyId) => {
    return async(dispatch,getState) => {
        try {

            let res = await deleteSpecialtyService(specialtyId);
      
            if(res && res.errCode === 0 ){
                toast.success("Delete specialty successfully")
                dispatch(deleteSpecialtySuccess()) ;
                dispatch(fetchSpecialtyStart());
            }else{
                toast.error("Fetch all  user error");
                dispatch(deleteSpecialtyFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Fetch all  user error");
            dispatch(deleteSpecialtyFailed()) ;
            console.log('deleteSpecialtyFailed', e)
        }
    }

}


export const deleteSpecialtySuccess =  () => ({
    type: actionTypes.DELETE_SPECIALTY_SUCCESS,
})

export const deleteSpecialtyFailed = () => ({
    type: actionTypes.DELETE_SPECIALTY_FAILED
})

export const editSpecialty = (data) => {
    return async(dispatch,getState) => {
        try {

            let res = await editSpecialtyService(data);
      
            if(res && res.errCode === 0 ){
                toast.success("Cập nhập chuyên khoa thành công")
                dispatch(editSpecialtySuccess()) ;
                dispatch(fetchSpecialtyStart());
            }else{
                toast.error("Cập nhập chuyên khoa thất bại")
                dispatch(editSpecialtyFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Cập nhập chuyên khoa thất bại");
            dispatch(editSpecialtyFailed()) ;
            console.log('editAllUsersFailed', e)
        }
    }

}
export const editSpecialtySuccess =  () => ({
    type: actionTypes.EDIT_SPECIALTY_SUCCESS,
})

export const editSpecialtyFailed = () => ({
    type: actionTypes.EDIT_SPECIALTY_FAILED
})




export const fetchClinicStart = () => {
    return async(dispatch,getState) => {
        try {

            let res = await getAllClinic("ALL")
            if(res && res.errCode === 0 ){
                dispatch(fetchAllClinicSuccess(res.data.reverse())) ;
            }else{
                dispatch(fetchAllClinicFailed()) ;
           
            }
    
        }catch(e){
            dispatch(fetchAllClinicFailed()) ;
            console.log('fetchAllClinicFailed', e)
        }
    }
}

export const fetchAllClinicSuccess =  (data) => ({
    type: actionTypes.FETCH_ALL_CLINIC_SUCCESS,
    clinic : data
})

export const fetchAllClinicFailed = () => ({
    type: actionTypes.FETCH_ALL_CLINIC_FAILED
})




export const deleteClinic = (clinicId) => {
    return async(dispatch,getState) => {
        try {

            let res = await deleteClinicService(clinicId);
      
            if(res && res.errCode === 0 ){
                toast.success("Delete clinic successfully")
                dispatch(deleteClinicSuccess()) ;
                dispatch(fetchClinicStart());
            }else{
                toast.error("Fetch all  user error");
                dispatch(deleteClinicFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Fetch all  user error");
            dispatch(deleteClinicFailed()) ;
            console.log('deleteClinicFailed', e)
        }
    }

}


export const deleteClinicSuccess =  () => ({
    type: actionTypes.DELETE_CLINIC_SUCCESS,
})

export const deleteClinicFailed = () => ({
    type: actionTypes.DELETE_CLINIC_FAILED
})


////////////////

export const createNewClinicRedux = (data) => {
    return async(dispatch,getState) => {
        try {

            let res = await createNewClinic(data);
            console.log('check create clinic', res);
            if(res && res.errCode === 0 ){
                toast.success("Created clinic successfully")
                dispatch(saveClinicSuccess()) ;
                dispatch(fetchClinicStart());
            }else{
                toast.error("Fetch all clinic error");
                dispatch(saveClinicFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Fetch all  clinic error");
            dispatch(saveClinicFailed()) ;
            console.log('saveClinicFailed', e)
        }
    }

}

export const saveClinicSuccess = () => ({
    type : actionTypes.CREATE_CLINIC_SUCCESS
})
export const saveClinicFailed = () => ({
    type : actionTypes.CREATE_CLINIC_FAILED
})



export const editClinic = (data) => {
    return async(dispatch,getState) => {
        try {

            let res = await editClinicService(data);
      
            if(res && res.errCode === 0 ){
                toast.success("Cập nhập phòng khám thành công")
                dispatch(editClinicSuccess()) ;
                dispatch(fetchClinicStart());
            }else{
                toast.error("Update the clinic error")
                dispatch(editClinicFailed()) ;
           
            }
    
        }catch(e){
            toast.error("Update the clinic error");
            dispatch(editClinicFailed()) ;
            console.log('editAllUsersFailed', e)
        }
    }

}
export const editClinicSuccess =  () => ({
    type: actionTypes.EDIT_CLINIC_SUCCESS,
})

export const editClinicFailed = () => ({
    type: actionTypes.EDIT_CLINIC_FAILED
})


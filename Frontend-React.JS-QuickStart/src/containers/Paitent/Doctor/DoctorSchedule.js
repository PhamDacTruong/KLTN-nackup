import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import './DoctorSchedule.scss';
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils';
import { getScheduleDoctorByDate } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import BookingModal from './Modal/BookingModal';
class DoctorSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            allDays  : [],
            allAvalableTimes : [],
            isOpenModalBooking  :false,
            dataScheduleTimeModal : {},
            disabledButtons: [],
          
        
        };
      }
    
     async componentDidMount() {
       let { language } = this.props;
       let allDays = this.getArrDays(language);
        if(this.props.doctorParent){
            let res = await getScheduleDoctorByDate(this.props.doctorParent, allDays[0].value);
            this.setState({
                allAvalableTimes : res.data ? res.data : []
            })
        }
       if( allDays && allDays.length > 0 ) {
        this.setState({ allDays : allDays });
       }
      }

     

      getArrDays =  (language) => {
        let allDays = []
        for(let i = 0; i < 7 ;i ++){
         let object = {};
         if( language === LANGUAGES.VI){
            if(i === 0){
                let ddMM = moment(new Date()).format('DD/MM');
                let today = `Hôm nay - ${ddMM}`;
                object.label = today
            }else{
                let labelVi = moment(new Date()).add(i, 'days').format('dddd - DD/MM');
                object.label = this.capitalizeFirstLetter(labelVi)
            }
           
         }else {
            if(i === 0){
                let ddMM = moment(new Date()).format('DD/MM');
                let today = `Today - ${ddMM}`;
                object.label = today
            }else{
                object.label = moment(new Date()).add(i, 'days').locale('en').format('dddd - DD/MM');
            }
            
         }
        
         object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
 
         allDays.push(object);
        }
        return allDays;

       
       
      }
    
     async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language){
            let allDays =  this.getArrDays(this.props.language);
            this.setState({ allDays: allDays });
        }
        if(this.props.doctorParent !== prevProps.doctorParent){
            let allDays = this.getArrDays(this.props.language);
            let res = await getScheduleDoctorByDate(this.props.doctorParent, allDays[0].value);
            this.setState({
                allAvalableTimes : res.data ? res.data : []
            })
        }
       
      }
      handleOnChangeSelect = async (event) => {
        if(this.props.doctorParent && this.props.doctorParent !== -1){
            let doctorId = this.props.doctorParent;
            let date = event.target.value
            let res = await getScheduleDoctorByDate(doctorId, date)

            if(res && res.errCode === 0){
                this.setState({
                    allAvalableTimes  : res.data  ? res.data : []
                })
            }
          
        }
      }
       capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
   
    handleClickScheduleTime = (time) =>  {

    //     const { disabledButtons } = this.state;
    // const { id } = time;

    // if (disabledButtons.includes(id)) {
    //   return;
    // }   
        this.setState({
            isOpenModalBooking : true,
            dataScheduleTimeModal : time,
            // disabledButtons: [...disabledButtons, id]
        })
     

    }
    closeBookingModal = () =>  {
        this.setState({
            isOpenModalBooking : false
        })
    }
    
    render() {
    //  let { allDays, allAvalableTimes, isOpenModalBooking, dataScheduleTimeModal, disabledButtons} =this.state
     let { allDays, allAvalableTimes, isOpenModalBooking, dataScheduleTimeModal } =this.state
     let { language } = this.props;
       
        return (
            <>
          <div className="doctor-schedule-container">
            <div className="all-schedule">
               <select onChange={(event) => this.handleOnChangeSelect(event)}>
                {allDays && allDays.length > 0 && allDays.map((item, index) =>{
                    return (
                        <option value={item.value} key = {index}>{item.label}</option>
                    )
                })}
                    
               </select>
            </div>
            <div className="all-available-time">
                <div className="text-calendar">
                    <i className="fas fa-calendar-alt"><span><FormattedMessage id="patient.detail-doctor.schedule"/></span></i>
                </div>
                <div className="time-content">
                    {allAvalableTimes && allAvalableTimes.length > 0 ?
                    <>
                    <div className="time-content-btn">
                    {allAvalableTimes.map((item, index) => {
                        let timeDisplay = language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                        // let isDisabled = disabledButtons.includes(item.id);
                        return (
                            <button key = {index}
                            className = { language === LANGUAGES.VI ? 'btn-vie' : 'btn-en'}
                            // className={
                            //     language === LANGUAGES.VI
                            //       ? `btn-vie${item.id === dataScheduleTimeModal.id ? ' active' : ''}`
                            //       : `btn-en${item.id === dataScheduleTimeModal.id ? ' active' : ''}`
                            //   }
                            onClick = {() => this.handleClickScheduleTime(item)}
                    
                         
                            // disabled={isDisabled}
                            >{timeDisplay}</button>
                        )
                    })
                }
                    </div>
                   

                <div className="book-free">
                    <span><FormattedMessage  id="patient.detail-doctor.choose"/> <i className="fa fa-hand-point-up"></i><FormattedMessage  id="patient.detail-doctor.book-free"/></span>
                </div>
                    </>
                    : 
                    <div className="no-schedule"><FormattedMessage  id="patient.detail-doctor.none"/></div>
                }
                </div>
            </div>


          </div>

          <BookingModal 
          isOpenModal = {isOpenModalBooking} 
          closeBookingModal = {this.closeBookingModal}
          dataTime = {dataScheduleTimeModal}
         
          />
          </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language : state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);

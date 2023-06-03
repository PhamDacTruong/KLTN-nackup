import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageSchedule.scss";
import Select from "react-select";
import {LANGUAGES} from "../../../utils";
import DatePicker from '../../../components/Input/DatePicker'
import * as actions from "../../../store/actions";
import { toast } from "react-toastify";
import _ from "lodash";
import { saveBulkScheduleDoctor } from "../../../services/userService"
class ManageSchedule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listDoctors : [],
      selectedDoctor : [],
      currentDate : '',
      rangeTime : []
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    
    if(prevProps.allDoctors !==  this.props.allDoctors){
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
      this.setState({
        listDoctors : dataSelect
      })
    }
    if(prevProps.allScheduleTime !== this.props.allScheduleTime){
      let data = this.props.allScheduleTime;
      if(data && data.length > 0 ){
        data = data.map(item => ({...item, isSelected : false}))
      }

      this.setState({
        rangeTime : data
      })
    }
    // if(prevProps.language !== this.props.language){
    //   let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
    //   this.setState({
    //     listDoctors : dataSelect
    //   })
    // }
  }

  buildDataInputSelect = (inputData) => {
    let result = [];
    let {language} = this.props;
    if(inputData && inputData.length > 0){
      inputData.map((item,index) => {
        let object = {};
        let labeVi = `${item.lastName} ${item.firstName} `
        let labeEn = `${item.firstName} ${item.lastName} `

        object.label = language === LANGUAGES.VI ? labeVi : labeEn; 
        object.value = item.id;
        result.push(object); 
      })
    }
    return result;

  }

  componentDidMount() {
    this.props.fetchAllDoctor();
    this.props.fetchAllScheduleTime()
  }
  handleChangeSelect = async(selectedOption) => {
    this.setState({ selectedDoctor : selectedOption });
  
    
  };
  handleOnChangeDate = (date) => {
    this.setState({
      currentDate : date[0]
    })
  }
  handleSaveSchedule = async () => {
    let result = []
    let { rangeTime, selectedDoctor, currentDate } = this.state 
    if(!currentDate){
      toast.error('Invalid date');
      return;
    }
    if(selectedDoctor && _.isEmpty(selectedDoctor)){
      toast.error('Invalid select doctor');
      return;
    }
    // let formatDate = moment(currentDate).format(dateFormat.SEND_TO_SERVER);
    let formatDate = new Date(currentDate).getTime();
    if(rangeTime && rangeTime.length > 0){
      let selectTime = rangeTime.filter(item => item.isSelected === true)
      if(selectTime && selectTime.length > 0){
        selectTime.map(schedule => {
          let object = {};
          object.doctorId = selectedDoctor.value;
          object.date = formatDate;
          object.timeType = schedule.keyMap;
          result.push(object);


        })
      }else{
        toast.error('Invalid select time');
        return;
      }
 
    }
    let res = await saveBulkScheduleDoctor({
      arrSchedule : result,
      doctorId : selectedDoctor.value,
      formatDate : formatDate
    });

  if(res && res.errCode === 0){
    toast.success('Tạo lịch khám bệnh thành công');
  }else {
    toast.error('Tạo lịch khám bệnh thất bại');
  }
    
 
  }
  handleClickBtnTime = (time) => {
    let { rangeTime } = this.state;
    if( rangeTime && rangeTime.length > 0){
      rangeTime = rangeTime.map(item =>  {
        if(item.id === time.id) item.isSelected = !item.isSelected;
        return item;
      })
        this.setState({
          rangeTime : rangeTime
        })
      
    }
  }
  render() {
    
    let { rangeTime} = this.state;
    let {language} = this.props;
    let yesterday = new Date(new Date().setDate(new Date().getDate()-1));
    
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manga-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label><FormattedMessage id="manga-schedule.choose-doctor" /></label>
              <Select
              value={this.state.selectedDoctor}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
            />
            </div>
            <div className="col-6 form-group">
              <label><FormattedMessage id="manga-schedule.choose-date" /></label>
              <DatePicker 
              onChange = {this.handleOnChangeDate} 
              className = "form-control"
              minDate = {yesterday}
              value = {this.state.currentDate}
              />
              
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime && rangeTime.length > 0 && 
              rangeTime.map((item,index)=>{
                return (<button 
                    className={item.isSelected === true ? "btn btn-schedule active" : "btn btn-schedule" } 
                    key = {index}
                    onClick = {() => this.handleClickBtnTime(item)}
                    
                    >{language === LANGUAGES.VI ? item.valueVi : item.valueEn}</button>
              )})}
            </div>
            <div className="col-12">
                 <button className="btn btn-primary btn-save-schedule"
                 onClick={() => this.handleSaveSchedule()}
                 ><FormattedMessage id="manga-schedule.save-info" /></button>
            </div>
          
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
 
    isLoggedIn: state.user.isLoggedIn,
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allScheduleTime  : state.admin.allScheduleTime
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);

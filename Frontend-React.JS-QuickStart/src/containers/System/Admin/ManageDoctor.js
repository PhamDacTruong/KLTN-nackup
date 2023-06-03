import React, { Component } from "react";
import { CRUD_ACTIONS, LANGUAGES} from "../../../utils";
import { FormattedMessage } from "react-intl";
import "./TableManageUser.scss";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import "./ManageDoctor.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { getDetailInfoDoctor } from "../../../services/userService"

// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);



class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedOption: "",
      description : "",
      listDoctors : [],
      hasOldData : false,


      listPrice : [],
      listPayment : [],
      listProvince : [],
      listSpecialty : [],
      listClinic : [],
      selectedPrice : '',
      selectedPayment : '',
      selectProvince : '',
      selectedClinic : '',
      selectedSpecialty : '',
      nameClinic : '',
      addressClinic : '',
      note : '',
      clinicId : '',
      specialtyId : '',
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctor()
    this.props.getAllRequireDoctorInfor()
  }

  buildDataInputSelect = (inputData, type) => {
    let result = [];
    let {language} = this.props;
    if(inputData && inputData.length > 0){
      if(type === 'USERS'){
        inputData.map((item,index) => {
          let object = {};
          let labeVi = `${item.lastName} ${item.firstName} ` ;
          let labeEn = `${item.firstName} ${item.lastName} ` ;
  
          object.label = language === LANGUAGES.VI ? labeVi : labeEn; 
          object.value = item.id;
          result.push(object); 
        })
      }
      if(type === 'PRICE'){
        inputData.map((item, index) => {
          let object = {};
          let labeVi = `${item.valueVi}đ` ;
          let labeEn = `${item.valueEn} USD` ;
  
          object.label = language === LANGUAGES.VI ? labeVi : labeEn; 
          object.value = item.keyMap;
          result.push(object); 
        })
      }
      if(type === 'PAYMENT' || type === 'PROVINCE'){
        inputData.map((item, index) => {
          let object = {};
          let labeVi = `${item.valueVi} ` ;
          let labeEn = `${item.valueEn} ` ;
  
          object.label = language === LANGUAGES.VI ? labeVi : labeEn; 
          object.value = item.keyMap;
          result.push(object); 
        })
      }
      if(type === 'SPECIALTY'){
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object); 
        })
      }
      if(type === 'CLINIC'){
        inputData.map((item, index) => {
          let object = {};
          object.label = item.name;
          object.value = item.id;
          result.push(object); 
        })
      }
     
    }
    return result;

  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    
    if(prevProps.allDoctors !==  this.props.allDoctors){
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
      this.setState({
        listDoctors : dataSelect
      })
    }
    if(prevProps.language !== this.props.language){
      let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USERS');
      let { resPayment, resPrice, resProvince, resSpecialty} = this.props.allRequiredDoctorInfo;
      let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
      let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
      let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');

      let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
      this.setState({
        listDoctors : dataSelect,
        listPrice : dataSelectPrice,
       listPayment : dataSelectPayment,
        listProvince : dataSelectProvince,
        listSpecialty : dataSelectSpecialty
       
      })
    }

    if(prevProps.allRequiredDoctorInfo !== this.props.allRequiredDoctorInfo){
      let { resPrice, resPayment, resProvince , resSpecialty, resClinic} = this.props.allRequiredDoctorInfo
      let dataSelectPrice = this.buildDataInputSelect(resPrice, 'PRICE');
      let dataSelectPayment = this.buildDataInputSelect(resPayment, 'PAYMENT');
      let dataSelectProvince = this.buildDataInputSelect(resProvince, 'PROVINCE');
      let dataSelectSpecialty = this.buildDataInputSelect(resSpecialty, 'SPECIALTY');
      let dataSelectClinic = this.buildDataInputSelect(resClinic, 'CLINIC');
     this.setState({
      listPrice : dataSelectPrice,
      listPayment : dataSelectPayment,
      listProvince : dataSelectProvince,
      listSpecialty : dataSelectSpecialty,
      listClinic : dataSelectClinic,
  
     })
    }
  }

 

  handleEditorChange = ({ html, text }) => {
    this.setState({
        contentMarkdown: text,
        contentHTML: html,
    })

  }
  handleSaveContentMarkdown = () => {
    let { hasOldData } = this.state;
    

    this.props.saveDetailDoctor({
     
      contentHTML : this.state.contentHTML,
      contentMarkdown : this.state.contentMarkdown,
      description : this.state.description,
      doctorId  : this.state.selectedOption.value,
      action : hasOldData === true ? CRUD_ACTIONS.EDIT : CRUD_ACTIONS.CREATE,


      selectedPrice : this.state.selectedPrice.value,
      selectedPayment : this.state.selectedPayment.value,
      selectProvince : this.state.selectProvince.value,
      nameClinic : this.state.nameClinic,
      addressClinic : this.state.addressClinic,
      note : this.state.note,
      clinicId : this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
      specialtyId : this.state.selectedSpecialty.value
    })
    
  };
  handleChangeSelect = async(selectedOption) => {
    this.setState({ selectedOption });

    let {listPayment, listPrice, listProvince , listSpecialty, listClinic} = this.state;

    let res = await getDetailInfoDoctor(selectedOption.value)
    if(res &&  res.errCode === 0 && res.data && res.data.Markdown){
      let markdown = res.data.Markdown;

      let addressClinic = '',nameClinic = '', note = '',paymentId = '',priceId = '',provinceId = '',specialtyId = '',clinicId = '',
      selectedPayment = '',selectedPrice = '',selectProvince = '', selectedSpecialty = '', selectedClinic = '';
      if(res.data.Doctor_Infor){
        addressClinic = res.data.Doctor_Infor.addressClinic;
        nameClinic = res.data.Doctor_Infor.nameClinic;
        note = res.data.Doctor_Infor.note;
        paymentId = res.data.Doctor_Infor.paymentId;
        priceId = res.data.Doctor_Infor.priceId;
        provinceId = res.data.Doctor_Infor.provinceId;

        specialtyId = res.data.Doctor_Infor.specialtyId;
        clinicId = res.data.Doctor_Infor.clinicId;
         selectedPayment = listPayment.find(item =>  {
          return item && item.value === paymentId;
        })

         selectedPrice = listPrice.find(item =>  {
          return item && item.value === priceId;
        })

         selectProvince = listProvince.find(item =>  {
          return item && item.value === provinceId;
        })

        selectedSpecialty = listSpecialty.find(item =>  {
          return item && item.value === specialtyId;
        })

        selectedClinic = listClinic.find(item =>  {
          return item && item.value === clinicId;
        })
      }

   
      this.setState({
        contentHTML : markdown.contentHTML,
        contentMarkdown : markdown.contentMarkdown,
        description : markdown.description,
        hasOldData : true,
        addressClinic : addressClinic, 
        nameClinic : nameClinic,
        note : note,
        selectedPayment : selectedPayment,
        selectedPrice : selectedPrice,
        selectProvince : selectProvince,
        selectedSpecialty : selectedSpecialty,
        selectedClinic : selectedClinic

      })
    }else {
      this.setState({
        contentHTML : '',
        contentMarkdown : '',
        description : '',
        hasOldData : false,
        addressClinic : '', 
        nameClinic : '',
        note : '',

        selectedPayment : '',
        selectedPrice : '',
        selectProvince : '',
        selectedSpecialty : '',
        selectedClinic : ''
       

      })
    }
  };
  handleOnChangeText = (event, id) => {
    let stateCopy = {...this.state};
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy
    })
  }

  handleChangeSelectDoctorInfo = async(selectedOption, name) => {
    let stateName = name.name;
    let stateCopy = {...this.state};
    stateCopy[stateName] = selectedOption;
    this.setState({
      ...stateCopy
    })
    
  }
  render() {
  let {hasOldData , listSpecialty} = this.state
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title"><FormattedMessage id="admin.manage-doctor.title"/></div>
        <div className="more-info">
          <div className="content-left form-group">
            <label><FormattedMessage id="admin.manage-doctor.choose-doctor"/></label>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeSelect}
              options={this.state.listDoctors}
              placeholder={<FormattedMessage id="admin.manage-doctor.choose-doctor"/>}
              name = {"selectedOption"}
            />
          </div>
          <div className="content-right ">
            <label><FormattedMessage id="admin.manage-doctor.info"/></label>
            <textarea className="form-control"  
                onChange={ (event) => this.handleOnChangeText(event, 'description')}
                value={this.state.description}
            >
            </textarea>
          </div>
          
        </div>
        <div className="more-info-extra row">
          <div className="col-4 form-group">
              <label><FormattedMessage id="admin.manage-doctor.price"/></label>
              <Select
              value={this.state.selectedPrice}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listPrice}
              placeholder={<FormattedMessage id="admin.manage-doctor.price"/>}
              name = "selectedPrice"
            />
          </div>
          <div className="col-4 form-group">
              <label><FormattedMessage id="admin.manage-doctor.payment"/></label>
              <Select
              value={this.state.selectedPayment}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listPayment}
              placeholder={<FormattedMessage id="admin.manage-doctor.payment"/>}
              name = "selectedPayment"
            />
          </div>
          <div className="col-4 form-group">
              <label><FormattedMessage id="admin.manage-doctor.province"/></label>
              <Select
              value={this.state.selectProvince}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listProvince}
              placeholder={<FormattedMessage id="admin.manage-doctor.province"/>}
              name = "selectProvince"
            />
          </div>

          <div className="col-4 form-group">
          <label><FormattedMessage id="admin.manage-doctor.clinic"/></label>
              <input 
               className="form-control" 
               onChange={ (event) => this.handleOnChangeText(event, 'nameClinic')}
               value={this.state.nameClinic}
               />
          </div>
          <div className="col-4 form-group">
          <label><FormattedMessage id="admin.manage-doctor.address"/></label>
              <input 
               onChange={ (event) => this.handleOnChangeText(event, 'addressClinic')}
               value={this.state.addressClinic}
              className="form-control" />
          </div>
          <div className="col-4 form-group">
          <label><FormattedMessage id="admin.manage-doctor.note"/></label>
              <input 
               onChange={ (event) => this.handleOnChangeText(event, 'note')}
               value={this.state.note}
              
              className="form-control" />
          </div>

        </div>
        <div className="row">
          <div className="col-4 form-group"> 
            <label><FormattedMessage id="admin.manage-doctor.choose-specialty"/></label>
            <Select
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listSpecialty}
              placeholder={<FormattedMessage id="admin.manage-doctor.choose-specialty"/>}
              name = "selectedSpecialty"
            />
          </div>
          <div className="col-4 form-group"> 
          <label><FormattedMessage id="admin.manage-doctor.choose-clinic"/></label>
          <Select
              value={this.state.selectedClinic}
              onChange={this.handleChangeSelectDoctorInfo}
              options={this.state.listClinic}
              placeholder={<FormattedMessage id="admin.manage-doctor.choose-clinic"/>}
              name = "selectedClinic"
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.contentMarkdown}
          />
        </div>
     
        <button
          className={hasOldData === true ? "save-content-doctor" : "create-content-doctor" }
          onClick={() => this.handleSaveContentMarkdown()}

        >
          {hasOldData === true ?
            <span><FormattedMessage id="admin.manage-doctor.save-info"/></span> : <span><FormattedMessage id="admin.manage-doctor.create-info"/></span>
          }
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allDoctors: state.admin.allDoctors,
    language: state.app.language,
    allRequiredDoctorInfo : state.admin.allRequiredDoctorInfo
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    
    fetchAllDoctor: () => dispatch(actions.fetchAllDoctor()),
    getAllRequireDoctorInfor: () => dispatch(actions.getRequireDoctorInfor()),
    saveDetailDoctor : (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);

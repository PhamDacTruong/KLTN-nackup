import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import './ManageSpecialty.scss';
import { CommonUtils, CRUD_ACTIONS } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import * as actions from "../../../store/actions";
import "react-image-lightbox/style.css";
import TableSpecialty from "./TableSpecialty/TableSpecialty";
import Lightbox from "react-image-lightbox";

const mdParser = new MarkdownIt(/* Markdown-it options */);
class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name : '',
      imageBase64 : '',
      descriptionHTML :'',
      descriptionMarkdown :'',
      action : '',
      specialtyId : '',
      
    };
  }

  async componentDidMount() {

  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listSpecialty !== this.props.listSpecialty) {
      this.setState({
          action  : CRUD_ACTIONS.CREATE,
          name : '',
          imageBase64 : '',
          descriptionHTML :'',
          descriptionMarkdown :'',
          previewImgURL : '',
      });
    }
   
  }
  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };
  handleChangeInput = (event, id) => {
    let stateCopy = {...this.state}
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy
    })
  }
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    })
  }
  handleOneChangeImg = async(event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let ObjectUrl = URL.createObjectURL(file);
      this.setState({
        imageBase64: base64,
        previewImgURL: ObjectUrl,

      });
    }
  };
  handleSaveNewSpecialty =async () => {
     let { action } = this.state;
  if(action === CRUD_ACTIONS.CREATE){
    this.props.createNewSpecialtyRedux({
      name: this.state.name,
      imageBase64: this.state.imageBase64,
      descriptionMarkdown: this.state.descriptionMarkdown,
      descriptionHTML: this.state.descriptionHTML,
    });
  }
  if(action === CRUD_ACTIONS.EDIT){
    this.props.editSpecialtyRedux({
      name : this.state.name,
      imageBase64 : this.state.imageBase64,
      descriptionHTML :this.state.descriptionHTML,
      descriptionMarkdown :this.state.descriptionMarkdown,
      id : this.state.specialtyId
    })
  }
 
    
  }
  handleEditSpecialtyFromParent = (specialty) => {
    let imageBase64 = '';
    if(specialty.image){
        imageBase64 = new Buffer(specialty.image, 'base64').toString('binary');
    }
    this.setState({
      name : specialty.name,
      descriptionHTML: specialty.descriptionHTML,
      descriptionMarkdown: specialty.descriptionMarkdown,
      imageBase64: '',
      previewImgURL : specialty.image,
      action : CRUD_ACTIONS.EDIT,
      specialtyId : specialty.id
    });
  }

  render() {
 
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lí chuyên khoa</div>
        <div className="add-new-specialty row">
          <div className="col-6 form-group">
            <label>Tên chuyên khoa</label>
            <input type="text" className="form-control"  value={this.state.name}
            onChange = {(event) => this.handleChangeInput(event, 'name')} 
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh chuyên khoa</label>
            <div className="preview-image-container">
              <input
                type="file"
                id="previewImg"
                className="form-control-file"
                onChange={(event) => this.handleOneChangeImg(event)}
                hidden
              />
              <label className="label-upload" htmlFor="previewImg">
                Tải ảnh <i className="fas fa-upload"></i>
              </label>
              <div
                className="preview-image"
                style={{
                  backgroundImage: `url(${this.state.previewImgURL})`,
                }}
                onClick={() => this.openPreviewImage()}
              ></div>
            </div>
            
          </div>
          <div className="col-12">
          <MdEditor
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
            value={this.state.descriptionMarkdown}
          />
          </div>
          <div className="col-12">
              <button className={this.state.action === CRUD_ACTIONS.EDIT ? "btn-edit":"btn-save"}
              onClick={() => this.handleSaveNewSpecialty()}
              >
                {this.state.action === CRUD_ACTIONS.EDIT ? 
                
                  <FormattedMessage id="patient.specialty.edit" />
                :
                  <FormattedMessage id="patient.specialty.save" />
                }
              </button>
          </div>
    
        </div>
        <div className="col-12 mb-5">
          <TableSpecialty 
          action = {this.state.action}
          handleEditSpecialtyFromParent = {this.handleEditSpecialtyFromParent}
          />
        </div>
        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgURL}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    listSpecialty: state.admin.specialty,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSpecialtyRedux: () => dispatch(actions.fetchSpecialtyStart()),
    editSpecialtyRedux : (data) => dispatch(actions.editSpecialty(data)),
    createNewSpecialtyRedux : (data) => dispatch(actions.createNewSpecialtyRedux(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);

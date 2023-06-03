import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageClinic.scss";
import Lightbox from "react-image-lightbox";
import { LANGUAGES, CommonUtils, CRUD_ACTIONS } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { createNewClinic } from "../../../services/userService";
import { toast } from "react-toastify";
import TableClinic from "./TableClinic/TableClinic";
import * as actions from "../../../store/actions";
import "react-image-lightbox/style.css";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      imageBase64: '',
      descriptionHTML: '',
      descriptionMarkdown: '',
      previewImgURL: '',
      action : '',
      clinicEditId : '',
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listClinic !== this.props.listClinic) {
      this.setState({
        name: '',
        descriptionHTML: '',
        descriptionMarkdown: '',
        address: '',
        imageBase64 : '',
        action : CRUD_ACTIONS.CREATE,
        previewImgURL : '',
      });
    }
  }
  handleChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };
  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };
  handleOneChangeImg = async (event) => {
    let data = event.target.files;
    let file = data[0];

    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let ObjectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgURL: ObjectUrl,
        imageBase64: base64,
      });
    }
  };
  openPreviewImage = () => {
    if (!this.state.previewImgURL) return;
    this.setState({
      isOpen: true,
    });
  };
  handleSaveNewClinic = async () => {
    let { action } = this.state;
    if(action === CRUD_ACTIONS.CREATE){
      this.props.createNewClinicRedux({
        name: this.state.name,
        address: this.state.address,
        imageBase64: this.state.imageBase64,
        descriptionMarkdown: this.state.descriptionMarkdown,
        descriptionHTML: this.state.descriptionHTML,
      });
    }
    if(action === CRUD_ACTIONS.EDIT){
      this.props.editClinicRedux({
        id : this.state.clinicEditId,
        name : this.state.name,
        address : this.state.address,
        descriptionHTML  :this.state.descriptionHTML,
        descriptionMarkdown : this.state.descriptionMarkdown,
        imageBase64: this.state.imageBase64,
      });
    }
   
   
  };
  handleEditClinicFromParent = (clinic) => {
    let imageBase64 = '';
    if (clinic.image) {
      imageBase64 = Buffer.from(clinic.image, 'base64').toString('binary');
    }
    this.setState({
      name: clinic.name,
      descriptionHTML: clinic.descriptionHTML,
      descriptionMarkdown: clinic.descriptionMarkdown,
      address: clinic.address,
      imageBase64: '',
      previewImgURL: clinic.image,
      action: CRUD_ACTIONS.EDIT,
      clinicEditId: clinic.id
    });
  }

  render() {
    return (
      <div className="manage-clinic-container">
        <div className="ms-title">Quản lí phòng khám</div>
        <div className="add-new-clinic row">
          <div className="col-5 form-group">
            <label>Tên phòng khám</label>
            <input
              type="text"
              className="form-control"
              value={this.state.name}
              onChange={(event) => this.handleChangeInput(event, "name")}
            />
          </div>
          
          <div className="col-5 form-group">
            <label>Địa chỉ phòng khám</label>
            <input
              type="text"
              className="form-control"
              value={this.state.address}
              onChange={(event) => this.handleChangeInput(event, "address")}
            />
          </div>
          <div className="col-6 form-group">
            <label>Ảnh phòng khám</label>
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
            <button
              className={this.state.action === CRUD_ACTIONS.EDIT ? "btn-edit":"btn-save"}
              onClick={() => this.handleSaveNewClinic()}
            >
               {this.state.action === CRUD_ACTIONS.EDIT ? 
                
                <FormattedMessage id="patient.clinic.edit" />
              :
                <FormattedMessage id="patient.clinic.save" />
              }
            </button>
          </div>
        </div>
        <div className="col-12 mb-5">
          <TableClinic 
          handleEditClinicFromParent = {this.handleEditClinicFromParent}
          action = {this.state.action}
          
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
    listClinic: state.admin.clinic,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchClinicRedux: () => dispatch(actions.fetchClinicStart()),
    createNewClinicRedux: (data) => dispatch(actions.createNewClinicRedux(data)),
    editClinicRedux: (data) => dispatch(actions.editClinic(data)),

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);

import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManagePatien.scss";
import _ from "lodash";
import DatePicker from "../../../components/Input/DatePicker";
import {
  getAllPatientForDoctor,
  postSendRemedy,
} from "../../../services/userService";
import moment from "moment";
import { LANGUAGES } from "../../../utils";
import RemedyModal from "./RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: moment(new Date()).startOf("day").valueOf(),
      dataPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
      selectedPatient: null,
    };
  }

  async componentDidMount() {
    this.getDataPatient();
  }

  getDataPatient = async () => {
    let { user } = this.props;
    let { currentDate } = this.state;
    let formatedDate = new Date(currentDate).getTime();
    let res = await getAllPatientForDoctor({
      doctorId: user.id,
      date: formatedDate,
    });
    if (res && res.errCode === 0) {
      this.setState({
        dataPatient: res.data,
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeDate = (date) => {
    this.setState(
      {
        currentDate: date[0],
      },
      async () => {
        await this.getDataPatient();
      }
    );
  };

  handleBtnConfirm = (item) => {
    let data = {
      time: item.timeTypeDataPatient.valueVi,
      doctorId: item.doctorId,
      patientId: item.patientId,
      email: item.patientData.email,
      timeType: item.timeType,
      patientName: item.patientData.firstName,
      date: item.date,
      address: item.doctorInfo1.addressClinic,
      fullName: `${item.patientData1.firstName} ${item.patientData1.lastName}`,
    };
    this.setState({
      isOpenRemedyModal: true,
      dataModal: data,
    });
  };

  handleBtnInfo = (item) => {
    this.setState({
      selectedPatient: item,
    });
  };

  closeRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (dataChild) => {
    let { dataModal } = this.state;
    this.setState({
      isShowLoading: true,
    });
    let res = await postSendRemedy({
      email: dataChild.email,
      imgBase64: dataChild.imgBase64,
      doctorId: dataModal.doctorId,
      patientId: dataModal.patientId,
      timeType: dataModal.timeType,
      language: this.props.language,
      patientName: dataModal.patientName,
      date: dataModal.date,
      address: dataModal.address,
      fullName: dataModal.fullName,
      time: dataModal.time,
    });
    if (res && res.errCode === 0) {
      this.setState({
        isShowLoading: false,
      });
      toast.success("Send Remedy Success");
      this.closeRemedyModal();
      await this.getDataPatient();
    } else {
      this.setState({
        isShowLoading: false,
      });
      toast.error("Something went wrong");
      console.log(res);
    }
  };

  render() {
    let { dataPatient, isOpenRemedyModal, dataModal, selectedPatient } =
      this.state;
    let { language } = this.props;
    return (
      <>
        <LoadingOverlay
          active={this.state.isShowLoading}
          spinner
          text="Loading...."
        >
          <div className="manage-patient-container">
            <div className="m-s-title">Quản lí bệnh nhân khám bệnh</div>
            <div className="manage-patient-body row">
              <div className="col-4 form-group">
                <label>Chọn ngày khám</label>
                <DatePicker
                  onChange={this.handleOnChangeDate}
                  className="form-control"
                  value={this.state.currentDate}
                />
              </div>
              <div className="col-12">
                <table
                  style={{ width: "100%" }}
                  className="table-manage-patient"
                >
                  <tbody>
                    <tr>
                      <th>STT</th>
                      <th>Thời gian</th>
                      <th>Họ và tên</th>
                      <th>Địa chỉ</th>
                      <th>Giới tính</th>
                      <th>Actions</th>
                    </tr>
                    {dataPatient && dataPatient.length > 0 ? (
                      dataPatient.map((item, index) => {
                        let time =
                          language === LANGUAGES.VI
                            ? item.timeTypeDataPatient &&
                              item.timeTypeDataPatient.valueVi
                            : item.timeTypeDataPatient &&
                              item.timeTypeDataPatient.valueEn;
                        let gender =
                          language === LANGUAGES.VI
                            ? item.patientData &&
                              item.patientData.genderData &&
                              item.patientData.genderData.valueVi
                            : item.patientData &&
                              item.patientData.genderData &&
                              item.patientData.genderData.valueEn;
                        let firstName =
                          item.patientData && item.patientData.firstName;
                        let address =
                          item.patientData && item.patientData.address;
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time}</td>
                            <td>{firstName}</td>
                            <td>{address}</td>
                            <td>{gender}</td>
                            <td>
                              <button
                                className="btn-confirm"
                                onClick={() => this.handleBtnConfirm(item)}
                              >
                                Xác nhận
                              </button>
                              <button
                                className="btn-info"
                                onClick={() => this.handleBtnInfo(item)}
                              >
                                Chi tiết
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          {" "}
                          Hiện tại ngày này chưa có lịch khám
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


          {selectedPatient && (
            <div className="modal-overlay">
              <div className="modal-container">
                <div className="modal-header">
                  <h3>Thông tin chi tiết</h3>
                  <button
                    className="close-modal-btn"
                    onClick={() => this.setState({ selectedPatient: null })}
                  >
                    &times;
                  </button>
                </div>
                <div className="modal-body">
                  <div className="modal-info">
                    <div className="modal-info-label">Thời gian </div>
                    <div className="modal-info-value">
                      {language === LANGUAGES.VI
                        ? selectedPatient.timeTypeDataPatient &&
                          selectedPatient.timeTypeDataPatient.valueVi
                        : selectedPatient.timeTypeDataPatient &&
                          selectedPatient.timeTypeDataPatient.valueEn}
                    </div>
                  </div>
                  <div className="modal-info">
                    <div className="modal-info-label">Họ và tên </div>
                    <div className="modal-info-value">
                      {selectedPatient.patientData &&
                        selectedPatient.patientData.firstName}
                    </div>
                  </div>
                  <div className="modal-info">
                    <div className="modal-info-label">Địa chỉ liên hệ </div>
                    <div className="modal-info-value">
                      {selectedPatient.patientData &&
                        selectedPatient.patientData.address}
                    </div>
                  </div>
                  <div className="modal-info">
                    <div className="modal-info-label">Giới tính </div>
                    <div className="modal-info-value">
                      {language === LANGUAGES.VI
                        ? selectedPatient.patientData &&
                          selectedPatient.patientData.genderData &&
                          selectedPatient.patientData.genderData.valueVi
                        : selectedPatient.patientData &&
                          selectedPatient.patientData.genderData &&
                          selectedPatient.patientData.genderData.valueEn}
                    </div>
                  </div>
                  <div className="modal-info">
                    <div className="modal-info-label">Địa chỉ khám </div>
                    <div className="modal-info-value">
                      {selectedPatient.doctorInfo1 &&
                        selectedPatient.doctorInfo1.addressClinic}
                    </div>
                  </div>
                  <div className="modal-info">
                    <div className="modal-info-label">Số điện thoại </div>
                    <div className="modal-info-value">
                      {selectedPatient.patientData &&
                        selectedPatient.patientData.phoneNumber}
                    </div>
                  </div>
                  <div className="modal-info">
                    <div className="modal-info-label">Lý do khám bệnh </div>
                    <div className="modal-info-value">
                      {selectedPatient.patientData &&
                        selectedPatient.patientData.lastName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <RemedyModal
            isOpenModal={isOpenRemedyModal}
            dataModal={dataModal}
            closeRemedyModal={this.closeRemedyModal}
            sendRemedy={this.sendRemedy}
          />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);

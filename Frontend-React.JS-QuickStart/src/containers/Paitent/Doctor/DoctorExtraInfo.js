import React, { Component } from "react";
import { connect } from "react-redux";
import moment from "moment";
import "./DoctorExtraInfo.scss";
import { getExtraInforDoctorBy } from "../../../services/userService";
import { LANGUAGES } from "../../../utils";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";
class DoctorExtraInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfo: false,
      exTraInfor: {},
    };
  }

  async componentDidMount() {
    if(this.props.doctorParent){
      let res = await getExtraInforDoctorBy(this.props.doctorParent);
      if (res && res.errCode === 0) {
        this.setState({
          exTraInfor: res.data,
        });
      }
    }
   
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
    if (this.props.doctorParent !== prevProps.doctorParent) {
      let res = await getExtraInforDoctorBy(this.props.doctorParent);
      if (res && res.errCode === 0) {
        this.setState({
          exTraInfor: res.data,
        });
      }
    }
  }
  showHideDetailInfo = (status) => {
    this.setState({
      isShowDetailInfo: status,
    });
  };
  render() {
    let { isShowDetailInfo, exTraInfor } = this.state;
    let { language } = this.props;
    return (
      <div className="doctor-extra-container">
        <div className="content-up">
          <div className="text-address"><FormattedMessage id = "patient.extra-infor-doctor.address-patient"/></div>
          <div className="name-clinic">
            {exTraInfor && exTraInfor.nameClinic ? exTraInfor.nameClinic : ""}
          </div>
          <div className="detail-address">
            {exTraInfor && exTraInfor.addressClinic
              ? exTraInfor.addressClinic
              : ""}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailInfo === false && (
            <div className="short-info">
              <FormattedMessage id = "patient.extra-infor-doctor.price-patient"/>
              {exTraInfor &&
                exTraInfor.priceTypeData &&
                language === LANGUAGES.VI && (
                 
                    <NumberFormat
                    className="currency"
                      value={exTraInfor.priceTypeData.valueVi}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={"VNĐ"}
                    />
                 
                )}
              {exTraInfor &&
                exTraInfor.priceTypeData &&
                language === LANGUAGES.EN && (
                  <NumberFormat
                  className="currency"
                    value={exTraInfor.priceTypeData.valueEn}
                    displayType={"text"}
                    thousandSeparator={true}
                    suffix={"$"}
                  />
                )}
              <span className="detail" onClick={() => this.showHideDetailInfo(true)}>
              <FormattedMessage id = "patient.extra-infor-doctor.details"/>
              </span>
            </div>
          )}
          {isShowDetailInfo === true && (
            <>
              <div className="title-price"><FormattedMessage id = "patient.extra-infor-doctor.price-patient"/></div>
              <div className="detail-info">
                <div className="price">
                  <span className="left"><FormattedMessage id = "patient.extra-infor-doctor.price-patient1"/></span>
                  <span className="right">
                    {exTraInfor &&
                      exTraInfor.priceTypeData &&
                      language === LANGUAGES.VI && (
                        <NumberFormat
                          value={exTraInfor.priceTypeData.valueVi}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"VNĐ"}
                        />
                      )}
                    {exTraInfor &&
                      exTraInfor.priceTypeData &&
                      language === LANGUAGES.EN && (
                        <NumberFormat
                          value={exTraInfor.priceTypeData.valueEn}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"$"}
                        />
                      )}
                  </span>
                </div>
                <div className="note">
                {exTraInfor && exTraInfor.note ? exTraInfor.note : ""}
                </div>
              </div>

              <div className="payment">
              <FormattedMessage id = "patient.extra-infor-doctor.payment"/>
                {exTraInfor && exTraInfor.paymentTypeData && language === LANGUAGES.VI ? 
                 exTraInfor.paymentTypeData.valueVi : ""}
                     {exTraInfor && exTraInfor.paymentTypeData && language === LANGUAGES.EN ? 
                 exTraInfor.paymentTypeData.valueEn : ""}
              </div>
              <div className="hide-price">
                <span onClick={() => this.showHideDetailInfo(false)}>
                <FormattedMessage id = "patient.extra-infor-doctor.hide"/>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfo);

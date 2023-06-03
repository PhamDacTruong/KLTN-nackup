import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";



class About extends Component {
  render() {
    
    return (
      <div className="section-share section-about">
            <div className="section-about-header">
                Truyền thông nói gì về chúng tôi
            </div>
            <div className="section-about-content">
                <div className="content-left">
                 <iframe width="100%" height="400px" 
                    src="https://www.youtube.com/embed/ms6GT1MGs8o" 
                    title="HƯỚNG DẪN ĐẶT LỊCH KHÁM TRỰC TUYẾN VỚI BÁC SĨ TRÊN ỨNG DỤNG BÁC SĨ ƠI - IVIE" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                     allowFullScreen>

                 </iframe>
                </div>
                <div className="content-right">
                    <p>Medpro là giải pháp đặt lịch khám bệnh, chăm sóc sức khỏe trực tuyến cho cả gia đình. Người dùng chủ động trong việc khám chữa bệnh, được lựa chọn dịch vụ, chuyên khoa, bác sĩ tại các bệnh viện và phòng khám hàng đầu Việt Nam như Bệnh viện Đại học Y Dược TP.HCM, Bệnh viện Chợ Rẫy, Bệnh viện Nhi Đồng Thành Phố.</p>
                </div>
            </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(About);

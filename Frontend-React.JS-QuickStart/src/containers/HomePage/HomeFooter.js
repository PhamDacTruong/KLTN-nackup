import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";



class HomeFooter extends Component {
  render() {
    
    return (
      <div className="home-footer">
        <p>&copy; 2023 Chào Mừng Bạn Đến Với Chúng Tôi. <a href="#">More Infomation</a></p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);

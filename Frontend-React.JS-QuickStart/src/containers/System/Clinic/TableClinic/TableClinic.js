import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import "./TableClinic.scss";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";

class TableClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ClinicRedux : []
    };
  }

  componentDidMount() {
    this.props.fetchClinicRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listClinic !== this.props.listClinic) {
        this.setState({
            ClinicRedux : this.props.listClinic
        })
    }
  }
  handleDeleteClinic = (clinic) => {
    this.props.deleteClinicRedux(clinic.id)
  }
  handleEditClinic = (clinic) => {
    this.props.handleEditClinicFromParent(clinic)
  }
  render() {
    let arrClinic = this.state.ClinicRedux
    return (
      <React.Fragment>
        <table id="TableClinic">
          <tbody>
            <tr>
              <th>Tên phòng khám</th>
              <th>Actions</th>
            </tr>
            { arrClinic && arrClinic.length > 0 && 
            arrClinic.map((item,index)=>{
                return(
                    <tr key = {index}>
                    <td>{item.name}</td>
                    <td>
                      <button className="btn-edit" onClick={() => this.handleEditClinic(item)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-delete" onClick={() => this.handleDeleteClinic(item)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                )
            })}
          
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listClinic : state.admin.clinic
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchClinicRedux : () => dispatch(actions.fetchClinicStart()),
    deleteClinicRedux : (id) => dispatch(actions.deleteClinic(id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableClinic);

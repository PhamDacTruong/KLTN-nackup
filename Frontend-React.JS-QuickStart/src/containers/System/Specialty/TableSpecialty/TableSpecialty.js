import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import "./TableSpecialty.scss";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";

// import style manually
import "react-markdown-editor-lite/lib/index.css";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

class TableSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SpecialtyRedux: [],
    };
  }

  componentDidMount() {
    this.props.fetchSpecialtyRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listSpecialty !== this.props.listSpecialty) {
      this.setState({
        SpecialtyRedux: this.props.listSpecialty,
      });
    }
  }
  handleDeleteSpecialty = async (specialty) => {
   this.props.deleteSpecialtyRedux(specialty.id);
  }
  handleEditSpecialty =  (specialty) => {
    this.props.handleEditSpecialtyFromParent(specialty)
   }
  render() {
    let arrSpecialty = this.state.SpecialtyRedux;
    return (
      <React.Fragment>
        <table id="TableSpecialty">
          <tbody>
            <tr>
              <th>Email</th>
              <th>Actions</th>
            </tr>
            {arrSpecialty &&
              arrSpecialty.length > 0 &&
              arrSpecialty.map((item, index) => {
                return (
                  <tr key = {index}>
                    <td>{item.name}</td>
                    <td>
                    <button className="btn-edit" onClick = {() => this.handleEditSpecialty(item)}><i className="fas fa-edit"></i></button>
                      <button className="btn-delete">
                        
                        <i className="fas fa-trash-alt" onClick={() => this.handleDeleteSpecialty(item)}></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listSpecialty: state.admin.specialty,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSpecialtyRedux: () => dispatch(actions.fetchSpecialtyStart()),
    deleteSpecialtyRedux: (id) => dispatch(actions.deleteSpecialty(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableSpecialty);

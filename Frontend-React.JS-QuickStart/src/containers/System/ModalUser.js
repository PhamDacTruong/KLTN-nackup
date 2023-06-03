import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";
import { emitter } from "../../utils/emitter";
class ModalUser extends Component {
  constructor(props){
    super(props);
    this.state = {
        email : '',
        password : '',
        firstName : '',
        lastName : '',
        address : '',

    }
    this.listenToEmitter();
  }
  listenToEmitter(){
    emitter.on('EVENT_CLEAR_MODAL_DATA',() =>{
      this.setState({
        email : '',
        password : '',
        firstName : '',
        lastName : '',
        address : '',

      })
    })
  }
  componentDidMount() {}
  toggle = () =>{
    this.props.toggleFromParent();
  }
  handleOnChangeIput = (event, id) =>{
    let copyState = {...this.state};
    copyState[id] = event.target.value;
    this.setState({
        ...copyState
    })
  }
  checkValideInput = () => {
    let isValid = true;
    let arrInput = ['email', 'password', 'firstName', 'lastName', 'address'];
    for(let i = 0; i < arrInput.length; i++){
        if(!this.state[arrInput[i]]){
            isValid = false;
            alert('Missing required field' + arrInput[i])
            break;

        }
    }
    return isValid;
  }
  handleAddNewUser = () => {
    let isValid = this.checkValideInput();
    if(isValid === true){
        this.props.createNewUser(this.state,'abc');
    }
   
  }
 
  render() {

    return (
      <Modal 
            isOpen={this.props.isOpen} 
            toggle={() => {this.toggle()}}
            size = "lg"
            className={'Modal-container'}
         
            >
        <ModalHeader toggle={() => {this.toggle()}}>Create New User</ModalHeader>
        <ModalBody>
            <div className="modal-user-body" >
                    <div className="input-container">
                        <label>Email</label>
                        <input type="text" onChange={(event) => {this.handleOnChangeIput(event, "email")}} value = {this.state.email}/>
                    </div>
                    <div className="input-container">
                        <label>Password</label>
                        <input type="password" onChange={(event) => {this.handleOnChangeIput(event, "password")}} value = {this.state.password}/>
                    </div>
                    <div className="input-container">
                        <label>First Name</label>
                        <input type="text" onChange={(event) => {this.handleOnChangeIput(event, "firstName")}} value = {this.state.firstName}/>
                    </div>
                    <div className="input-container">
                        <label>Last Name</label>
                        <input type="text" onChange={(event) => {this.handleOnChangeIput(event, "lastName")}} value = {this.state.lastName}/>
                    </div>
                    <div className="input-container max-width-input">
                        <label>Address</label>
                        <input type="text" onChange={(event) => {this.handleOnChangeIput(event, "address")}} value = {this.state.address}/>
                    </div>
                    
            </div>
                    
        </ModalBody>
        <ModalFooter>
          <Button color="primary" className="px-3" onClick={() => {this.handleAddNewUser()}}>
            Add
          </Button>{" "}
          <Button color="secondary" className="px-3" onClick={() => {this.toggle()}}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);

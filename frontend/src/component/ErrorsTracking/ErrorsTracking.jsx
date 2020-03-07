import React from 'react';
import {connect} from 'react-redux';
import {Message, List, Button, Icon, Segment, Header, Modal} from 'semantic-ui-react';
import * as Actions from "../../actions/errors.actions";

class ErrorsTracking extends React.Component {
  onClose = () => {
    this.props.clearErrors();
  };
  render() {
    const {errors} = this.props;
    const errorsElements = errors.map((error, index) => <List.Item key={index}>{error.message}</List.Item>);
    const isErrorsExist = errors.length > 0;
    return (
      <Modal
        open={isErrorsExist}
        onClose={this.onClose}
        dimmer='inverted'
        size='small'
        closeIcon
      >
        <Header icon='error' content='Что-то пошло не так' />
        <Modal.Content>
            <List bulleted>
              {errorsElements}
            </List>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.onClose} inverted>
            <Icon name='checkmark' /> Ok
          </Button>
        </Modal.Actions>
      </Modal>
    );
  };
}

const mapErrorsStateToProps = state => ({
  errors: state.errors
});
const mapDispatchSearchPromoToProps = dispatch => ({
  clearErrors: () => dispatch({type: Actions.CLEAR_ERROR})
});

export default connect(mapErrorsStateToProps, mapDispatchSearchPromoToProps)(ErrorsTracking);
import React from 'react';
import {connect} from 'react-redux';
import {Message, List, Button, Icon} from 'semantic-ui-react';
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
          <div className='errors'>
            {isErrorsExist &&
              <Message attached='top' negative>
                <Icon size='large' name='close' onClick={this.onClose}/>
                <Message.Header>Ошибка</Message.Header>
                <List bulleted>
                  {errorsElements}
                </List>
              </Message>
            }
          </div>
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
import React from 'react';
import { Menu, Image, Icon, Input } from 'semantic-ui-react';
import {authHeader} from "../../helpers/auth-header";
import { connect } from 'react-redux';
import * as Constants from "../../constants";
import {addByUrl} from "../../actionCreators/goods.actionCreators";

class AddGoodField extends React.Component {
    state = {
        value: '',
        isLoading: false
    };
    
    handleChange = (e, { name, value }) => {
        this.setState({ value });
    };
    addUrl = async () => {
        const {value} = this.state;
        this.setState({isLoading: true});
        this.props.addByUrl(value)
            .then(() => this.setState({
                value: '',
                isLoading: false
            }));
    };
    render() {
        const { value, isLoading } = this.state;
    
        return (
            <Input
                loading={isLoading}
                value={value}
                name='value'
                icon={<Icon name='add' link onClick={this.addUrl}/>}
                placeholder='Товар или ссылку для отслеживания...'
                onChange={this.handleChange}/>
        )
    }
}
export default connect(({user}) => ({user}), dispatch => ({addByUrl: url => dispatch(addByUrl(url))}))(AddGoodField);


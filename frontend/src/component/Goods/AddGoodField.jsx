import React from 'react';
import { Menu, Image, Icon, Input } from 'semantic-ui-react';
import {authHeader} from "../../helpers/auth-header";
import { connect } from 'react-redux';
import * as Constants from "../../constants";
import {addByUrl} from "../../actionCreators/goods.actionCreators";

class AddGoodField extends React.Component {
    state = {
        value: 'https://www.avito.ru/ryazan/telefony/iphone_xs_space_gray_novyy_1264324596',
        isLoading: false
    };
    
    handleChange = (e, { name, value }) => {
        this.setState({ value });
    };
    addByUrl = async () => {
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
            <Input fluid
                loading={isLoading}
                value={value}
                name='value'
                icon={<Icon name='add' link onClick={this.addByUrl}/>}
                placeholder='Вставьте url для отслеживания...'
                onChange={this.handleChange}/>
        )
    }
}
export default connect(({user}) => ({user}), dispatch => ({addByUrl: url => dispatch(addByUrl(url))}))(AddGoodField);


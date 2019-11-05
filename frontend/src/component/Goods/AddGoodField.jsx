import React from 'react';
import { Menu, Image, Icon, Input } from 'semantic-ui-react';
import {authHeader} from "../../helpers/auth-header";
import { connect } from 'react-redux';
import * as Constants from "../../constants";
import {addByUrl} from "../../actionCreators/goods.actionCreators";
import { userGoods } from '../../actionCreators/goods.actionCreators';

class AddGoodField extends React.Component {
    state = {
        value: '',
        isLoading: false
    };
    searchTimeout = null;
    
    isUrl = (text) => {
        const match = text.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#//=]*)/g);
        return match && !!match[0];
    };
    handleChange = (e, { name, value }) => {
        this.setState({ value });
        
        if (this.isUrl(value))
            return;
        
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.props.userGoods({title: value});
        },1500);
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
    // onFocus = () => {
    //     document.querySelectorAll('.headerMenu > :not(.addGoodItem)').forEach(el => {
    //         el.classList.add("forceHidden");
    //     });
    // };
    // onBlur = () => {
    //     setTimeout(() => {
    //         document.querySelectorAll('.headerMenu > :not(.addGoodItem)').forEach(el => {
    //             el.classList.remove("forceHidden");
    //         });
    //     }, 1000);
    // };
    render() {
        const { value, isLoading } = this.state;
    
        return (
            <Input fluid
                loading={isLoading}
                value={value}
                name='value'
                icon={<Icon name='add' link onClick={this.addByUrl}/>}
                placeholder='Назавание для поиска или url для отслеживания...'
                onChange={this.handleChange}
            />
        )
    }
}
export default connect(({user}) => ({user}),
        dispatch => ({
            addByUrl: url => dispatch(addByUrl(url)),
            userGoods: ({title}) => dispatch(userGoods({title}))
        })
)(AddGoodField);


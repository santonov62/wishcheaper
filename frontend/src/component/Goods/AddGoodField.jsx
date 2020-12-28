import React from 'react';
import { Menu, Image, Icon, Input } from 'semantic-ui-react';
import {authHeader} from "../../helpers/auth-header";
import { connect } from 'react-redux';
import * as Constants from "../../constants";
import {addByUrl} from "../../actionCreators/goods.actionCreators";
import { userGoods } from '../../actionCreators/goods.actionCreators';
import { setSearchTitle } from '../../actionCreators/goodsSearch.actionCreators';

class AddGoodField extends React.Component {
    state = {
        value: '',
        isLoading: false,
        currentUrl: ''
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
            // this.props.userGoods({title: value});
            this.props.setSearchTitle(value);
            this.props.userGoods();
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
    componentDidMount() {
        window.addEventListener('focus', async () => {
            try {
                const {currentUrl} = this.state;
                const text = await navigator.clipboard.readText();
                const isNewUrl = !!text && this.isUrl(text) && currentUrl !== text;
                if (isNewUrl) {
                    this.setState({
                        currentUrl: text,
                        value: text
                    });
                    console.log('window.focus => url pasted.')
                }
            } catch(e) {
                console.warn('Something went wrong', e.message);
            }
        });
    }
    render() {
        const { value, isLoading } = this.state;
    
        return (
            <Input fluid
                loading={isLoading}
                value={value}
                name='value'
                icon={<Icon name='add' link inverted circular onClick={this.addByUrl} style={{
                    marginTop: 4
                }}/>}
                //    action={{
                //      color: 'teal',
                //      labelPosition: 'right',
                //      icon: 'copy',
                //      // content: 'Copy',
                //    }}
                placeholder='Ссылка на товар или название для поиска'
                onChange={this.handleChange}
            />
        )
    }
}
export default connect(({user}) => ({user}),
        dispatch => ({
            addByUrl: url => dispatch(addByUrl(url)),
            userGoods: () => dispatch(userGoods()),
            setSearchTitle: (title) => dispatch(setSearchTitle(title))
        })
)(AddGoodField);


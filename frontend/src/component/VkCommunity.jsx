import React, { Fragment } from 'react';
import { connect } from 'react-redux';

class VkCommunity extends React.Component {
  state = {
    isWidgetInited: false
  }
  render() {
    const { isApiInited } = this.props;
    const communityId = process.env.REACT_APP_VK_COMMUNITY_ID;
    if (isApiInited && !this.state.isWidgetInited) {
      window.VK.Widgets.CommunityMessages("vk_community_messages", communityId, {expanded: "0", disableButtonTooltip: "1"});
      this.setState({isWidgetInited: true});
    }
    return (
        <Fragment>
          <div id="vk_community_messages" />
        </Fragment>
    );
  }
}

const mapState = (state) => ({
  isApiInited: state.vk.isApiInited
});

export default connect(mapState)(VkCommunity);

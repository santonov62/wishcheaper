import React, { Fragment } from 'react';
import { connect } from 'react-redux';

class VkCommunity extends React.Component {
  state = {
    isWidgetInited: false
  }
  initWidget = () => {
    const { isApiInited } = this.props;
    if (isApiInited && !this.state.isWidgetInited) {
      const communityId = import.meta.env.VITE_VK_COMMUNITY_ID;
      if (window.VK && window.VK.Widgets && window.VK.Widgets.CommunityMessages) {
        window.VK.Widgets.CommunityMessages("vk_community_messages", communityId, {expanded: "0", disableButtonTooltip: "1"});
        this.setState({isWidgetInited: true});
      }
    }
  };

  componentDidMount() {
    this.initWidget();
  }

  componentDidUpdate(prevProps) {
    this.initWidget();
  }

  render() {
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

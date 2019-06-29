import React from 'react';
import { Image } from 'semantic-ui-react';

const UserPic = ({ pic }) =>
  <Image
    size='mini'
    circular
    src={pic}
  />;

export default UserPic;

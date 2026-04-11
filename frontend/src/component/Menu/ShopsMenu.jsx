import React, { useState, useEffect, useRef } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useDispatch, useSelector } from 'react-redux';
import { userGoods } from "../../actionCreators/goods.actionCreators";
import * as Constants from "../../constants";
import { authHeader } from "../../helpers/auth-header";
import { setSearchShopId } from "../../actionCreators/goodsSearch.actionCreators";

const ShopsMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const shopId = useSelector(state => state.goodsSearch.shopId);

  const [options, setOptions] = useState([]);
  const [value, setValue] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    const fetchShops = async () => {
      try {
        const shops = await fetch(`shops/myShops`, {
          method: 'GET',
          headers: {
            ...Constants.REQUEST_JSON_HEADERS,
            ...authHeader(user)
          },
          signal: abortControllerRef.current.signal
        }).then(res => res.json());

        const formattedOptions = shops.map(({ id, title, count }, index) => ({
          key: index,
          text: `${title} (${count})`,
          value: id
        }));
        setOptions(formattedOptions);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      }
    };

    fetchShops();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user]);

  const handleChange = (e, { value: selectedValue }) => {
    setValue(selectedValue);
    dispatch(setSearchShopId(selectedValue));
    dispatch(userGoods());
  };

  return (
    <Dropdown
      placeholder='Магазин'
      icon='shop'
      floating
      labeled
      button
      className='icon'
      options={options}
      value={value || shopId}
      onChange={handleChange}
    />
  );
};

export default ShopsMenu;
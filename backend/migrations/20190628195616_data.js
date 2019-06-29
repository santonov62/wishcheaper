exports.up = async function(knex, Promise) {

  const shops = await knex('shops')
    .returning(['id', 'url', 'title'])
    .insert([{
      title: 'Pandao',
      name: 'pandao.ru',
      url: 'https://www.pandao.ru/'
    }]);

  const goods = await knex('goods')
    .returning(['id', 'price'])
    .insert([{
      url: 'https://pandao.ru/product/3cee32b8-ea1c-4d6c-bbc1-d8ede58f171e?d=540a258e-000e-43eb-9ee5-f80b188b82a5',
      title: 'Apple iPhone XS 64/256 Гб, смартфон',
      logo: 'https://go3.imgsmail.ru/imgpreview?key=63947cc5f33d0f3f&mb=storage&w=540',
      shop_id: shops.find(e => e.title === 'Pandao').id,
      price: '76127',
    }]);

  const users = await knex('users')
    .returning(['id', 'name'])
    .insert([{
      name: 'SergeiA',
      email: 'flex62ryz@ya.ru',
    }]);

  const subscriptions = await knex('subscriptions')
    .insert([{
      user_id: users.find(user => user.name === 'SergeiA').id,
      good_id: goods.find(good => good.price === 76127).id,
    }]);

  return Promise.all([shops, goods, users, subscriptions]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex('subscriptions').del(),
    knex('goods').del(),
    knex('shops').del(),
    knex('users').del()
  ]);
};
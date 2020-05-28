import React, {useState} from 'react';
import {Comment} from '../presentation';
import {FlatList} from 'react-native';

export default function CommentFeed() {
  const [people, setPeople] = useState([
    {name: 'Gary', cap: 'This would be the caption', key: '1'},
    {name: 'Alex', cap: 'I love Masks!!', key: '2'},
    {name: 'Kay', cap: 'Sick Mask', key: '3'},
    {
      name: 'Liah',
      cap:
        'This is a longer caption This is a longer caption This is a longer caption This is a longer caption This is a longer caption',
      key: '4',
    },
  ]);
  return (
    <FlatList
      data={people}
      renderItem={({item}) => <Comment name={item.name} caption={item.cap} />}
    />
  );
}

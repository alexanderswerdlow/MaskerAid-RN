import React, {useState, useContext, useEffect} from 'react';
import {FlatList, StyleSheet, SafeAreaView} from 'react-native';
import Todo from './Todo';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AuthProvider';
import {
  Appbar,
  TextInput,
  Button,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';

function Todos({navigation}) {
  const {user} = useContext(AuthContext);
  const [todo, setTodo] = useState('');
  const [loading, setLoading] = useState(true);
  const [todos, setTodos] = useState([]);
  const ref = firestore().collection('todos');

  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
  }

  useEffect(() => {
    return ref.onSnapshot((querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        const {title, complete} = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });

      setTodos(list);

      if (loading) {
        setLoading(false);
      }
    });
  }, [loading, ref]);

  if (loading) {
    return (
      <>
        <ActivityIndicator animating={true} color={Colors.red800} />
      </>
    );
  }

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Appbar>
          <Appbar.Content title={'TODO List'} />
        </Appbar>
        <FlatList
          style={{flex: 1}}
          data={todos}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => <Todo {...item} />}
        />
        <TextInput label={'New Todo'} value={todo} onChangeText={setTodo} />
        <Button onPress={() => addTodo()}>Add TODO</Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Todos;

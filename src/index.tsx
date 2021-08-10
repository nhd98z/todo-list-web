import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import styled from 'styled-components';

import './base.scss';
import { Todo } from './types';
import asset_spinner from './spinner.svg';

const url = process.env.REACT_APP_BASE_URL;

const Wrapper = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
    'Helvetica Neue', sans-serif;
  width: 100vw;
  min-height: 100vh;
  padding-top: 60px;
  background-color: #f5f6ee;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InputWrapper = styled.div`
  width: 276px;
  height: 45px;
  position: relative;
`;

const Input = styled.input`
  border: none;
  border-bottom: 2px solid #000000;
  width: 100%;
  height: 100%;
  background-color: #f5f6ee;
  text-align: center;
  font-size: 14px;

  &::placeholder {
    color: #c4c4c4;
  }

  &:hover::placeholder {
    color: #979797;
  }

  &:focus {
    outline: none;
    &::placeholder {
      color: #979797;
    }
  }
`;

const TodoList = styled.div`
  width: 276px;
  margin-top: 44px;
`;

const Checkbox = styled.input`
  &[type='checkbox'] {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    outline: none;
    background-color: white;
    border: 0.2px solid #979797;
    appearance: none;
    position: relative;

    &:hover {
      cursor: pointer;
    }

    &:checked:after {
      content: '✓';
      position: absolute;
      top: -3.5px;
      left: 3px;
    }
  }
`;

const Description = styled.span`
  font-size: 14px;
  margin-left: 10px;
  line-height: 16.41px;
  margin-top: 2px;
  width: 224px;
  word-break: break-all;
  /* background-color: red; */
`;

const DeleteButton = styled.button`
  /* background: yellow; */
  margin-left: 5px;
  height: 20px;
  margin-top: -2px;

  &:after {
    color: #979797;
    content: '✕';
    visibility: hidden;
  }

  &:hover:after {
    color: #000000;
  }

  &:focus {
    outline: none;
  }
`;

const Item = styled.div`
  width: 100%;
  margin-bottom: 12px;
  display: flex;
  border-radius: 5px;
  /* background-color: lime; */

  &:hover {
    background-color: #e4e7d5;
    ${DeleteButton}:after {
      visibility: visible;
    }
  }
`;

const SpinnerTodoList = styled.img`
  text-align: center;
  height: 20px;
`;

const SpinnerItem = styled.img`
  height: 15px;
  margin-top: 3px;
  margin-left: 4px;
`;

const SpinnerInput = styled.img`
  position: absolute;
  height: 15px;
  right: 0;
  top: 14px;
`;

const SpinnerCheckbox = styled(Checkbox)`
  &[type='checkbox'] {
    &:checked:after {
      content: url(${asset_spinner});
      transform: scale(0.063);
      transform-origin: left top;
      margin-top: 6px;
    }
  }
`;

function App() {
  const [list, setList] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [isLoadingTodoList, setIsLoadingTodoList] = useState(false);
  const [isLoadingInput, setIsLoadingInput] = useState(false);
  const [isLoadingCheckboxById, setIsLoadingCheckboxById] = useState('');
  const [isLoadingItemById, setIsLoadingItemById] = useState('');

  useEffect(() => {
    pullList();
  }, []);

  const pullList = () => {
    setIsLoadingTodoList(true);
    axios.get(url + '/todo-list/').then(response => {
      setIsLoadingTodoList(false);
      const { data } = response;
      setList(data);
    });
  };

  const handleEnterNewItem = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (title !== '' && event.key === 'Enter') {
      setIsLoadingInput(true);
      axios.post(url + '/todo-list/', { title }).then(response => {
        setIsLoadingInput(false);
        const newItem: Todo = response.data;
        setList(prevList => [...prevList, newItem]);
        setTitle('');
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    setIsLoadingItemById(id);
    axios.delete(url + '/todo-list/' + id).then(response => {
      setIsLoadingItemById('');
      setList(prevList => prevList.filter(item => item.id !== id));
    });
  };

  const toggleFinishItem = (id: string) => {
    setIsLoadingCheckboxById(id);
    axios.put(process.env.REACT_APP_BASE_URL + '/todo-list/' + id).then(response => {
      setIsLoadingCheckboxById('');
      setList(prevList => prevList.map(item => (item.id === id ? { ...item, isFinish: !item.isFinish } : item)));
    });
  };

  console.log(`I'm here: 1`);
  console.log(`I'm here: 2`);
  console.log(`I'm here: 3`);

  return (
    <Wrapper>
      <InputWrapper>
        <Input
          type="text"
          placeholder="Enter new task"
          value={title}
          onChange={event => {
            if (!isLoadingInput) {
              setTitle(event.currentTarget.value);
            }
          }}
          onKeyPress={handleEnterNewItem}
        />
        {isLoadingInput ? <SpinnerInput src={asset_spinner} alt="asset_spinner" /> : null}
      </InputWrapper>
      <TodoList>
        {isLoadingTodoList ? (
          <SpinnerTodoList src={asset_spinner} alt="asset_spinner" />
        ) : (
          <>
            {/* TODO: Fix bug that loading can only exists in one item. */}
            {list.map(item => (
              <Item key={item.id}>
                {isLoadingCheckboxById === item.id ? (
                  <SpinnerCheckbox type="checkbox" defaultChecked disabled />
                ) : (
                  <Checkbox type="checkbox" checked={item.isFinish} onChange={() => toggleFinishItem(item.id)} />
                )}
                <Description>{item.title}</Description>
                {isLoadingItemById === item.id ? (
                  <SpinnerItem src={asset_spinner} alt="asset_spinner" />
                ) : (
                  <DeleteButton onClick={() => handleDeleteItem(item.id)} />
                )}
              </Item>
            ))}
          </>
        )}
      </TodoList>
    </Wrapper>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

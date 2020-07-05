/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PulseLoader from 'react-spinners/PulseLoader';

import List from '../List';
import { searchRequest } from '../../store/modules/Board/actions';

import {
  Container,
  BoardHeader,
  Search,
  Button,
  Dropdown,
  Circle,
  Person,
  LeftSection,
  RightSection,
  BoardColumns,
  ButtonAdd,
} from './styles';
import Arrowdown from '../../assets/icons/arrowdown.svg';
import Add from '../../assets/imgs/add.png';

export default function Board() {
  const dispatch = useDispatch();

  const board = useSelector((state) => state.Board.board);
  const people = useSelector((state) => state.Board.people);
  const tags = useSelector((state) => state.Board.tags);
  const loading = useSelector((state) => state.Board.loading);

  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(searchRequest());
  }, []);

  return (
    <Container isLoading={loading}>
      {loading ? (
        <PulseLoader size={30} color="#707070" />
      ) : (
        <>
          <BoardHeader>
            <h1>{board?.title}</h1>
            <Search>
              <input type="text" placeholder="Pesquisar" name="" id="" />
              <Button onClick={() => setShowDropdown(!showDropdown)}>
                FILTRO AVANÇADO
                <img
                  src={Arrowdown}
                  className={showDropdown ? 'rotate' : undefined}
                  alt="icon arrow"
                />
              </Button>
            </Search>
            {showDropdown && (
              <Dropdown>
                <LeftSection>
                  {people?.map((person) => {
                    const spltName = person.name.toUpperCase().split(' ');

                    return (
                      <Person key={person.id}>
                        {person.photoURL ? (
                          <img src={person.photoURL} alt="person avatar" />
                        ) : (
                          <Circle>{spltName[0][0] + spltName[1][0]}</Circle>
                        )}
                        <p>{person.name}</p>
                      </Person>
                    );
                  })}
                </LeftSection>
                <RightSection>
                  {tags?.map((tag) => (
                    <div key={tag}>
                      <p>{tag}</p>
                    </div>
                  ))}
                </RightSection>
              </Dropdown>
            )}
          </BoardHeader>
          <BoardColumns>
            {board?.columns?.map((list, index) => (
              <List key={list.id} data={list} listIndex={index} />
            ))}
            <ButtonAdd onClick={() => setShowForm(!showForm)}>
              <img src={Add} alt="icon add" />
              COLUNA
            </ButtonAdd>
          </BoardColumns>
        </>
      )}
    </Container>
  );
}

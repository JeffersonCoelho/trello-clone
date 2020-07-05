import React, { useRef, useState, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { useDrag, useDrop } from 'react-dnd';
import { MdEdit, MdClose, MdDeleteForever } from 'react-icons/md';

import BoardContext from '../Board/context';

import {
  deleteCardRequest,
  editCardRequest,
  moveCard,
} from '../../store/modules/Board/actions';

import { Container, Info, Actions } from './styles';

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(BoardContext);
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [cardTitle, setCardTitle] = useState(data?.title ? data?.title : '');

  const [{ isDragging }, dragRef] = useDrag({
    item: { type: 'CARD', index, listIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;

      if (
        draggedIndex === targetIndex &&
        draggedListIndex === targetListIndex
      ) {
        return;
      }

      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;

      const draggedOffset = monitor.getClientOffset();
      const draggedTop = draggedOffset.y - targetSize.top;

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return;
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return;
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      item.index = targetIndex;
      item.listIndex = targetListIndex;

      // dispatch(moveCard(draggedListIndex, draggedIndex, targetIndex));
    },
  });

  dragRef(dropRef(ref));

  function cancelEdit() {
    setShowForm(!showForm);
    setCardTitle(data?.title);
  }

  function editCard(e, title) {
    e.preventDefault();

    const newCard = {
      id: data.id,
      title,
      tags: data.tags,
    };

    dispatch(editCardRequest(newCard, listIndex));
    setShowForm(!showForm);
  }

  return (
    <>
      {!showForm ? (
        <Container ref={ref} isDragging={isDragging}>
          <div>
            <p>{data?.title}</p>
            <button onClick={() => setShowForm(!showForm)}>
              <MdEdit size={20} color="#707070" />
            </button>
          </div>

          <Info>
            <div>
              {data?.tags?.map((tag) => (
                <p key={tag}>{tag}</p>
              ))}
            </div>
            <img
              src="https://api.adorable.io/avatars/abott@adorable.png"
              alt=""
            />
          </Info>
        </Container>
      ) : (
        <>
          <Container>
            <div>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                autoFocus
              />
              <div>
                <button>
                  <MdDeleteForever
                    size={20}
                    color="#ff0000"
                    onClick={() =>
                      dispatch(deleteCardRequest(data.id, listIndex))
                    }
                  />
                </button>
                <button onClick={() => setShowForm(!showForm)}>
                  <MdEdit size={20} color="#707070" />
                </button>
              </div>
            </div>

            <Info>
              <div>
                {data?.tags?.map((tag) => (
                  <p key={tag}>{tag}</p>
                ))}
              </div>
              <img
                src="https://api.adorable.io/avatars/abott@adorable.png"
                alt=""
              />
            </Info>
          </Container>
          <Actions>
            <button type="submit" onClick={(e) => editCard(e, cardTitle)}>
              Salvar
            </button>
            <button type="button" onClick={() => cancelEdit()}>
              <MdClose size={32} color="#979797" />
            </button>
          </Actions>
        </>
      )}
    </>
  );
}

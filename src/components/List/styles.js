import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  flex: 0 0 344px;
  background: #f4f5f7;

  & + div {
    margin-left: 10px;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 52px;
    padding: 0 14px;
    background: #e4e6eb;

    h2 {
      color: #707070;
      font-weight: 400;
      font-size: 16px;
    }

    button {
      height: 16px;
      border: 0;
      cursor: pointer;
      background: #e4e6eb;

      img {
        height: 16px;
      }
    }
  }

  ul {
    padding: 10px 12px;
  }
`;

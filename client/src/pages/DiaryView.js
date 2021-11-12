import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from '../components/Header';
import DrawingModal from '../components/Modal/DrawingModal';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const DiaryWrap = styled.div`
  width: 100vw;
  height: 90vh;
  display: flex;
  flex-direction: row;

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  > div.img {
    background-color: #eee;
  }
  div.title {
    margin: 0.5rem 0;
    padding: 0.5rem 0 1rem;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
  }
`;

const DiaryView = () => {
  const [diaryInfo, setDiaryInfo] = useState([]);
  const [clickDrawing, setClickDrawing] = useState(false);

  const DrawingHandler = () => {
    setClickDrawing(!clickDrawing);
  };
  const history = useNavigate();
  const location = useLocation();

  const getConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
      data: location.state._id,
    },
  };
  const deleteConfig = {
    headers: {
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`,
    },
  };

  const DeleteDaiaryHandler = () => {
    if (location.state._id) {
      axios.delete('/api/contents/delete', { ...deleteConfig, data: { _id: location.state._id } }).then((res) => {
        console.log(res);
        history('/main');
      });
    }
  };
  useEffect(() => {
    if (location.state._id) {
      console.log(location.state._id);
      axios
        .get('/api/contents/detail', getConfig)
        .then((res) => {
          console.log(res.data[0]);
          setDiaryInfo(res.data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);
  // 서버에서 문자열 인덱스값 응답 옴.
  // weather ['0'(sun), '1'(cloud), '2'[rain], '3'(snow)]
  return (
    <>
      <Header />
      <DiaryWrap>
        <div className='img' onClick={DrawingHandler}>
          img
        </div>
        {clickDrawing ? <DrawingModal /> : null}
        <div>
          {/* <input type='text' placeholder='Title' /> */}
          <div className='title'>
            {diaryInfo.title}
            <button onClick={DeleteDaiaryHandler}>Delete</button>
            <button>Edit</button>
            <button>Save</button>
          </div>
          {console.log(diaryInfo.hashtags)}
          {/* {diaryInfo.hashtags.map((el,index)=>{
            console.log(el)
          })} */}
          {diaryInfo.hashtags && diaryInfo.hashtags.map((el, idx) => {
            return <span key={idx}>#{el}</span>;
          })}
          <button>{diaryInfo.weather}</button>
          <span>{diaryInfo.createdAt}</span>
          {/* <input type='text' placeholder='contents' /> */}
          <p>{diaryInfo.text}</p>
        </div>
      </DiaryWrap>
    </>
  );
};

export default DiaryView;

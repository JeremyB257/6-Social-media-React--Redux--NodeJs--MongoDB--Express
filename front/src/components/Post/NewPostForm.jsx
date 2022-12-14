import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { addPost, getPosts } from '../../actions/post.actions';
import { isEmpty, timestampParser } from '../Utils';

const NewPostForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [postPicture, setPostPicture] = useState(null);
  const [video, setVideo] = useState('');
  const [file, setFile] = useState();
  const userData = useSelector((state) => state.userReducer);
  const error = useSelector((state) => state.errorReducer.postError);
  const dispatch = useDispatch();

  const handlePicture = (e) => {
    setPostPicture(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
    setVideo('');
  };

  const handlePost = async () => {
    if (message || postPicture || video) {
      const data = new FormData();
      data.append('posterId', userData._id);
      data.append('message', message);
      if (file) data.append('file', file);
      data.append('video', video);

      await dispatch(addPost(data));
      dispatch(getPosts());
      cancelPost();
    } else {
      console.log('Veuillez entrer un message');
    }
  };

  const cancelPost = () => {
    setMessage('');
    setPostPicture('');
    setVideo('');
    setFile('');
  };

  useEffect(() => {
    if (!isEmpty(userData)) {
      setIsLoading(false);
    }
    const handleVideo = () => {
      let findLink = message.split(' ');
      for (let i = 0; i < findLink.length; i++) {
        if (findLink[i].includes('https://www.yout') || findLink[i].includes('https://yout')) {
          let embed = findLink[i].replace('watch?v=', 'embed/');
          setVideo(embed.split('&')[0]);
          findLink.splice(i, 1);
          setMessage(findLink.join(' '));
          setPostPicture('');
        }
      }
    };
    handleVideo();
  }, [userData, message, video]);

  return (
    <div className="post-container">
      {isLoading ? (
        <i className="fas fa-spinner fa-pulse"></i>
      ) : (
        <>
          <NavLink to="/profile">
            <div className="user-info">
              <img src={userData.picture} alt="user-pic" />
            </div>
          </NavLink>
          <div className="post-form">
            <textarea
              name="message"
              id="message"
              placeholder="Quoi de neuf ?"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            />
            {message || postPicture || video.length > 20 ? (
              <li className="card-container">
                <div className="card-left">
                  <img src={userData.picture} alt="user-pic" />
                </div>
                <div className="card-right">
                  <div className="card-header">
                    <div className="pseudo">
                      <h3>{userData.pseudo}</h3>
                    </div>
                    <span>{timestampParser(Date.now())}</span>
                  </div>
                  <div className="content">
                    <p>{message}</p>
                    {postPicture ? <img src={postPicture} alt="" /> : null}
                    {video && (
                      <iframe
                        src={video}
                        frameborder="0"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={video}></iframe>
                    )}
                  </div>
                </div>
              </li>
            ) : null}
            <div className="footer-form">
              <div className="icon">
                {isEmpty(video) && (
                  <>
                    <img src="./img/icons/picture.svg" alt="img" />
                    <input
                      type="file"
                      id="file-upload"
                      name="file"
                      accept=".jpg, .jpeg, .png"
                      onChange={(e) => handlePicture(e)}
                    />
                  </>
                )}
                {video && <button onClick={() => setVideo('')}>Supprimer video</button>}
              </div>
              {!isEmpty(error) && <p>{error}</p>}

              <div className="btn-send">
                {message || postPicture || video.length > 20 ? (
                  <button className="cancel" onClick={cancelPost}>
                    Annuler message
                  </button>
                ) : null}
                <button className="send" onClick={handlePost}>
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NewPostForm;

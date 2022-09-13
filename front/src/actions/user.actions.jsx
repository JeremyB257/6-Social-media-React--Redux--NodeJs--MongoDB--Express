import axios from 'axios';

export const GET_USER = 'GET_USER';
export const UPLOAD_PICTURE = 'UPLOAD_PICTURE';
export const UPDATE_BIO = 'UPDATE_BIO';

export const GET_USER_ERRORS = 'GET_USER_ERRORS';

export const getUser = (uid) => {
  return (dispatch) => {
    return axios
      .get(`${process.env.PUBLIC_URL}api/user/${uid}`)
      .then((res) => {
        dispatch({ type: GET_USER, payload: res.data });
      })
      .catch((err) => console.log(err));
  };
};

export const uploadPicture = (data, id) => {
  return (dispatch) => {
    return axios({
      method: 'post',
      url: `${process.env.PUBLIC_URL}api/user/upload/${id}`,
      withCredentials: true,
      data,
    })
      .then((res) => {
        console.log(res);
        dispatch({ type: GET_USER_ERRORS, payload: '' });
        return axios.get(`${process.env.PUBLIC_URL}api/user/${id}`).then((res) => {
          dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture });
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.response.data.error) {
          dispatch({ type: GET_USER_ERRORS, payload: err.response.data.error });
        } else {
          dispatch({ type: GET_USER_ERRORS, payload: '' });
        }
      });
  };
};

export const updateBio = (userId, bio) => {
  return (dispatch) => {
    return axios({
      method: 'put',
      url: `${process.env.PUBLIC_URL}api/user/${userId}`,
      withCredentials: true,
      data: { bio },
    })
      .then((res) => {
        dispatch({ type: UPDATE_BIO, payload: bio });
      })
      .catch((err) => console.log(err));
  };
};

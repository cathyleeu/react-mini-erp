import axios from 'axios';
const ROOT_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3090';

/*-----   types -----*/


export const FETCH_INFO_FOR_ISSUED = 'FETCH_INFO_FOR_ISSUED';
export const IS_REGISTER_NAMES = 'IS_REGISTER_NAMES';
export const IS_FETCHED_NAMES = 'IS_FETCHED_NAMES';
export const IS_EDITED_NAMES = 'IS_EDITED_NAMES'
export const IS_WRITING_NAMES = 'IS_WRITING_NAMES'
export const IS_REGISTERED_FIRST_TIME = 'IS_REGISTERED_FIRST_TIME'

/*-------------------*/


/*----- actions -----*/




export const fetchInfoForIssued = (parentId, name) => (dispatch) => {
  axios.get(`${ROOT_URL}/branch/${parentId}/${name}`)
     .then((response) => {
       dispatch({
         type: FETCH_INFO_FOR_ISSUED,
         recordedInfo: response.data[0]
       })
     })
}


export const isEditingNames = (classId, students, kclassName) => (dispatch) => {
  console.log(students, classId);
  axios.put(`${ROOT_URL}/login/update/${classId}`, students)
    .then(res => {
      console.log(res);
      alert('수정이 완료 되었습니다.')
      dispatch({type: IS_EDITED_NAMES, students, kclassName})
    })
}

export const isWritingNames = (kclassName, students) => {
  console.log(kclassName, students);
  return({ type: IS_WRITING_NAMES, kclassName, students})}

export const isFetchedNamesByClass = (classId, kclassName) => (dispatch) => {
  axios.get(`${ROOT_URL}/login/${classId}`)
    .then(res => {
      dispatch({ type: IS_FETCHED_NAMES, names:res.data[0].className , students:res.data[0].students })
    })
    .catch(err => {
      dispatch({ type: IS_REGISTERED_FIRST_TIME, kclassName})
      console.log(err, classId, kclassName);
    })
}

export const isRegisteredNames = ( parentId, kinderId, classId, className, students ) => (dispatch) => {
  const loginCont = { parentId, kinderId, classId, className, students }
  axios.post(`${ROOT_URL}/login`, loginCont)
    .then(res => {
      dispatch({ type: IS_REGISTER_NAMES, names: className, students, className})
      console.log(className);
      dispatch(isFetchedNamesByClass(classId, className))
      alert('등록이 완료 되었습니다.')
    })
}






/*-------------------*/

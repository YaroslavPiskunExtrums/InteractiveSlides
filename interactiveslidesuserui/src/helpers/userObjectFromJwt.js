const getUserObjectFromSession = () => {
  const obj = JSON.parse(sessionStorage.getItem("authUser")).accessToken;
  return JSON.parse(atob(obj.split('.')[1]));

}

export default getUserObjectFromSession;
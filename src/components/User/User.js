import { useEffect, useState } from "react";
import "./User.css";
// import UserInfo from "../UserInfo/UserInfo";
// import ChangePassword from "../ChangePassword/ChangePassword";
import { Link, Outlet } from "react-router-dom";
import { getToken } from "./../../features/sessionStorage";
import axiosClient from "./../../api/axiosClient";
import { getUser } from "./../../features/sessionStorage";
import { setUserSession } from "./../../features/sessionStorage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faUser, faLock, faFilePen } from '@fortawesome/free-solid-svg-icons';

function User() {
  const token = getToken();
  const [userInfo, setUserInfo] = useState(getUser());
  const [avatarFile, setAvatarFile] = useState();
  const [userHeader, setUserHeader] = useState("Thông tin cá nhân");

  // const [city, setCity] = useState(-1)

  const handleChangeAvatar = (e) => {
    const preview = document.getElementById("avatar");
    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      function () {
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
    setAvatarFile((prevAvatar) => {
      return (prevAvatar = e.target.files[0]);
    });
  };

  // useEffect(() => {
  //     async function getData() {
  //         const res = await axiosClient.get(
  //             'https://socook.herokuapp.com/api/user/myinfo',
  //             config
  //         )
  //         await setUserInfo({ ...res.data.user })
  //     }
  //     getData()

  // }, [])

  useEffect(() => {
    const config = {
      headers: {
        token: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };
    const fd = new FormData();
    fd.append("image", avatarFile);
    axiosClient
      .post("https://socook.herokuapp.com/api/user/avatar", fd, config)
      .then((res) => {
        if (res.data.user) {
          console.log(res.data);
          setUserSession(token, res.data.user);
          setUserInfo({ ...getUser() });
        }
      })
      .catch((err) => console.log("F: ", err));
  }, [avatarFile]);

  return (
    <div className=" user-info-container">
      <div className="container">
        <div className="row">
          <div className="col-3">
            <div className="user-info-sidebar">
              <div className="user-avatar">
                <label htmlFor="upload-avatar">
                  <input
                    type="file"
                    id="upload-avatar"
                    onChange={handleChangeAvatar}
                  />
                  <img
                    id="avatar"
                    className="avatar"
                    src={userInfo.avatar_image}
                    alt="Avatar"
                  ></img>
                </label>
                <span>{userInfo.full_name}</span>
              </div>
              <div className="user-function">
                <div className={`user-function-button ${userHeader === 'Thông tin cá nhân' ? 'user-function-button--active' : ''}`}>
                  <Link to="user-info" className="user-function-button-link">
                    <FontAwesomeIcon className="user-function-button-icon" icon={faUser} />
                    <span
                      onClick={(e) => {
                        setUserHeader(e.target.innerHTML);
                      }}
                    >
                      Thông tin cá nhân
                    </span>
                  </Link>
                </div>
                <div className={`user-function-button ${userHeader === 'Đổi mật khẩu' ? 'user-function-button--active' : ''}`}>
                  <Link to="change-password" className="user-function-button-link">
                    <FontAwesomeIcon className="user-function-button-icon" icon={faLock} />
                    <span
                      onClick={(e) => {
                        setUserHeader(e.target.innerHTML);
                      }}
                    >
                      Đổi mật khẩu
                    </span>
                  </Link>
                </div>
                <div className={`user-function-button ${userHeader === 'Bộ sưu tập' ? 'user-function-button--active' : ''}`}>
                  <Link to="collection" className="user-function-button-link">
                    <FontAwesomeIcon className="user-function-button-icon" icon={faClipboardList} />
                    <span
                      onClick={(e) => {
                        setUserHeader(e.target.innerHTML);
                      }}
                    >
                      Bộ sưu tập
                    </span>
                  </Link>
                </div>
                <div className={`user-function-button ${userHeader === 'Công thức của tôi' ? 'user-function-button--active' : ''}`}>
                  <Link to="my-recipe" className="user-function-button-link">
                    <FontAwesomeIcon className="user-function-button-icon" icon={faFilePen} />
                    <span
                      onClick={(e) => {
                        setUserHeader(e.target.innerHTML);
                      }}
                    >
                      Công thức của tôi
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-9">
            <div className="user-container">
              <h3 className="user-header">{userHeader}</h3>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;

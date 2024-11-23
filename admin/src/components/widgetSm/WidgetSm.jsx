import "./widgetSm.css";
import { Visibility as VisibilityIcon } from "@mui/icons-material"; // Updated import
import { useEffect, useState } from "react";
import axios from "axios";

export default function WidgetSm({ user }) {
  // Nhận thông tin user từ props
  const [newUsers, setNewUsers] = useState([]);

  useEffect(() => {
    const getNewUsers = async () => {
      try {
        const res = await axios.get("/users/", {
          headers: {
            token: `Bearer ${user?.accessToken}`, // Sử dụng token người dùng truyền vào
          },
        });
        setNewUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user?.accessToken) {
      getNewUsers();
    }
  }, [user]);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {newUsers.map((user) => (
          <li className="widgetSmListItem" key={user.id}>
            {" "}
            {/* Added unique key prop */}
            <img
              src={
                user.profilePic ||
                "https://pbs.twimg.com/media/D8tCa48VsAA4lxn.jpg"
              }
              alt=""
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{user.username}</span>
            </div>
            <button className="widgetSmButton">
              <VisibilityIcon className="widgetSmIcon" /> {/* Updated icon */}
              Display
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

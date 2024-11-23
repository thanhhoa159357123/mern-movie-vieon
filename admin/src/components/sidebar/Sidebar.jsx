import "./sidebar.css";
import {
  LineStyle as LineStyleIcon,
  PermIdentity as PermIdentityIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  List as ListIcon,
  AddToQueue as AddToQueueIcon,
  QueuePlayNext as QueuePlayNextIcon,
} from "@mui/icons-material"; // Updated import
import { useContext } from "react";

import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext/AuthContext";

export default function Sidebar() {
  const { user, dispatch } = useContext(AuthContext);
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Dashboard</h3>
          <ul className="sidebarList">
            <Link to="/" className="link">
              <li className="sidebarListItem active">
                <LineStyleIcon className="sidebarIcon" />
                Home
              </li>
            </Link>
          </ul>
        </div>
        <div className="sidebarMenu">
          <h3 className="sidebarTitle">Quick Menu</h3>
          <ul className="sidebarList">
            <Link to="/users" className="link">
              <li className="sidebarListItem">
                <PermIdentityIcon className="sidebarIcon" />
                Users
              </li>
            </Link>
            <Link to="/movies" className="link">
              <li className="sidebarListItem">
                <PlayCircleOutlineIcon className="sidebarIcon" />
                Movies
              </li>
            </Link>
            <Link to="/lists" className="link">
              <li className="sidebarListItem">
                <ListIcon className="sidebarIcon" />
                Lists
              </li>
            </Link>
            <Link to="/newMovie" className="link">
              <li className="sidebarListItem">
                <AddToQueueIcon className="sidebarIcon" />
                Add Movie
              </li>
            </Link>
            <Link to="/newList" className="link">
              <li className="sidebarListItem">
                <QueuePlayNextIcon className="sidebarIcon" />
                Add List
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
}

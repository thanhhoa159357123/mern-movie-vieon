import "./userList.css";
import { DataGrid } from "@mui/x-data-grid";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext/AuthContext";
import { Link } from "react-router-dom";

export default function UserList() {
  const [newUsers, setNewUsers] = useState([]);
  const { user } = useContext(AuthContext);

  const handleDelete = (id) => {
    setNewUsers(newUsers.filter((item) => item._id !== id));
  };

  useEffect(() => {
    const getNewUsers = async () => {
      try {
        const res = await axios.get("/users/", {
          headers: {
            token: `Bearer ${user?.accessToken}`,
          },
        });
        setNewUsers(res.data);
      } catch (err) {
        console.log("Error fetching new users:", err);
      }
    };

    if (user?.accessToken) {
      getNewUsers();
    }
  }, [user]);

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    {
      field: "username",
      headerName: "Username",
      width: 200,
      renderCell: (params) => {
        return <div className="userListUser">{params.row.username}</div>;
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/${params.row._id}`}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <h3>Welcome, {user?.username || "Guest"}</h3>
      <DataGrid
        rows={newUsers}
        columns={columns}
        pageSize={8}
        checkboxSelection
        disableSelectionOnClick
        rowsPerPageOptions={[8, 10, 25]}
        getRowId={(r) => r._id}
        autoHeight
      />
    </div>
  );
}

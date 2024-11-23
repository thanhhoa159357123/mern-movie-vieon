import "./listList.css";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutline } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ListContext } from "../../context/listContext/ListContext";
import { deleteList, getLists } from "../../context/listContext/apiCalls";

export default function ListList() {
  const { lists, dispatch } = useContext(ListContext);

  useEffect(() => {
    getLists(dispatch);
  }, [dispatch]); 

  const handleDelete = (id) => {
    deleteList(id, dispatch); 
  };

  // Cấu hình các cột của DataGrid
  const columns = [
    { field: "_id", headerName: "ID", width: 250 },
    { field: "title", headerName: "Title", width: 250 },
    { field: "genre", headerName: "Genre", width: 150 },
    { field: "type", headerName: "Type", width: 150 },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link
              to={{
                pathname: "/list/" + params.row._id,
              }}
              state={{ list: params.row }}
            >
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">

      {/* DataGrid để hiển thị danh sách */}
      <DataGrid
        rows={lists} // Sử dụng lists từ context
        disableSelectionOnClick
        columns={columns} // Cột cấu hình
        pageSize={8} // Số dòng trên mỗi trang
        checkboxSelection
        getRowId={(r) => r._id} // Dùng _id làm key cho mỗi dòng
      />
    </div>
  );
}

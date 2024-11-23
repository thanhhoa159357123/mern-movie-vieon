import { useLocation, Link } from "react-router-dom";
import "./list.css";

export default function List() {
  const location = useLocation();
  const list = location.state?.list || {}; // Lấy dữ liệu từ state, fallback nếu không có

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">{list.title || "No Title"}</h1>
        <Link to="/newList">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            <span className="productName">{list.title || "No Title"}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{list._id || "No ID"}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">genre:</span>
              <span className="productInfoValue">
                {list.genre || "No Genre"}
              </span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">type:</span>
              <span className="productInfoValue">{list.type || "No Type"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>List Title</label>
            <input type="text" defaultValue={list.title || ""} />
            <label>Type</label>
            <input type="text" defaultValue={list.type || ""} />
            <label>Genre</label>
            <input type="text" defaultValue={list.genre || ""} />
          </div>
          <div className="productFormRight">
            <button className="productButton">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}

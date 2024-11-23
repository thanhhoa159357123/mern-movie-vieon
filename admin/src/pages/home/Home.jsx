import Chart from "../../components/chart/Chart";
import "./home.css";
import { userData } from "../../dummyData";
import WidgetSm from "../../components/widgetSm/WidgetSm";
import { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/authContext/AuthContext"; // Import AuthContext

export default function Home() {
  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );
  
  const [userStats, setUserStats] = useState([]);
  const { user } = useContext(AuthContext); // Lấy thông tin người dùng từ context (đã đăng nhập)

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await axios.get("/users/stats", {
          headers: {
            token: `Bearer ${user?.accessToken}`, // Dùng token của người dùng để xác thực API request
          },
        });

        const statsList = res.data.sort((a, b) => a._id - b._id);
        
        // Map dữ liệu trả về để lưu vào state `userStats`
        statsList.map((item) =>
          setUserStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], "New User": item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };

    if (user?.accessToken) { // Kiểm tra nếu người dùng đã đăng nhập và có token
      getStats(); // Gọi hàm lấy dữ liệu thống kê
    }
  }, [MONTHS, user?.accessToken]); // Sử dụng `user?.accessToken` để phụ thuộc vào token khi thay đổi

  return (
    <div className="home">
      <Chart data={userStats} title="User Analytics" grid dataKey="New User" />
      <div className="homeWidgets">
        <WidgetSm user={user}/>
      </div>
    </div>
  );
}

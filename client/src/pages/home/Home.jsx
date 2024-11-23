import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/featured/Featured";
import "./home.scss";
import List from "../../components/list/List";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../authContext/AuthContext";

const Home = ({ type }) => {
  const { user } = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [genre, setGenre] = useState(null);
  useEffect(() => {
    const getRandomLists = async () => {
      try {
        const res = await axios.get(
          `lists${type ? "?type=" + type : ""}${
            genre ? "&genre=" + genre : ""
          }`,
          {
            headers: {
              token:
                "Bearer " +
                JSON.parse(localStorage.getItem("user")).accessToken,
            },
          }
        );
        setLists(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getRandomLists();
  }, [type, genre]);

  return (
    <div className="home">
      <Navbar user={user} />
      <Featured type={type} setGenre={setGenre} />
      {lists.map((list) => (
        <List list={list} user={user} />
      ))}
    </div>
  );
};

export default Home;

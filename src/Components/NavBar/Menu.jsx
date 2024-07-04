import React, { useContext, useEffect, useState } from "react";
import { BiMessageRoundedCheck } from "react-icons/bi";
import { BsCameraReels } from "react-icons/bs";
import { CiHeart, CiHome } from "react-icons/ci";
import { IoIosMenu, IoIosSearch } from "react-icons/io";
import { MdOutlineAddBox, MdOutlineExplore } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import Css from "./Search.module.css";
import { useAuth } from "../../Routing/AuthProvider";
import axios from "axios";
import SharePosts from "./SharePosts";
import { ThemeContext } from "../ThemeContext/ThemeContext";
const Menu = () => {
  const [width, setwidth] = useState(false);
  const ChangeStyle = () => {
    setwidth(!width);
  };
  const [message, setMessage] = useState(false);
  const messages = () => {
    setMessage(!message);
  };
  const [Logouts, setLogouts] = useState(false);
  const ChangeStyleLogouts = () => {
    setLogouts(!Logouts);
  };
  const [DevPosts, setDevPosts] = useState(false);
  const DevPost = () => {
    setDevPosts(!DevPosts);
  };
  const { logout } = useAuth(); // here for Log out to Remove The Detalis from User
  const Path = useNavigate();
  const LogOuts = () => {
    logout();
    Path("/login");
  };
  let idUsers = JSON.parse(localStorage.getItem("id")); // here For take Some Info from The Profile Login
  let id = JSON.parse(localStorage.getItem("id"));
  const [DataProfile, SetDataProfile] = useState(null);
  useEffect((e) => {
    const APIS = async () => {
      try {
        let Response = await axios.get(
          `https://instagram-4.onrender.com/api/Profile/getProfile/${id}`
        );
        SetDataProfile(Response.data.data.product);
        localStorage.setItem(
          "idProfile",
          JSON.stringify(Response.data.data.product[0]._id)
        );
      } catch (err) {
        console.error("Get Profile Have Error Page Menu", err);
      }
    };
    APIS();
  }, []);
  const { darkMode ,toggleDarkMode } = useContext(ThemeContext);
  // Here for Search on Person's
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // console.log("Fetching data for:", searchTerm);
        const response = await axios.get('https://instagram-4.onrender.com/api/Profile/GetAllProfile', {
          params: { search: searchTerm }
        });        
        // console.log("Response data:", response.data);
        const allProfiles = response.data.data?.product || [];
        const filteredProfiles = allProfiles.filter(profile => 
          profile.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setResults(filteredProfiles);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Data is Not Found");
      }
      setIsLoading(false);
    };
    if (searchTerm) {
      const delayDebounceFn = setTimeout(() => {
        fetchData();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setResults([]);
    }
  }, [searchTerm]);
  return (
    <div>
      <div className={`parent-Menu ${darkMode ? 'dark-mode' : 'light-mode'}`}>
        <div
          className={`container-Menu ${width ? "border" : ""} ${
            Css.containerMenu
          }`}
        >
          <div className={`card  ${Css.cards}`}>
            <div className={`logo ${Css.logo}`}>
              <Link to="/">
                <FaInstagram />{" "}
              </Link>
            </div>
            <ul
              className={`${width ? "ChangeWidth" : ""} ${
                message ? "ChangeWidth" : ""
              } ${Css.ulMenu}`}
            >
              <li>
                <Link to="/">
                  <button>
                    <CiHome />
                  </button>
                </Link>
              </li>
              <li>
                <Link onClick={() => ChangeStyle()} to="#">
                  <button>
                    <IoIosSearch />
                  </button>{" "}
                </Link>
              </li>
              <li>
                <Link to="/">
                  <button>
                    <MdOutlineExplore />
                  </button>
                </Link>
              </li>
              <li>
                <Link to="/">
                  <button>
                    <BsCameraReels />
                  </button>{" "}
                </Link>
              </li>
              <li>
                <Link onClick={() => messages()} to="/message">
                  <button>
                    <BiMessageRoundedCheck />
                  </button>{" "}
                </Link>
              </li>
              <li>
                <Link to="/">
                  <button>
                    <CiHeart />
                  </button>{" "}
                </Link>
              </li>
              <li>
                <Link onClick={() => DevPost()} to="">
                  <button>
                    <MdOutlineAddBox />
                  </button>{" "}
                </Link>
              </li>
              <li>
                <Link to={`/${idUsers}`}>
                  <div className="Pimage">
                    {DataProfile?.map((e, index) => (
                      <img src={e.image} alt="" key={index} />
                    ))}
                  </div>
                </Link>
              </li>
              <div className="dev-LogOut">
                <li>
                  <Link onClick={() => ChangeStyleLogouts()} to="">
                    <button>
                      <IoIosMenu />
                    </button>
                  </Link>
                </li>
                <div className={`fixed-LogOut ${Logouts ? "top-logOut" : ""}`}>
                <button onClick={toggleDarkMode}>Switch appearance</button>
                  <button onClick={() => LogOuts()}>Log out</button>
                </div>
              </div>
            </ul>
          </div>
        </div>
      </div>
      <div className={`${Css.parent} ${width ? `${Css.backSearch}` : ""} Search-bar ${ darkMode ? "dark-mode" : "light-mode"  }`}>
        <div className={Css.container}>
        <form className={Css.card}>
            <h1>Search</h1>
            <input type="text" placeholder="Search"    value={searchTerm}  onChange={(e) =>  setSearchTerm(e.target.value)} />
            {isLoading && <p>Data is Loading...</p>}
                {error && <p>{error}</p>}
                {results.length > 0 ? (
                  <ul className={darkMode ? 'dark-mode' : 'light-mode'}>
                    {results.map((e, index) => (
                        <Link to={`/${e.CreatBy}`}  key={index}>
                      <div className={Css.infoSearch}>
                        <img src={e.image} alt="" />
                        <div className={Css.detalisUser}>
                        <p>{e.title}</p>
                        <p className={Css.nickName}>{e.nickName}</p>
                        </div>
                      </div>
                        </Link>
                    ))}
                  </ul>
                ) : (
                  !isLoading && <p>No results found.</p>
                )}
          </form>
        </div>
      </div>
      <div className={`dev-posts ${DevPosts ? "left-posts" : ""}`}>
        <SharePosts />
        <button className="close-posts" onClick={() => DevPost()}>
          X
        </button>
      </div>
    </div>
  );
};

export default Menu;

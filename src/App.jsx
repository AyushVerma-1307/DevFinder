import "./App.css";

import Title from "./Components/Title";
import SearchBar from "./Components/SearchBar";
import ProfileCard from "./Components/ProfileCard";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "./Components/GlobalStyles";
import { lightTheme, darkTheme } from "./Components/Themes";
import axios from "axios";
import Footer from "./Components/Footer";

function App() {
  const [theme, setTheme] = useState("dark");
  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  const BASE_URL = `https://api.github.com/users/`;
  const [data, setData] = useState({});
  const [isError, setIsError] = useState(false);

  //Formats a date object to '04 Mar 2012' format
  function formatDate(dateProperty) {
    let dateMiliSeconds = Date.parse(dateProperty);
    let formattedDate = new Date(dateMiliSeconds).toDateString();
    let dateArr = formattedDate.split(" ");
    const newDateArr = [dateArr[2], dateArr[1], dateArr[3]];
    return newDateArr.join(" ");
  }

  //Sets the current stat of all data from the API
  function updateData(resData) {
    setData({
      ...data,
      avatarPic: resData.avatar_url,
      name: resData.name,
      handle: `@${resData.login}`,
      dateJoined: formatDate(resData.created_at),
      bio: resData.bio,
      repos: resData.public_repos,
      followers: resData.followers,
      following: resData.following,
      location: resData.location,
      blog: resData.blog,
      twitter: resData.twitter_username,
      company: resData.company,
    });
  }

  //function that makes a get request to the github api
  async function getUser(userInput) {
    try {
      const res = await axios.get(BASE_URL + `${userInput}`);
      updateData(res.data);
    } catch (error) {
      setIsError(true);
    }
  }
  useEffect(() => {
    getUser("octocat");
  }, []);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
      <div className="App">
        <Title themeToggler={themeToggler} theme={theme} />
        <SearchBar
          getUser={getUser}
          data={data}
          isError={isError}
          setIsError={setIsError}
        />
        <ProfileCard data={data} />
        <Footer/>
      </div>
      
    </ThemeProvider>
  );
}

export default App;

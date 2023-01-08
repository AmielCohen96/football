import './App.css';
import React from "react";
import axios from "axios";
import {BrowserRouter, Routes, Route, NavLink} from "react-router-dom";
import HomePage from "./HomePage";
import History from "./History";
import MostGoals from "./MostGoals";
import Stats from "./Stats";
import Table from "./Table";

const navLinkStyle = ({isActive}) =>isActive? {
    backgroundColor: "green",
    color: "white"
    }:{
    color: "black"
}



class App extends React.Component {

  state = {
      team_name: 'none',
      result: 0,
      teamsData: [],
      teamsName: '',
      leagueData: [],
      leagueName: 'none',
      leagueId: ''
  }



  render() {
    return (
        <div className="App">
            <style>{'body {background-image: url("https://www.yo-yoo.co.il/pics/uploads/35a18f.jpg");}'}</style>
            <div style={{fontWeight: "bold", fontSize: "50px", color: "white"}}></div>
            <div>
                <BrowserRouter>
                    <div className={"toolbar"}>
                        <NavLink style={navLinkStyle} to={"/"} className={"nav"}>Home</NavLink>
                        <NavLink style={navLinkStyle} to={"/Table"} className={"nav"}>Table</NavLink>
                        <NavLink style={navLinkStyle} to={"/Stats"} className={"nav"}>Stats</NavLink>
                        <NavLink style={navLinkStyle} to={"/MostGoals"} className={"nav"}>Most Goals</NavLink>
                        <NavLink style={navLinkStyle} to={"/History"} className={"nav"}>History</NavLink>
                    </div>
                    <div>

                        <Routes>
                            <Route path={"/"} element={<HomePage />}/>
                            <Route path={"/Table"} element={<Table />}/>
                            <Route path={"/Stats"} element={<Stats />}/>
                            <Route path={"/MostGoals"} element={<MostGoals />}/>
                            <Route path={"/History"} element={<History />}/>
                        </Routes>
                    </div>

                </BrowserRouter>
                <br/>
            </div>

        </div>
      );
    }
}

export default App;


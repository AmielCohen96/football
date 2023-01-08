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
      team_name: 1,
      result: 0,
      teamsData: [],
      teamsName: '',
      leagueData: [],
      leagueName: 'none',
      leagueId: ''
  }



    leagueNameChanged = (event) => {
        let id;
        if(event.target.value===("English"))
        {
            id=1
        }
        else if(event.target.value===("Spanish"))
        {
            id=2
        }
        else {
            id=3
        }
        this.setState({
            leagueName: event.target.value,
            leagueId:id
        });
    }

    getLeagueData = () => {
        axios.get("https://app.seker.live/fm1/leagues")
            .then((response) => {
                let leaguesTemp=[]
                response.data.map((item) => {
                    let leagues=item.name
                    leaguesTemp.push(leagues)
                })
                this.setState({
                    leagueData: leaguesTemp,
                })
            });
    }

    componentDidMount() {
      this.getLeagueData();
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
                    <br/>
                    <select value={this.state.leagueName} onChange={this.leagueNameChanged}>
                        <option value={"none"} disabled={true}>SELECT LEAGUE</option>
                        {
                            this.state.leagueData.map((item) => {
                              return (
                                    <option value={item}>{item}</option>
                                )
                            })
                        }
                    </select>
                    <div>
                        <Routes>
                            <Route path={"/"} element={<HomePage id={this.state.leagueId} league={this.state.leagueName}/>}/>
                            <Route path={"/Table"} element={<Table id={this.state.leagueId} league={this.state.leagueName}/>}/>
                            <Route path={"/Stats"} element={<Stats id={this.state.leagueId} league={this.state.leagueName}/>}/>
                            <Route path={"/MostGoals"} element={<MostGoals id={this.state.leagueId} league={this.state.leagueName}/>}/>
                            <Route path={"/History"} element={<History id={this.state.leagueId} league={this.state.leagueName}/>}/>
                        </Routes>
                    </div>

                </BrowserRouter>
            </div>
        </div>
      );
    }
}

export default App;


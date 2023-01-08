import './App.css';
import React from "react";
import axios from "axios";
import {BrowserRouter, Routes, Route, NavLink} from "react-router-dom";
import History from "./History";
import MostGoals from "./MostGoals";
import Stats from "./Stats";
import Table from "./Table";



const navLinkStyle = ({isActive}) =>isActive? {
    backgroundColor: "black",
    color: "white"
    }:{
    color: "black"
}


class App extends React.Component {

  state = {
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

    noneClick = () => {
      this.setState({
          leagueName: 'none'
      })
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
            <style>{'body {background-image: url("https://www.davar1.co.il/wp-content/uploads/2017/04/090417_soccer.jpg");}'}</style>
            <div style={{fontWeight: "bold", fontSize: "50px", color: "white"}}></div>
            <div>
                <BrowserRouter>
                    <div className={"toolbar"}>
                        <NavLink style={navLinkStyle} to={"/Table"} className={"nav"} onClick={this.noneClick}>Table</NavLink>
                        <NavLink style={navLinkStyle} to={"/Stats"} className={"nav"} onClick={this.noneClick}>Stats</NavLink>
                        <NavLink style={navLinkStyle} to={"/MostGoals"} className={"nav"} onClick={this.noneClick}>Most Goals</NavLink>
                        <NavLink style={navLinkStyle} to={"/History"} className={"nav"} onClick={this.noneClick}>History</NavLink>
                    </div>
                    <br/>
                    <div className={"League select"} style={{color:"white"}}>
                        Please choose league:
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
                    </div>
                    <div>
                        <Routes>
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


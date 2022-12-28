import React from "react";
import axios from "axios";


let team = {name: "", goals: null, points: null}
let leagues_temp = []
let teams_temp = []

class Table extends React.Component{
    state = {
        team_name: 'none',
        result: 0,
        teamsData: [],
        teamsName: '',
        leagueData: [],
        leagueName: 'none',
        leagueId: '',
    }
    team = {name: "", goals: null, points: null}
    leagues_temp = []
    teams_temp = []


    leagueNameChanged = (event) => {
        this.setState({
            leagueName: event.target.value
        })
    }


    createObject = (data) => {
        let tempArray = [];
        data.map((item) => {
            let team = {name: item.name, goals: item.id, points: 15}
            tempArray.push(team)
        })
        this.setState({
            teamsData: tempArray
        })
    }

    getTeamData = () => {
        axios.get("https://app.seker.live/fm1/teams/"+1)
            .then((response) => {
                this.createObject(response.data)
            });
        }

    getLeagueData = () => {
        axios.get("https://app.seker.live/fm1/leagues")
            .then((response) => {
                response.data.map((item) => {
                    leagues_temp.push(item.name)
                })
                this.setState({
                    leagueData: leagues_temp
                })
            });
    }


    componentDidMount() {
        this.getLeagueData();
        this.getTeamData();
    }

    render() {
        return(
            <div className="TB">
                <br/>
                <div>
                    {this.state.leagueData}
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
                <br/>
                <br/>
                <br/>
                <table width="50%" border="1">
                    <thead>
                    <tr>
                        <th>Team</th>
                        <th>Goal Difference</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                        {this.state.teamsData.map((item) => {
                           return (
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{item.goals}</td>
                                    <td>{item.points}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}


export default Table
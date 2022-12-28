import React from "react";
import axios from "axios";

class Table extends React.Component{
    state = {
        team_name: 'none',
        result: 0,
        teamsData: [{name: "", goals: null, points: null}],
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


    createObject = (x) => {
        this.team.name = x
        this.team.points = 15
        this.team.goals = 23
        this.teams_temp.push(this.team)
        this.setState({
            teamsData: this.teams_temp
        })
    }

    getTeamData = () => {
        axios.get("https://app.seker.live/fm1/teams/"+1)
            .then((response) => {
                response.data.map((item) => {
                    this.createObject(item.name)
                })
            });
    }

    getLeagueData = () => {
        axios.get("https://app.seker.live/fm1/leagues")
            .then((response) => {
                response.data.map((item) => {
                    this.leagues_temp.push(item.name)
                })
                this.setState({
                    leagueData: this.leagues_temp
                })
            });
    }


    componentDidMount() {
        this.getLeagueData();
        this.getTeamData();
    }

    render() {
        return(
            <div className="ChooseLeague">
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
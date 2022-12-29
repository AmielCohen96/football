import React from "react";
import axios from "axios";



class Table extends React.Component{
    state = {
        team_name: 'none',
        teamId: 60,
        result: 0,
        teamsData: [],
        teamsName: '',
        leagueData: [],
        leagueName: 'none',
        leagueId: '',
        goalsCounter: 0
    }
    leagues_temp = []
    teams_temp = []


    leagueNameChanged = (event) => {
        this.setState({
            leagueName: event.target.value
        })
    }

    goalsCount = (tId) => {
        let goal_counter = 0
        let home_away = false
        axios.get("https://app.seker.live/fm1/history/1/"+tId)
            .then((response) => {
                response.data.map((item) => {
                    if(item.homeTeam.id === tId){
                        home_away = true
                    }
                    else {
                        home_away = false
                    }
                    item.goals.map((goal) => {
                        if(goal.home === home_away){
                            goal_counter = goal_counter + 1
                        }
                        else {
                            goal_counter = goal_counter - 1
                        }
                    })
                })
            });
        this.setState({
            goals_counter: goal_counter
        })
    }

    createObject = (data) => {
        let tempArray = [];
        data.map((item) => {
            this.goalsCount(this.state.teamId);
            let team = {name: item.name, goals: this.state.goalsCounter, points: 15}
            tempArray.push(team)
        })
        this.setState({
            teamsData: tempArray,
            goalsCounter: 0
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
            <div className="TB">
                <br/>
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
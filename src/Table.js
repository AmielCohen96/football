import React from "react";
import axios from "axios";
import './App.css';
import History from "./History"
import mostGoals from "./MostGoals";
import {includes} from "react-table/src/filterTypes";
import {render} from "@testing-library/react";



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
        goalsCounter: 0,
        team_count: 0,
        leagueNum:0
    }
    leagues_temp = []
    pl = 1
    teams_temp = []
    goal_count_temp = 0



    leagueNameChanged = async (event) => {
        this.setState({
            // leagueName: event.target.value,
            leagueId: event.target.value
        })
        this.getTeamData()
    }

    getLeagueData =  () => {
        let data = []
        axios.get("https://app.seker.live/fm1/leagues")
            .then((response) => {
                response.data.map((item) => {
                    data.push(item.id)
                    this.setState({
                        leagueData : data
                    })
                })
            });

    }




    createObject = (teamsData) => {
        let tempArray = [];
        let home_away = false
        teamsData.map((item) => {
            let tId = item.id
            let tName = item.name
            let totalGoals = 0
            let points = 0
            axios.get(`https://app.seker.live/fm1/history/1/${tId}`)
                .then((response) => {
                    response.data.map((history) => {
                        let goalsFor = 0
                        let goalAgainst = 0
                        if(history.homeTeam.id === tId){
                            home_away = true
                        }
                        else {
                            home_away = false
                        }
                        history.goals.map((goal) => {
                            if(goal.home === home_away){
                                totalGoals = totalGoals + 1
                                goalsFor = goalsFor +1
                            }
                            else {
                                totalGoals = totalGoals - 1
                                goalAgainst = goalAgainst + 1
                            }
                            console.log(tName + ' Goals: ' + totalGoals)
                        })
                        if(goalAgainst === goalsFor){
                            points = points + 1
                        }
                        else if (goalsFor > goalAgainst){
                            points = points + 3
                        }
                    })
                    let team = {place: 0, name: item.name, goals: totalGoals, points: points}
                    tempArray.push(team)
                    tempArray = tempArray.sort((a,b) => {
                        if(a.points > b.points){
                            return -1
                        }
                        if(a.points === b.points){
                            if (a.goals > b.goals){
                                return -1
                            }
                            if (a.goals === b.goals){
                                if ((a.name < b.name)){
                                    return -1
                                }
                            }
                        }
                    })
                    this.setState({
                        teamsData: tempArray,
                    })
                });
        })

    }

    getTeamData = () => {
        axios.get(`https://app.seker.live/fm1/teams/1`)
            .then((response) => {
                this.createObject(response.data)
            });


    }

    handleClick = ()=>{
        let tempPlayerArr = []
        axios.get("https://app.seker.live/fm1/squad/1/602")
            .then((response) => {
                response.data.map((item) => {
                    console.log(item.firstName)
                    let player = {fName: item.firstName, lName:item.lastName}
                    tempPlayerArr.push(player)
                })
                alert(tempPlayerArr.length)

            })
    }



    componentDidMount() {
        this.getLeagueData();
        this.getTeamData()

    }


    render() {
        return(
            <div className="TB">
                <br/>
                {this.state.leagueId}
                <br/>
                <select value={this.state.leagueId} onChange={this.leagueNameChanged}>
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
                        <th>place</th>
                        <th>Team</th>
                        <th>Goal Difference</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.teamsData.map((item) => {
                        return (
                            <tr>
                                <td>{this.pl}</td>
                                <td onClick={this.handleClick}> {item.name}</td>
                                <td>{item.goals}</td>
                                <td>{item.points}</td>
                            </tr>
                        );
                    })
                    }
                    </tbody>
                </table>
                <div>yossi</div>
            </div>

        )
    }
}


export default Table
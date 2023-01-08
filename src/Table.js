import React from "react";
import axios from "axios";
import './App.css';
import History from "./History"
import mostGoals from "./MostGoals";
import App from "./App";


class Table extends React.Component{

    state = {
        team_name: 'none',
        teamId: 60,
        result: 0,
        teamsData: [],
        teamsName: '',
        leagueData: [],
        leagueName: 'none',
        leagueId: 0,
        goalsCounter: 0,
        team_count: 0,
        leaguesId:[],
        playerArray:[],
        scoreData:[],
        display:false
    }
    leagues_temp = []
    pl = 1
    teams_temp = []
    goal_count_temp = 0


    createObject = async (teamsData) => {
        let tempArray = [];
        let home_away = false
        let i=1
        teamsData.map((item) => {
            let teamId = item.id
            // let teamName = item.name
            let totalGoals = 0
            let points = 0
            // alert(teamId)
            axios.get("https://app.seker.live/fm1/history/"+this.props.id+"/"+teamId)
                .then((response) => {
                    response.data.map((history) => {
                        let goalsFor = 0
                        let goalAgainst = 0
                        if(history.homeTeam.id === teamId){
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
                        })
                        if(goalAgainst === goalsFor){
                            points = points + 1
                        }
                        else if (goalsFor > goalAgainst){
                            points = points + 3
                        }
                    })

                    let team = {teamsId:teamId,place: i, name: item.name, goals: totalGoals, points: points}
                    i=i+1
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
            axios.get("https://app.seker.live/fm1/teams/"+this.props.id )
                .then((response) => {
                    return(this.createObject(response.data))
                })
    }



    dataOnClicked=(teamsId)=>{
        let tempPlayerArr = []
        let id=1
        axios.get("https://app.seker.live/fm1/squad/" + this.props.id + "/" + teamsId)
            .then((response)=>
            {
                response.data.map((item) => {
                    let player = {idPlayer: id,fName: item.firstName, lName:item.lastName}
                    id++
                    tempPlayerArr.push(player)
                })
                this.setState({
                    playerArray:tempPlayerArr
                })
            })
    }

    getHistoryData = (id,teamId) => {
        let tempArray = [];
            axios.get("https://app.seker.live/fm1/history/"+ this.props.id +"/" + teamId)
                .then((response) => {
                    response.data.map((item) => {
                            let home1 = ''
                            let homeGoals = 0
                            let awayGoals = 0
                            let away = ''
                            home1 = item.homeTeam.name
                            away = item.awayTeam.name
                            item.goals.map((goal) => {
                                if (goal.home === true) {
                                    return(homeGoals = homeGoals + 1)
                                } else {
                                    return(awayGoals = awayGoals + 1)
                                }
                            })
                            let score = { homeTeam: home1, homeScore: homeGoals,
                                awayScore: awayGoals, awayTeam: away}
                            tempArray.push(score)
                            return(
                                this.setState({
                                    scoreData: tempArray
                                })
                            )
                    });
                })
    }

    buttonClicked=()=>{
        this.getTeamData()
    }



    render() {
        return(
            <div className="TB">
                {this.props.league !=="none"&&
                    <div>
                        <br/>
                        <div>
                            <button onClick={this.buttonClicked} disabled={this.props.league ==="none"}>Refresh</button>
                        </div>
                        <br/>
                        <table width="60%" border="2" bgcolor={"white"}>
                            <thead>
                            <tr>
                                <th style={{color:"black"}}>place</th>
                                <th style={{color:"black"}}>Team</th>
                                <th style={{color:"black"}}>Goal Difference</th>
                                <th style={{color:"black"}}>Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.teamsData.map((item,index) => {
                                return (
                                    <tr
                                        className={index === 0 ? 'firsRow' : index >
                                        this.state.teamsData.length - 4 ? 'lastThreeRows' : ''}
                                    >
                                        <td style={{color:"black"}}>{index+1}</td>
                                        <td style={{color:"black"}} onClick={ ()=>{
                                            this.dataOnClicked(item.teamsId)
                                            this.getHistoryData(this.state.leagueId,item.teamsId)
                                            this.setState({
                                                display:true
                                            })
                                        }
                                        }>{item.name}</td>
                                        <td style={{color:"black"}}>{item.goals}</td>
                                        <td style={{color:"black"}}>{item.points}</td>
                                    </tr>
                                );
                            })
                            }
                            </tbody>
                        </table>
                        <div style={{backgroundColor:'whitesmoke'}}>
                            <ul>
                                {this.state.display && <label>squad:</label>}
                                {this.state.playerArray.map(item =>(
                                    <li>
                                        {item.fName + " " + item.lName}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{backgroundColor:'whitesmoke'}}>
                            <ul>
                                {this.state.display &&<label>history:</label>}
                                {this.state.scoreData.map(item =>(
                                    <li>
                                        {item.homeTeam + " " + item.homeScore + "- " +item.awayScore + " " +item.awayTeam }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                }
            </div>
        )
    }
}


export default Table
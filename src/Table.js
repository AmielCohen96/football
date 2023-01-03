import React from "react";
import axios from "axios";
import './App.css';
import mostGoals from "./MostGoals";



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
        this.getTeamData(id)




    }

    // leagueIdChange=()=>{
    //     let id=0
    //         for (let i=0;i<3;i++)
    //         {
    //             if (this.state.leagueName===this.state.leagueData[i]) {
    //                 id = this.state.leaguesId[i]
    //                 break
    //             }
    //         }
    //     this.setState({
    //         leagueId : id
    //     })
    //
    //
    //
    // }




    createObject = async (teamsData) => {
        let tempArray = [];
        let home_away = false
        let i=1
        teamsData.map((item) => {
            let tId = item.id
            let tName = item.name
            let totalGoals = 0
            let points = 0
            // alert(tId)
            axios.get("https://app.seker.live/fm1/history/"+this.state.leagueId+"/"+tId)
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
                            // console.log(tName + ' Goals: ' + totalGoals)
                        })
                        if(goalAgainst === goalsFor){
                            points = points + 1
                        }
                        else if (goalsFor > goalAgainst){
                            points = points + 3
                        }
                    })

                    let team = {teamsId:tId,place: i, name: item.name, goals: totalGoals, points: points}
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

    getTeamData =  (id) => {

            axios.get("https://app.seker.live/fm1/teams/"+id )
                .then((response) => {
                    this.createObject(response.data)
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
    dataOnClicked=(teamsId)=>{
        let tempPlayerArr = []
        let id=1
        axios.get("https://app.seker.live/fm1/squad/" + this.state.leagueId + "/" + teamsId)

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
    getHistoryData = (id,tId) => {
        let tempArray = [];
            axios.get("https://app.seker.live/fm1/history/"+id +"/" + tId)
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


    componentDidMount() {
        this.getLeagueData();
        // this.leagueNameChanged()
        // this.getTeamData();

    }

    render() {
        return(
            <div className="TB">
                <br/>
                {this.state.leagueId}
                <br/>
                <select value={this.state.leagueName}  onChange={this.leagueNameChanged} >
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
                                <td>{item.place}</td>
                                <td onClick={ ()=>{
                                    alert(item.teamsId)
                                    this.dataOnClicked(item.teamsId)
                                    this.getHistoryData(this.state.leagueId,item.teamsId)
                                    this.setState({
                                        display:true
                                    })
                                }

                                }>{item.name}</td>
                                <td>{item.goals}</td>
                                <td>{item.points}</td>
                            </tr>
                        );
                    })
                    }
                    </tbody>

                </table>
                <div>
                    <ul>
                        {this.state.display && <label>squad</label>}
                        {this.state.playerArray.map(item =>(
                            <li>

                                {item.fName + " " + item.lName}

                            </li>

                        ))}
                    </ul>

                </div>
                <div>
                    <ul>
                        {this.state.display &&<label>history</label>}
                        {this.state.scoreData.map(item =>(

                            <li>
                                {item.homeTeam + " " + item.homeScore + "- " +item.awayScore + " " +item.awayTeam }

                            </li>

                        ))}
                    </ul>

                </div>
            </div>

        )
    }
}


export default Table
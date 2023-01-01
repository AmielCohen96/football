import React from "react";
import axios, {get} from "axios";
//
//
//
// class Table extends React.Component{
//     state = {
//         team_name: 'none',
//         teamId: 300,
//         result: 0,
//         teamsData: [],
//         teamsName: '',
//         leagueData: [],
//         leagueName: 'none',
//         leagueId: '',
//         goalsCounter:0,
//     }
//     leagues_temp = []
//     teams_temp = []
//
//
//     leagueNameChanged = (event) => {
//         this.setState({
//             leagueName: event.target.value
//         })
//     }
//
//     goalsCount = (tId) => {
//         return new Promise((resolve, reject) => {
//             let goal_counter = 0
//             let home_away = false
//             let goal
//             axios.get("https://app.seker.live/fm1/history/1/" + tId)
//                 .then((response) => {
//                     response.data.map((item) => {
//                         if (item.homeTeam.id === tId) {
//                             home_away = true
//                         } else {
//                             home_away = false
//                         }
//                         item.goals.map((goal) => {
//                             if (goal.home === home_away) {
//                                 goal_counter = goal_counter + 1
//                             } else {
//                                 goal_counter = goal_counter - 1
//                             }
//                         });
//                         goal=goal_counter
//                     });
//                     resolve (goal);
//                 });
//         });
//     };
//
//
//     goalDiffrence= async (tId) =>{
//         let goalCounter= await this.goalsCount(tId);
//         this.setState({
//             goalsCounter:goalCounter,
//         });
//         // alert(this.state.goalsCounter)
//     }
//
//     createObject = async (data) => {
//         let tempArray = [];
//         for(const item of data) {
//             await this.goalDiffrence(item.id)
//             // alert(this.state.goalsCounter)
//             let team = {name: item.name, goal: this.state.goalsCounter, points: 15}
//             tempArray.push(team)
//         }
//         this.setState({
//             teamsData: tempArray,
//         })
//     }
//
//     getTeamData = () => {
//         axios.get("https://app.seker.live/fm1/teams/"+1)
//             .then((response) => {
//                 this.createObject(response.data)
//             });
//         }
//
//     getLeagueData = () => {
//         axios.get("https://app.seker.live/fm1/leagues")
//             .then((response) => {
//                 response.data.map((item) => {
//                     this.leagues_temp.push(item.name)
//                 })
//                 this.setState({
//                     leagueData: this.leagues_temp
//                 })
//             });
//     }
//
//
//     componentDidMount() {
//         this.getLeagueData();
//         this.getTeamData();
//
//     }


//     render() {
//         return(
//             <div className="TB">
//                 <br/>
//                 <br/>
//                 <select value={this.state.leagueName} onChange={this.leagueNameChanged}>
//                     <option value={"none"} disabled={true}>SELECT LEAGUE</option>
//                     {
//                         this.state.leagueData.map((item) => {
//                             return (
//                                 <option value={item}>{item}</option>
//                             )
//                         })
//                     }
//                 </select>
//                 <br/>
//                 <br/>
//                 <br/>
//                 <table width="50%" border="1">
//                     <thead>
//                     <tr>
//                         <th>Team</th>
//                         <th>Goal Difference</th>
//                         <th>Points</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                         {this.state.teamsData.map((item) => {
//                            return (
//                                 <tr>
//                                     <td>{item.name}</td>
//                                     <td>{item.goal}</td>
//                                     <td>{item.points}</td>
//                                 </tr>
//                             );
//                         })
//                     }
//                     </tbody>
//                 </table>
//             </div>
//         )
//     }
// }

class Table extends React.Component {
    state = {
        teamsData: [],
        leagueData: [],
        leagueName: 'none',
        leagueId: '',
    }


    createObjects = async (teams) => {
        let tempArray = [];
        for (const team of teams) {
            const goalDifference = await this.getGoalDifference(team.id);
            const teamObject = { name: team.name, goalDifference: goalDifference };
            tempArray.push(teamObject);
        }
        this.setState({ teamsData: tempArray });
    }

    getGoalDifference = (teamId) => {
        return new Promise((resolve, reject) => {
            axios.get(`https://app.seker.live/fm1/history/1/${teamId}`)
                .then((response) => {
                    let goalDifference = 0;
                    response.data.map((game) => {
                        game.goals.map((goal) => {
                            if (goal.home) {
                                goalDifference += 1;
                            } else {
                                goalDifference -= 1;
                            }
                        });
                    });
                    resolve(goalDifference);
                });
        });
    }

    getLeagueData = () => {
        const leagues_temp=[]
        axios.get("https://app.seker.live/fm1/leagues")
            .then((response) => {
                response.data.map((item) => {
                    // const leagues_data={ name: item.name, id: item.id };
                    // leagues_temp.push(item.name)
                    leagues_temp.push(item.name)

                })
                this.setState({
                    leagueData: leagues_temp,
                })
            });
    }
    leagueNameChanged = (event) => {
        this.setState({
            leagueName: event.target.value
        })
    }

    getLeagueId =(event) =>{
        this.setState({
            leagueId: event.target.id
        })
    }

    componentDidMount() {
        axios.get('https://app.seker.live/fm1/teams/1')
            .then((response) => {
                this.createObjects(response.data);
            });
        this.getLeagueData();
    }

    render() {
        return (
            <div className="TB">
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
            <table width="50%" border="1">
                <thead>
                <tr>
                    <th>Team</th>
                    <th>Goal Difference</th>
                </tr>
                </thead>
                <tbody>
                {this.state.teamsData.map((team) => {
                    return (
                        <tr>
                            <td>{team.name}</td>
                            <td>{team.goalDifference}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            </div>

        );
    }
}
export default Table
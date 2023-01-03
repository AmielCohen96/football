import React from "react";
import axios from "axios";
import './App.css';


class MostGoals extends React.Component{

    state = {
        scorerData: [],
        top3: [],
        leagueData: [],
        leagueName: 'none',
        leagueId: '',
        table: [],
        loadingData: false
    }
    leagues_temp = []
    tempArray = []


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
        this.topThree(id)

    }

    topThree = (id) => {
        this.getTopScorerData(id);
        let slicedArray = []
        console.log(slicedArray)
        setTimeout(()=>{
            slicedArray = this.state.scorerData.slice(0,3)
            this.setState({
                top3: slicedArray,
                loadingData: false
            })
        },10*300)
    }

    getTopScorerData = (leaguesId) => {
        axios.get("https://app.seker.live/fm1/teams/"+3)
            .then((response) => {
                response.data.map((team) => {
                    axios.get("https://app.seker.live/fm1/squad/" + 3 + "/" + team.id)
                        .then((response) => {
                            response.data.map((player) => {
                                let playerId = player.id
                                let first = player.firstName
                                let last = player.lastName
                                let goalCounter = 0
                                axios.get("https://app.seker.live/fm1/history/" + 3 + "/" + team.id)
                                    .then((response) => {
                                        response.data.map((game) => {
                                            game.goals.map((goal) => {
                                                if (playerId === goal.scorer.id) {
                                                    goalCounter = goalCounter + 1
                                                }
                                            })
                                        })
                                        let scorer = {first_Name: first, last_Name: last, goalsScore: goalCounter}
                                        this.tempArray.push(scorer)
                                        this.tempArray = this.tempArray.sort((a,b) => {
                                            if (a.goalsScore > b.goalsScore) {
                                                return -1
                                            }
                                        })
                                        this.setState({
                                            scorerData: this.tempArray,
                                        })
                                    });
                            })
                        });

                })
            })
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
        this.setState({
            loadingData: true
        })
        this.getLeagueData();
        this.topThree();
        // this.getTopScorerData()
    }

    render() {
        return(
            <div className="MG">
                {
                    this.state.loadingData ?
                        <div style={{fontWeight: "bold", fontSize: "50px"}}><br/><br/>Please wait...</div>
                        :
                        <div>
                            <br/>
                            League:
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
                            <br/>
                            <table width="20%">
                                <thead>
                                <tr>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Goals</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.top3.map((item) => {
                                    return (
                                        <tr>
                                            <td>{item.first_Name}</td>
                                            <td>{item.last_Name}</td>
                                            <td>{item.goalsScore}</td>
                                        </tr>
                                    );
                                })
                                }
                                </tbody>
                            </table>
                        </div>
                }
            </div>
        )
    }
}

export default MostGoals

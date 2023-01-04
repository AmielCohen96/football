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


    leagueNameChanged = (event) => {
        let id;
        let tempArr=[]
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
            leagueId:id,
            // scorerData:tempArr
        });
        this.topThree(id)
    }

    topThree = (id) => {
        this.getTopScorerData(id);
        let slicedArray = []
        setTimeout(()=>{
            slicedArray = this.state.scorerData.slice(0,3)
            console.log(slicedArray)
            this.setState({
                top3: slicedArray,
                loadingData: false
            })
        },10*80)
    }

    getTopScorerData = (leaguesId) => {
        let tempArray = []
        axios.get("https://app.seker.live/fm1/teams/"+leaguesId)
            .then((response) => {
                response.data.map((team) => {
                    axios.get("https://app.seker.live/fm1/squad/" + leaguesId + "/" + team.id)
                        .then((response) => {
                            response.data.map((player) => {
                                let playerId = player.id
                                let first = player.firstName
                                let last = player.lastName
                                let goalCounter = 0
                                axios.get("https://app.seker.live/fm1/history/" + leaguesId + "/" + team.id)
                                    .then((response) => {
                                        response.data.map((game) => {
                                            game.goals.map((goal) => {
                                                if (playerId === goal.scorer.id) {
                                                    goalCounter = goalCounter + 1
                                                }
                                            })
                                        })
                                        let scorer = {first_Name: first, last_Name: last, goalsScore: goalCounter}
                                        tempArray.push(scorer)
                                        tempArray = tempArray.sort((a,b) => {
                                            if (a.goalsScore > b.goalsScore) {
                                                return -1
                                            }
                                        })
                                        this.setState({
                                            scorerData: tempArray,
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
                    // this.state.loadingData ?
                    //     <div style={{fontWeight: "bold", fontSize: "50px"}}><br/><br/>Please wait...</div>
                    //     :
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
                                <thead style={{color:"white"}}>
                                <tr>
                                    <th >First Name</th>
                                    <th>Last Name</th>
                                    <th>Goals</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.top3.map((item) => {
                                    return (
                                        <tr>
                                            <td style={{color:"white"}}>{item.first_Name}</td>
                                            <td style={{color:"white"}}>{item.last_Name}</td>
                                            <td style={{color:"white"}}>{item.goalsScore}</td>
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

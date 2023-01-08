import React from "react";
import axios from "axios";
import './App.css';


class MostGoals extends React.Component{

    state = {
        scorerData: [],
        top3: [],
        change: 'none',
        loadingData: false
    }



    topThree = () => {
        this.getTopScorerData(this.props.id);
        let slicedArray = []
        if(this.props.id === 1 || this.props.id === 2 || this.props.id === 3)
        {
            this.setState({
                change: 1
            })
        }
        setTimeout(()=>{
            slicedArray = this.state.scorerData.slice(0,3)
            this.setState({
                top3: slicedArray,
                loadingData: false,
            })
        },10*80)
    }

    getTopScorerData = () => {
        let tempArray = []
        axios.get("https://app.seker.live/fm1/teams/"+this.props.id)
            .then((response) => {
                response.data.map((team) => {
                    axios.get("https://app.seker.live/fm1/squad/" + this.props.id + "/" + team.id)
                        .then((response) => {
                            response.data.map((player) => {
                                let playerId = player.id
                                let first = player.firstName
                                let last = player.lastName
                                let goalCounter = 0
                                axios.get("https://app.seker.live/fm1/history/" + this.props.id + "/" + team.id)
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

    buttonClicked=()=>{
        this.topThree();
        this.getTopScorerData()
        this.setState({
            loadingData: true
        })
    }


    render() {
        return(
            <div className="MG">
                {
                    this.state.loadingData ?
                        <div style={{fontWeight: "bold",color:"white", fontSize: "50px"}}><br/><br/>Please wait...</div>
                        :
                        <div>
                            <br/>
                            <div>
                                <button onClick={this.buttonClicked} disabled={this.props.league ==="none"}>Refresh</button>
                            </div>
                            {this.state.change !== "none" &&
                                <div>
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
                }
            </div>
        )
    }
}

export default MostGoals

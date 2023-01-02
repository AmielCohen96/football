import React from "react";
import axios from "axios";
import './App.css';


class History extends React.Component{

    state = {
        scoreData: [],
        leagueData: [],
        leagueName: 'none',
        leagueId: '',
        startRound: 1,
        endRound: 15,
        roundsList: []
    }
    leagues_temp = []


    leagueNameChanged = (event) => {
        this.setState({
            leagueName: event.target.value,
        })
    }

    startRoundChanged = (event) => {
        this.setState({
            startRound: event.target.value,
        })
    }

    endRoundChanged = (event) => {
        this.setState({
            endRound: event.target.value,
        })
    }


    howManyRounds = () => {
        axios.get("https://app.seker.live/fm1/history/"+1)
            .then((response) => {
                response.data.map((item) => {
                    this.setState({
                        endRound: item.round
                    })
                })
            })
        this.makeList();
    }

    makeList = () => {
        let tempList = []
        for (let i = this.state.startRound; i <= this.state.endRound; i++) {
            tempList.push(i)
            this.setState({
                roundsList: tempList
            })
        }
    }

    getHistoryData = () => {
        let tempArray = [];
        if(this.state.endRound >= this.state.startRound){
            axios.get("https://app.seker.live/fm1/history/"+1)
                .then((response) => {
                    response.data.map((item) => {
                        let round = item.round
                        if(round >= this.state.startRound && round <= this.state.endRound){
                            let home = ''
                            let homeGoals = 0
                            let awayGoals = 0
                            let away = ''
                            home = item.homeTeam.name
                            away = item.awayTeam.name
                            item.goals.map((goal) => {
                                if (goal.home === true) {
                                    return(homeGoals = homeGoals + 1)
                                } else {
                                    return(awayGoals = awayGoals + 1)
                                }
                            })
                            let score = {roundNumber: round, homeTeam: home, homeScore: homeGoals,
                                awayScore: awayGoals, awayTeam: away}
                            tempArray.push(score)
                            return(
                                this.setState({
                                    scoreData: tempArray
                                })
                            )
                        }
                    });
                })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.getHistoryData();
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
        this.getHistoryData();
        this.howManyRounds();
    }



    render() {
        return(
            <div className="HS">
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
                Start Round:
                <br/>
                <select value={this.state.startRound} onChange={this.startRoundChanged}>
                    <option value={"none"} disabled={true}>SELECT Start Round</option>
                    {
                        this.state.roundsList.map((item) => {
                            return (
                                <option value={item}>{item}</option>
                            )
                        })
                    }
                </select>
                <br/>
                <br/>
                End Round:
                <br/>
                <select value={this.state.endRound} onChange={this.endRoundChanged}>
                    <option value={"none"} disabled={true}>SELECT End Round</option>
                    {
                        this.state.roundsList.map((item) => {
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
                <table width="50%">
                    <thead>
                    <tr>
                        <th>Round</th>
                        <th>Home team</th>
                        <th>Home goals</th>
                        <th>vs</th>
                        <th>Away goals</th>
                        <th>Away team</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.scoreData.map((item) => {
                        return (
                            <tr>
                                <td>{item.roundNumber}</td>
                                <td>{item.homeTeam}</td>
                                <td>{item.homeScore}</td>
                                <td>-</td>
                                <td>{item.awayScore}</td>
                                <td>{item.awayTeam}</td>
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

export default History
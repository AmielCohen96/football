import React from "react";
import axios from "axios";
import './App.css';



class Stats extends React.Component{

    state = {
        team_name: 'none',
        leagueData: [],
        leagueName: 'none',
        leagueId: '',
        firstHalfGoals: 0,
        secondHalfGoals: 0,
        fastGoal: 0,
        lateGoal: 100,
        lowRound: null,
        lowRoundName: null,
        highRound: null,
        highRoundName: null
    }

    leagues_temp = []

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
        this.getData(id)
    }

    firstOrSecond = (data) => {
        let first = 0
        let second = 0
        data.map((history) => {
            history.goals.map((goal) => {
                if(goal.home === true){
                    first = first + 1
                }
                else {
                    second = second + 1
                }
            })
        })
        this.setState({
            firstHalfGoals: first,
            secondHalfGoals: second
        })
    }

    firstGoal = (data) => {
        let fastest = 100
        data.map((history) => {
            history.goals.map((goal) => {
                if(goal.minute < fastest){
                    fastest = goal.minute
                }
            })
        })
        this.setState({
            fastGoal: fastest
        })
    }

    latestGoal = (data) => {
        let latest = 0
        data.map((history) => {
            history.goals.map((goal) => {
                if(goal.minute > latest){
                    latest = goal.minute
                }
            })
        })
        this.setState({
            lateGoal: latest
        })
    }

    fewestGoalsRound = (data) => {
        let fewRound = 1000
        let currentRound = 1
        let goalCounter = 0
        let roundNumber
        data.map((history) => {
            if(currentRound === history.round)
                history.goals.map((goal) => {
                    goalCounter = goalCounter + 1
                })
            else {
                if (fewRound > goalCounter){
                    fewRound = goalCounter
                    roundNumber = currentRound
                }
                goalCounter = 1
                currentRound = currentRound + 1
            }
            console.log(goalCounter)
        })
        this.setState({
            lowRound: fewRound,
            lowRoundName: roundNumber
        })
    }

    mostGoalsRound = (data) => {
        let mostRound = 0
        let currentRound = 1
        let goalCounter = 0
        let roundNumber
        data.map((history) => {
            if(currentRound === history.round)
                history.goals.map((goal) => {
                    goalCounter = goalCounter + 1
                })
            else {
                if (mostRound < goalCounter){
                    mostRound = goalCounter
                    roundNumber = currentRound
                }
                goalCounter = 1
                currentRound = currentRound + 1
            }
            console.log(goalCounter)
        })
        this.setState({
            highRound: mostRound,
            highRoundName: roundNumber
        })
    }

    getData = (id) => {
        axios.get("https://app.seker.live/fm1/history/"+id)
            .then((response) => {
                this.firstOrSecond(response.data);
                this.firstGoal(response.data);
                this.latestGoal(response.data);
                this.fewestGoalsRound(response.data);
                this.mostGoalsRound(response.data);
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
        this.getLeagueData();
        this.getData();
    }


    render() {
        return(
            <div className="ST">
                <br/>
                {this.state.leagueId}
                <br/>
                {this.state.leagueName}
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
                <div style={{fontWeight: "bold", fontSize: "20px",color:"white"}} className={"TX"}>
                    First half Goals: {this.state.firstHalfGoals}
                    <br/><br/>
                    Second half Goals:{this.state.secondHalfGoals}
                    <br/><br/>
                    The fastest goal was scored in the {this.state.fastGoal}th minute
                    <br/><br/>
                    The latest goal was scored in the {this.state.lateGoal}th minute
                    <br/><br/>
                    The round with the most goals was round {this.state.highRoundName}, in which {this.state.highRound} goals were scored
                    <br/><br/>
                    The round with the fewest goals was round {this.state.lowRoundName}, in which {this.state.lowRound} goals were scored
                </div>
            </div>
        )
    }
}


export default Stats

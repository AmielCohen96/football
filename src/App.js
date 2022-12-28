import './App.css';
import React from "react";
import axios from "axios";

class App extends React.Component {

  state = {
      team_name: 'none',
      result: 0,
      teamsData: [],
      teamsName: '',
      leagueData: [],
      leagueName: 'none',
      leagueId: ''
  }
  leagues_temp = []
  teams_temp = []

  leagueNameChanged = (event) => {
    this.setState({
      leagueName: event.target.value
    })
  }

  teamNameChanged = (event) => {
        this.setState({
            leagueName: event.target.value
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

  getTeamData = () => {
      axios.get("https://app.seker.live/fm1/teams/"+ this.state.leagueId)
          .then((response) => {
              response.data.map((item) => {
                  this.teams_temp.push(item.name)
              })
              this.setState({
                  teamsData: this.teams_temp
              })
          });
    }

  componentDidMount() {
    this.getLeagueData();
    this.getTeamData();
  }


  render() {
    return (
        <div className="App">
            <div style={{fontWeight: "bold", fontSize: "20px"}}>leagues:</div>
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
            <select value={this.state.team_name} onChange={this.teamNameChanged}>
                <option value={"none"} disabled={true}>SELECT TEAM</option>
                {
                    this.state.teamsData.map((item) => {
                        return (
                            <option value={item}>{item}</option>
                        )
                    })
                }
            </select>
        </div>
      );
    }
}

export default App;


/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Grid, Row, Col, Table, FormGroup, ControlLabel, FormControl } from "react-bootstrap";
import { FormInputs } from "components/FormInputs/FormInputs.jsx";
import Card from "components/Card/Card.jsx";
import { thArray, tdArray } from "variables/Variables.jsx";
import Button from "components/CustomButton/CustomButton.jsx";
import AuthService from '../layouts/AuthService';
class TableList extends Component {
  constructor(props){
    super();
    this.Auth = new AuthService();
    this.state = {
      transactions: [],
      debug: true
    }
  
    this.calculateFieldsTrigger = this.calculateFieldsTrigger.bind(this);
    this.calculateFields = this.calculateFields.bind(this);
    this.loadTransactions = this.loadTransactions.bind(this);
    this.mycurrentdate = this.mycurrentdate.bind(this);
    
  }



componentDidMount(){
  this.calculateFieldsTrigger();
  this.loadTransactions();
}



loadTransactions = () => {
  let debug = this.state.debug;
  if(debug){
      var url = 'http://localhost:5000'
  } else {
      var url = 'http://157.245.47.65';
  }

    //Static header information
    let standardheader = {
      "Accept": "application/json",
      "Content-Type": "application/json", 
    }

    if (this.Auth.loggedIn()) {
      standardheader['Authorization'] = `${this.Auth.getToken()}`
  }
  
  return fetch(url + '/api/transactions', {
    method: "GET",
    mode: 'cors',
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': '*',
    headers: standardheader,
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((response) => {
            if(response.state === true){
                this.setState({transactions: response.data})
            } else {
              return false;
            }
    });


}


deleteTransaction = (e) => {
  //delete transaction to API
  const focusid = e.currentTarget.dataset.id
  const focusrow = parseInt(e.currentTarget.dataset.ids) + 1;

  var d = window.confirm("Vil du slette transaktion nr. " + focusrow + "?");
  if (d == true){

  //Start fetch setup
  let debug = this.state.debug;
  if(debug){
      var url = 'http://localhost:5000'
  } else {
      var url = 'http://157.245.47.65';
  }

    //Static header information
    let standardheader = {
      "Accept": "application/json",
      "Content-Type": "application/json", 
    }

    if (this.Auth.loggedIn()) {
      standardheader['Authorization'] = `${this.Auth.getToken()}`
  }
  
  return fetch(url + '/api/transaction_del', {
    method: "POST",
    mode: 'cors',
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': '*',
    headers: standardheader,
    credentials: 'include',
    body: JSON.stringify({id: focusid})
  })
    .then((response) => response.json())
    .then((response) => {
            if(response.state === true){
                //Display SUCCESS notification && reload transactions
                this.loadTransactions();
            } else {
              //Display ERROR notification
            }
    });
  }

}


resetTransactionFields = () => {
  document.getElementById("instrument_field").value = "";
  document.getElementById("action_field").value = "";
  document.getElementById("stake_field").value = "";
  document.getElementById("unit_field").value = "";
  document.getElementById("currency_field").value = "";
  document.getElementById("open_field").value = "";
  document.getElementById("close_field").value = "";
  document.getElementById("points").value = "";
  document.getElementById("pl_value").value = "";
  document.getElementById("pl_percent").value = "";
  document.getElementById("date_field").value = this.mycurrentdate();
}

addTransaction = () => {
  //add transaction to API
  var data = {
    instrument: document.getElementById("instrument_field").value,
    action: document.getElementById("action_field").value,
    stake_size_percent: document.getElementById("stake_field").value,
    unit_value: document.getElementById("unit_field").value,
    currency: document.getElementById("currency_field").value,
    created_by_user: document.getElementById("user_field").value,
    open: document.getElementById("open_field").value,
    close: document.getElementById("close_field").value,
    points: document.getElementById("points").value,
    profit_loss: document.getElementById("pl_value").value,
    pl_percent: document.getElementById("pl_percent").value,
    date: document.getElementById("date_field").value
  }

  try{
  const values = Object.entries(data);
  for (const [key, value] of values){
    if(value === undefined || value === ""){
      throw "could not resolve value: " + key;
    }
  }

  //Start fetch setup
  let debug = this.state.debug;
  if(debug){
      var url = 'http://localhost:5000'
  } else {
      var url = 'http://157.245.47.65';
  }

    //Static header information
    let standardheader = {
      "Accept": "application/json",
      "Content-Type": "application/json", 
    }

    if (this.Auth.loggedIn()) {
      standardheader['Authorization'] = `${this.Auth.getToken()}`
  }
  
  return fetch(url + '/api/transactions', {
    method: "POST",
    mode: 'cors',
    'Access-Control-Allow-Origin': "*",
    'Access-Control-Allow-Headers': '*',
    headers: standardheader,
    credentials: 'include',
    body: JSON.stringify(data)
  })
    .then((response) => response.json())
    .then((response) => {
            if(response.state === true){
                //Display SUCCESS notification && reload transactions
                this.loadTransactions();
            } else {
              //Display ERROR notification
            }
    });



} catch (err){
  console.log(err);
} 

}

calculateFieldsTrigger = () => {
  let autofill = document.getElementsByClassName('autofill');
  for(var i = 0; i < autofill.length; i++){
    console.log('test!')
    autofill[i].addEventListener("change", () => {
      this.calculateFields();
    })
  }
}

calculateFields = () => {
  let data = document.getElementsByClassName('autofill');
  var err = false;
  var values = []
  for(var x = 0; x < data.length;x++){
    if(data[x].value === ''){
      err = true;
      break;
    } else {
      values[x] = data[x].value;
    }
  }

  if(values.length !== data.length){
    return 'stop'
  }

let points = 0.00;
let pl_value = 0.00;
let pl_percent = 0.00;

//Calculate the variables
//Points
if(values[0] ===  "BUY"){
  var points_calc = parseFloat(values[4]) - parseFloat(values[3])
} else if (values[0] ===  "SELL") {
  var points_calc = parseFloat(values[3]) - parseFloat(values[4])
} else {
  return 'Stop'
}
points = points_calc.toFixed(1);


//pl_value
var pl_value_calc = parseFloat(values[2]) * parseFloat("0." + values[1]) * parseFloat(points);
pl_value = pl_value_calc.toFixed(1);


//pl_percent
var pl_percent_calc = parseFloat(points) * parseFloat("0." + values[1]);
pl_percent = pl_percent_calc.toFixed(2);;

document.getElementById("points").value = points;
document.getElementById("pl_value").value = pl_value;
document.getElementById("pl_percent").value = pl_percent;

console.log(points)
console.log(pl_value)
console.log(pl_percent);
console.log("LOL")




}

mycurrentdate = () => {
  let today = new Date().toLocaleDateString('en-GB');
  let time = new Date().toLocaleTimeString('en-GB');
  const ourdate = today + " " + time;
  return ourdate;
}

  render() {

    function mycurrentdate() {
      let today = new Date().toLocaleDateString('en-GB');
      let time = new Date().toLocaleTimeString('en-GB');
      const ourdate = today + " " + time;
      return ourdate;
    }

    return (
      <div className="content">
        <Grid fluid>
          <Row>
          <Col md={12}>
              <Card
                title="Tilføj transaktion"
                content={
                  <form>
                    <FormInputs
                      ncols={["col-md-2", "col-md-2", "col-md-2","col-md-2","col-md-2","col-md-2"]}
                      properties={[
                        {
                          label: "Instrument (DOW, Dax, etc...)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Instrument",
                          defaultValue: "",
                          disabled: false,
                          id: "instrument_field"
                        },
                        {
                          label: "Action (BUY/SELL)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "BUY/SELL",
                          defaultValue: "",
                          className: "autofill",
                          id: "action_field"
                        },
                        {
                          label: "Stake Size (%)",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Stake Size",
                          className: "autofill",
                          id: "stake_field"
                        },
                        {
                          label: "Unit Value",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Unit Value",
                          className: "autofill",
                          id: "unit_field"
                        },
                        {
                          label: "Currency",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Currency",
                          defaultValue: "DKK",
                          id: "currency_field"
                        },
                        {
                          label: "User",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Name",
                          defaultValue: "Jacob Wistrøm",
                          disabled: true,
                          id: "user_field"
                        }
                      ]}
                    />
                    <FormInputs
                      ncols={["col-md-2", "col-md-2", "col-md-2","col-md-2","col-md-2","col-md-2"]}
                      properties={[
                        {
                          label: "Open",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Open",
                          defaultValue: "",
                          className: "autofill",
                          id: "open_field"
                        },
                        {
                          label: "Close",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Close",
                          defaultValue: "",
                          className: "autofill",
                          id: "close_field"
                        },
                        {
                          label: "Points +/-",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Points",
                          defaultValue: "",
                          disabled: true,
                          id: "points",
                        },
                        {
                          label: "Profit/Loss",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "P/L in value",
                          defaultValue: "",
                          disabled: true,
                          id: "pl_value",
                        },
                        {
                          label: "P/L 100%",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "P/L in percent",
                          defaultValue: "",
                          disabled: true,
                          id: "pl_percent"
                        },
                        {
                          label: "Creation date",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "DD/MM/YYYY (fx. 31/01/2021)",
                          defaultValue: mycurrentdate(),
                          disabled: false,
                          id: "date_field"
                        }
                      ]}
                    />
                    
                    <Button bsStyle="info" onClick={this.addTransaction} fill type="button">
                      Tilføj
                    </Button>
                    <Button bsStyle="info" resettrans onClick={this.resetTransactionFields} fill type="button">
                      Nulstil
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Col md={7}>
              <Card
                title="Transaktioner"
                category="Registeret transaktioner..."
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.transactions.map((prop, key) => {
                        return (
                          <tr key={key}>
                            <td  key={key}>{1+key}</td>
                            {prop.map((prop, subkey) => {
                              if(subkey === 0 && prop === "PROFIT"){
                                return <td  key={subkey}><p className="profit">{prop}</p></td>;
                              } else if (subkey === 0 && prop === "LOSS") {
                                return <td key={subkey}><p className="loss">{prop}</p></td>;
                              } else if(subkey === 13) {
                                return <td key={subkey}><a href="#" onClick={this.deleteTransaction} data-id={prop} data-ids={key}><i className="fa fa-times fa-2x" aria-hidden="true"></i></a></td>
                              } else {
                                return <td key={subkey}><p>{prop}</p></td>;
                              }
                            })}
                            
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>

{/*
            <Col md={12}>
              <Card
                plain
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table hover>
                    <thead>
                      <tr>
                        {thArray.map((prop, key) => {
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {tdArray.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.map((prop, key) => {
                              return <td key={key}>{prop}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                }
              />
            </Col>
  */}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default TableList;

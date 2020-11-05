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

class TableList extends Component {
  constructor(){
    super();
    this.calculateFieldsTrigger = this.calculateFieldsTrigger.bind(this);
    this.calculateFields = this.calculateFields.bind(this);
  }

componentDidMount(){
  this.calculateFieldsTrigger();
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

  render() {

    function mycurrentdate() {
      let today = new Date().toLocaleDateString('en-GB')
      return today;
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
                          disabled: false
                        },
                        {
                          label: "Action (BUY/SELL)",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "BUY/SELL",
                          defaultValue: "",
                          className: "autofill"
                        },
                        {
                          label: "Stake Size (%)",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Stake Size",
                          className: "autofill"
                        },
                        {
                          label: "Unit Value",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Unit Value",
                          className: "autofill"
                        },
                        {
                          label: "Currency",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Currency",
                          defaultValue: "DKK"
                        },
                        {
                          label: "User",
                          type: "text",
                          bsClass: "form-control",
                          placeholder: "Name",
                          defaultValue: "Jacob Wistrøm",
                          disabled: true
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
                          className: "autofill"
                        },
                        {
                          label: "Close",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Close",
                          defaultValue: "",
                          className: "autofill"
                        },
                        {
                          label: "Points +/-",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "Points",
                          defaultValue: "",
                          disabled: true,
                          id: "points"
                        },
                        {
                          label: "Profit/Loss",
                          type: "number",
                          bsClass: "form-control",
                          placeholder: "P/L in value",
                          defaultValue: "",
                          disabled: true,
                          id: "pl_value"
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
                          disabled: false
                        }
                      ]}
                    />
                    
                    <Button bsStyle="info" fill type="submit">
                      Tilføj
                    </Button>
                    <div className="clearfix" />
                  </form>
                }
              />
            </Col>
            <Col md={12}>
              <Card
                title="Striped Table with Hover"
                category="Here is a subtitle for this table"
                ctTableFullWidth
                ctTableResponsive
                content={
                  <Table striped hover>
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

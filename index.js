const express = require("express");
const bodyparser = require("body-parser");
const cors = require("cors");
const Influx = require('influx');

var app = express();
app.use(cors());
app.use(bodyparser.json());

//Influx DB
const influx = new Influx.InfluxDB('http://localhost:8086/GrowingMobile');

//INFLUX
app.get("/influx/angus", function(request, response){
    influx.query("SELECT * FROM Angus")
        .then( result => response.status(200).json(result) )
        .catch( error => response.status(500).json({ error }) );
});

//SINGLE MACHINE
app.get("/influx/section/:section/machine/:machine", function(request, response){
    let section = request.params.section;
    let machine = request.params.machine;

    influx
        .query(`select "electricCurrent" from Angus WHERE "machine" = '${machine}'`)
        .then( result => response.status(200).json(result) )
        .catch( error => response.status(500).json({ error }));
});

//COMPONENT CURRENT
app.get("/influx/:section/:machine/:component", function(request, response){

    let machine = request.params.machine;
    let section = request.params.section;
    let component = request.params.component;

    influx
        .query(`SELECT mean("electricCurrent") AS "mean_electricCurrent" FROM "GrowingMobile"."autogen"."Angus" WHERE time > now() - 1h AND "component"='${component}' 
        AND "machine"='${machine}' AND "section" = '${section}' GROUP BY time(1m) FILL(linear)`)
        .then( result => response.status(200).json(result) )
        .catch( error => response.status(500).json({error}));
});

//averageCurrent        GLOBAL CURRENT
app.get("/influx/sumCurrent", function(req, res){
    influx.query(`select * from sum_ElectricCurrent`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})

//GET DI OGNI SINGOLA MISURA
//temperature
app.get("/influx/temperature", function(req, res){
    influx.query(`select "temperature" from Angus`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})
//waterLevel
app.get("/influx/waterLevel", function(req, res){
    influx.query(`select "waterLevel" from Angus`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})
//humidity
app.get("/influx/humidity", function(req, res){
    influx.query(`select "humidity" from Angus`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})
//rpm
app.get("/influx/rpm", function(req, res){
    influx.query(`select "rpm" from Angus`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})
//electricCurrent
app.get("/influx/electricCurrent", function(req, res){
    influx.query(`select "electricCurrent" from Angus`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})
//workHours
app.get("/influx/workHours", function(req, res){
    influx.query(`select "workHours" from Angus`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})
//pH
app.get("/influx/pH", function(req, res){
    influx.query(`select "pH" from Angus`)
        .then( result => res.status(200).json(result) )
        .catch( error => res.status(500).json({ error }));
})

//CREATE DATA SET INTERVAL
setInterval(function(){
        queryRandomizer()
    }, 500);

//CREATE DATA FUNCTION
function queryRandomizer(){

    let sections = ["Lavaggio", "Pretrattamento", "Stoccaggio"];

    let machines1 = ["prelavaggio", "lavaggio", "asciugatura"];
    let machines2 = ["vascaPretrattamento", "vascaPrimier", "vascaFiniscer"];
    let machines3 = "impilatore";

    let components1_1 = ["pompa", "contatore", '""'];   //prelavaggio
    let components1_2 = ["pompa", "contatore", '""'];   //lavaggio
    let components1_3 = ["ventilatore", "contatore", '""']; //asciugatura

    let components2 = ['""'];

    let components3 = [ "motore1", "motore2"];

    let typeC = ["electricCurrent", "rpm", "workHours"];

    var x = Math.floor((Math.random() * 3) + 0);
    var sectionRand = sections[x];

    var m, machineRand;

    var c, componentRand;

    var ty, type, valueRand;

    //range per i valori randomici
    var max, min;

    var sensorID;

    // LA SECTION
    switch(x){

        //LAVAGGIO------- randomizzo le macchine per il lavaggio
        case 0:
            m = Math.floor((Math.random() * 3) + 0);
            machineRand = machines1[m];

            // RANDOMIZZO I COMPONENTS
            switch(m){

                //TRA PRELAVAGGIO, LAVAGGIO, ASCIUGATURE
                case 0 :
                    c = Math.floor((Math.random() * 3) + 0);
                    componentRand = components1_1[c];

                    // IL SENSORE PER I COMPONENTI
                    switch(c){

                        case 0:
                            sensorID = Math.floor((Math.random()*3)+1);

                            //trovo il tipo della misura
                            ty = Math.floor((Math.random() * 3) + 0);
                            type = typeC[ty];

                            switch(ty){
                                case 0:
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 1:
                                    max = 5000;
                                    min = 750;
                                    break;

                                case 2:
                                    max = 10;
                                    min = 1;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;

                        case 1:
                            sensorID = Math.floor((Math.random()*3)+4);

                            ty = Math.floor((Math.random() * 3) + 0);
                            type = typeC[ty];

                            switch(ty){
                                case 0:
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 1:
                                    max = 5000;
                                    min = 750;
                                    break;

                                case 2:
                                    max = 10;
                                    min = 1;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;
                        case 2:
                            sensorID = Math.floor((Math.random()*2)+7);

                            switch(sensorID){
                                case 7:
                                    type = "temperature";
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 8:
                                    type="waterLevel";
                                    max = 1300;
                                    min = 300;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;
                    }
                    break;

                case 1 :
                    c = Math.floor((Math.random() * 3) + 0);
                    componentRand = components1_2[c];

                    switch(c){
                        case 0:
                            sensorID = Math.floor((Math.random()*3)+9);

                            ty = Math.floor((Math.random() * 3) + 0);
                            type = typeC[ty];

                            switch(ty){
                                case 0:
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 1:
                                    max = 5000;
                                    min = 750;
                                    break;

                                case 2:
                                    max = 10;
                                    min = 1;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;

                        case 1:
                            sensorID = Math.floor((Math.random()*3)+12);

                            ty = Math.floor((Math.random() * 3) + 0);
                            type = typeC[ty];

                            switch(ty){
                                case 0:
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 1:
                                    max = 5000;
                                    min = 750;
                                    break;

                                case 2:
                                    max = 10;
                                    min = 1;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;

                        case 2:
                            sensorID = Math.floor((Math.random()*2)+15);

                            switch(sensorID){
                                case 15:
                                    type = "temperature";
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 16:
                                    type="waterLevel";
                                    max = 1300;
                                    min = 300;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;
                    }
                    break;

                case 2 :
                    c = Math.floor((Math.random() * 3) + 0);
                    componentRand = components1_3[c];

                    switch(c){
                        case 0:
                            sensorID = Math.floor((Math.random()*3)+17);

                            ty = Math.floor((Math.random() * 3) + 0);
                            type = typeC[ty];

                            switch(ty){
                                case 0:
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 1:
                                    max = 5000;
                                    min = 750;
                                    break;

                                case 2:
                                    max = 10;
                                    min = 1;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;

                        case 1:
                            sensorID = Math.floor((Math.random()*3)+20);

                            ty = Math.floor((Math.random() * 3) + 0);
                            type = typeC[ty];

                            switch(ty){
                                case 0:
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 1:
                                    max = 5000;
                                    min = 750;
                                    break;

                                case 2:
                                    max = 10;
                                    min = 1;
                                    break;
                            }

                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;
                        case 2:
                            sensorID = Math.floor((Math.random()*2)+23);

                            switch(sensorID){
                                case 23:
                                    type = "temperature";
                                    max = 1000;
                                    min = 200;
                                    break;

                                case 24:
                                    type="humidity";
                                    max = 120;
                                    min = 0;
                                    break;
                            }
                            valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                            break;
                    }
                    break;
            }
            break;

        //sezione pretrattamento
        case 1:
            m = Math.floor((Math.random() * 3) + 0);
            machineRand = machines2[m];
            componentRand='""';

            switch(m){
                case 0:
                    sensorID = Math.floor((Math.random()*2)+25);

                    switch(sensorID){
                        case 25:
                            type = "waterLevel";
                            max = 1300;
                            min = 300;
                            break;

                        case 26:
                            type="pH";
                            max = 14;
                            min = 0;
                            break;
                    }

                    valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                    break;

                case 1:
                    sensorID = Math.floor((Math.random()*2)+27);

                    switch(sensorID){
                        case 27:
                            type = "waterLevel";
                            max = 1300;
                            min = 300;
                            break;

                        case 28:
                            type="pH";
                            max = 14;
                            min = 0;
                            break;
                    }

                    valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                    break;

                case 2:
                    sensorID = Math.floor((Math.random()*2)+29);

                    switch(sensorID){
                        case 29:
                            type = "waterLevel";
                            max = 1300;
                            min = 300;
                            break;

                        case 30:
                            type="pH";
                            max = 1300;
                            min = 14;
                            break;
                    }

                    valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                    break;
            }

            break;

        //sezione stoccaggio
        case 2:
            c = Math.floor((Math.random() * 2) + 0);
            machineRand = machines3;
            componentRand = components3[c];

            switch(c){
                case 0:
                    sensorID = Math.floor((Math.random()*3)+31);

                    ty = Math.floor((Math.random() * 3) + 0);
                    type = typeC[ty];

                    switch(ty){
                        case 0:
                            max = 1000;
                            min = 200;
                            break;

                        case 1:
                            max = 5000;
                            min = 750;
                            break;

                        case 2:
                            max = 10;
                            min = 1;
                            break;
                    }

                    valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                    break;

                case 1:
                    sensorID = Math.floor((Math.random()*3)+34);

                    ty = Math.floor((Math.random() * 3) + 0);
                    type = typeC[ty];

                    switch(ty){
                        case 0:
                            max = 1000;
                            min = 200;
                            break;

                        case 1:
                            max = 5000;
                            min = 750;
                            break;

                        case 2:
                            max = 10;
                            min = 1;
                            break;
                    }

                    valueRand = Math.floor((Math.random() * (max - min +1)))+min;
                    break;
            }

            break;
    }

    var queryPart1 = "insert Angus,section="+sectionRand+",machine="+machineRand+",component="+componentRand+",sensorID="+sensorID;
    var queryPart2 = " "+type+"="+""+valueRand;

    var queryRand = queryPart1+queryPart2;

    console.log(queryRand);

    switch(type){
        case "electricCurrent":
            influx.writePoints([
                {
                    measurement:'Angus',
                    tags:{
                        section:sectionRand,
                        machine:machineRand,
                        component:componentRand,
                        sensorID:sensorID
                    },
                    fields:{
                        electricCurrent : valueRand
                    },
                }
            ]).catch(err => {
                console.error("Error");
            })
            break;
        case "rpm":
            influx.writePoints([
                {
                    measurement:'Angus',
                    tags:{
                        section:sectionRand,
                        machine:machineRand,
                        component:componentRand,
                        sensorID:sensorID
                    },
                    fields:{
                        rpm : valueRand
                    },
                }
            ]).catch(err => {
                console.error("Error");
            })

            break;
        case "workHours":
            influx.writePoints([
                {
                    measurement:'Angus',
                    tags:{
                        section:sectionRand,
                        machine:machineRand,
                        component:componentRand,
                        sensorID:sensorID
                    },
                    fields:{
                        workHours : valueRand
                    },
                }
            ]).catch(err => {
                console.error("Error");
            })
            break;
        case "temperature":
            influx.writePoints([
                {
                    measurement:'Angus',
                    tags:{
                        section:sectionRand,
                        machine:machineRand,
                        component:componentRand,
                        sensorID:sensorID
                    },
                    fields:{
                        temperature : valueRand
                    },
                }
            ]).catch(err => {
                console.error("Error");
            })
            break;
        case "waterLevel":
            influx.writePoints([
                {
                    measurement:'Angus',
                    tags:{
                        section:sectionRand,
                        machine:machineRand,
                        component:componentRand,
                        sensorID:sensorID
                    },
                    fields:{
                        waterLevel : valueRand
                    },
                }
            ]).catch(err => {
                console.error("Error");
            })
            break;
        case "humidity":
            influx.writePoints([
                {
                    measurement:'Angus',
                    tags:{
                        section:sectionRand,
                        machine:machineRand,
                        component:componentRand,
                        sensorID:sensorID
                    },
                    fields:{
                        humidity : valueRand
                    },
                }
            ]).catch(err => {
                console.error("Error");
            })
            break;

        case "pH":
            influx.writePoints([
                {
                    measurement:'Angus',
                    tags:{
                        section:sectionRand,
                        machine:machineRand,
                        component:componentRand,
                        sensorID:sensorID
                    },
                    fields:{
                        pH : valueRand
                    },
                }
            ]).catch(err => {
                console.error("Error");
            })
            break;
    }
}

app.listen(5000);

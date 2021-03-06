"use strict";
var Cylon = require('cylon');
var keypress = require("keypress");
var SoundPlayer = require('soundplayer');
var PubNub = require('pubnub');

var express = require('express');
var app = express();

app.get('/movementRollB/:x/:y', function (req, res) {
    xKoordRollB = req.params.x;
    yKoordRollB = req.params.y;
    res.end();
});

app.get('/yellowTarget/:x/:y', function (req, res) {
    yellowTargetX = req.params.x;
    yellowTargetY = req.params.y;
    res.end();
});

app.get('/redTarget/:x/:y', function (req, res) {
    redTargetX = req.params.x;
    redTargetY = req.params.y;
    res.end();
});

app.get('/greenTarget/:x/:y', function (req, res) {
    greenTargetX = req.params.x;
    greenTargetY = req.params.y;
    res.end();
});

app.get('/blueTarget/:x/:y', function (req, res) {
    blueTargetX = req.params.x;
    blueTargetY = req.params.y;
    res.end();
});

app.get('/purpleTarget/:x/:y', function (req, res) {
    purpleTargetX = req.params.x;
    purpleTargetY = req.params.y;
    res.end();
});

app.use(express.static('public'));

app.listen(8888, function () {
});

var pubnub = new PubNub({
    subscribeKey: "sub-c-5357b764-077f-11e8-b7c9-024a5d295ade"
});

const STOP = "stop";
const FARBE = "Farbe";
const USECASE = "Usecase";

//TARGET
var greenTargetX = 0;
var greenTargetY = 0;
var redTargetX = 0;
var redTargetY = 0;
var yellowTargetX = 0;
var yellowTargetY = 0;
var blueTargetX = 0;
var blueTargetY = 0;
var purpleTargetX = 0;
var purpleTargetY = 0;

//RollB
var xKoordRollB = 0;
var yKoordRollB = 0;
var startKoordRollBX = 0;
var startKoordRollBY = 0;
var stopKoordRollBX = 0;
var stopKoordRollBY = 0;

var ausrichtungWinkel = 0;
var winkelZumZiel = 0;
var neuerWinkel;
var player = new SoundPlayer();

var aX = 50;
var aY = 50;

var richtung = 0;

console.log('Server running');

Cylon.robot({
    connections: {
        bluetooth: {adaptor: 'central', uuid: 'ef5b943330b9', module: 'cylon-ble'}
    },


    devices: {
        bb8: {driver: 'bb8', module: 'cylon-sphero-ble'}
    },


    work: function (my) {
        console.log("Wake up RollB");
        var player = new SoundPlayer();
        for (var i = 0; i <= 50; i++) {
            my.bb8.randomColor();
            i++;
        }
        setTimeout(function () {
            my.bb8.setHeading(0, function (err, data) {
                console.log("SET HEADING");
            });
        }, 1000);


        pubnub.addListener({
            status: function (statusEvent) {
                if (statusEvent.category === "PNConnectedCategory") {

                    var payload = {
                        my: 'payload'
                    };
                    pubnub.publish(
                        {
                            message: payload

                        },
                        function (status) {
                        });
                }
            },
            message: function (PubNubMessage) {
                const messageType = PubNubMessage.message.Message.type;
                const messageBefehl = PubNubMessage.message.Message.befehl;

                console.log(PubNubMessage);
                switch (messageType) {
                    case USECASE:
                        switch (messageBefehl) {
                            case "rot":
                                driveToKoord(redTargetX, redTargetY, function () {
                                });
                                break;
                            case "blau":
                                driveToKoord(blueTargetX, blueTargetY, function () {
                                });
                                break;
                            case "gelb":
                                driveToKoord(yellowTargetX, yellowTargetY, function () {
                                });
                                break;
                            case "radiosprache":
                                player.sound("soundfiles/radiostimme.mp3");
                                break;
                            case "stimmetts":
                                player.sound("soundfiles/textStimme.mp3");
                                break;
                            case "einbrecher":
                                findeDenEinbrecher();
                                break;
                            case "verstecken":
                                verstecken();
                                break;
                            case "haustier": //Tier/person
                                tierPerson();
                                break;
                            case "toilette": //klo
                                klo();
                                break;
                            case "einkaufen":
                                einkaufen();
                                break;
                            case "party":
                                party();
                                break;
                            case "verkehrspolizist":
                                verkehrspolizist();
                                break;
                            case "machwas":
                                machMalWas();
                                break;
                            case "drehen":
                                my.bb8.roll(0, richtung += 90);
                                break;
                            case "gefuehle":
                                randomGefuehl();
                                break;
                        }
                        break;
                    case STOP:
                        switch (messageBefehl) {
                            case "anhalten":
                            case "halt":
                            case "stop":
                                console.log("Stop!");
                                my.bb8.stop();
                                break;
                        }
                        break;

                    case FARBE:
                        switch (messageBefehl) {
                            case "rot":
                                my.bb8.color({red: 255, green: 0, blue: 0}, function (err, data) {
                                    console.log(err || "Color RED");
                                });
                                break;
                            case "grün":
                                my.bb8.color({red: 0, green: 255, blue: 0}, function (err, data) {
                                    console.log(err || "Color GREEN");
                                });
                                break;
                            case "blau":
                                my.bb8.color({red: 0, green: 0, blue: 255}, function (err, data) {
                                    console.log(err || "Color BLUE");
                                });
                                break;
                        }
                        break;
                }
            }

        });
        pubnub.subscribe({
            channels: ['RollB']
        });


        function handle(ch, key) {

            if (!key)
                return;
            if (key.ctrl && key.name === "c") {
                process.stdin.pause();
                process.exit();
            }

            switch (key.name) {
                case "w":
                    console.log("Drive to front");
                    my.bb8.roll(100, 0);
                    break;
                case "d":
                    console.log("Drive right");
                    my.bb8.roll(100, 90);
                    break;
                case "s":
                    console.log("Drive back");
                    my.bb8.roll(100, 180);
                    break;
                case "a":
                    console.log("Drive left");
                    my.bb8.roll(100, 270);
                    break;
                case "space":
                    console.log("Stop");
                    my.bb8.stop();
                    break;
                default:
                    console.log("Key unknown, ROLLB SAYS NO");
                    player.sound('soundfiles/WutPanik/ichHasseEs.mp3', function () {
                    });
                    my.bb8.color({red: 255, green: 0, blue: 0}, function (err, data) {
                        console.log(err || "Color RED!");
                    });
                    setTimeout(function () {
                        my.bb8.color({red: 0, green: 0, blue: 0}, function (err, data) {
                            console.log("LED OFF!");
                        });
                    }, 6000);
            }

        }

        function freude() {
            player.sound('soundfiles/Freude/wuhuu.mp3');
            my.bb8.color({red: 255, green: 0, blue: 0}, function (err, data) {
                console.log(err || "Color RED");
            });
            setTimeout(function () {
                my.bb8.color({red: 0, green: 0, blue: 255}, function (err, data) {
                    console.log(err || "Color BLUE");
                });
            }, 1000);
            setTimeout(function () {
                my.bb8.color({red: 0, green: 255, blue: 0}, function (err, data) {
                    console.log(err || "Color GREEN");
                });
            }, 2000);
        }

        function randomGefuehl() {
            var gefuehlsFunktionen = [wut, trauer, freude];

            function randomNumber(n) {
                return Math.floor(Math.random() * n);
            }

            gefuehlsFunktionen[randomNumber(gefuehlsFunktionen.length)]();
        }

        function wut() {
            player.sound('soundfiles/WutPanik/scheiße.mp3');
        }

        function trauer() {
            player.sound('soundfiles/Trauer/auwwh.mp3', function () {
                player.sound('soundfiles/Trauer/ouuuh2.mp3');
            });
            my.bb8.color({red: 0, green: 0, blue: 255}, function (err, data) {
                console.log(err || "Color BLUE");
            });
        }

        function panik() {
            my.bb8.color({red: 255, green: 0, blue: 0}, function (err, data) {
                console.log(err || "Color Red");
            });
        }

        function bestaetigungsFarbe(callback) {
            my.bb8.color({red: 0, green: 255, blue: 0}, function (err, data) {
                console.log(err || "Color GREEN");
                callback();
            });
        }

        function kopfDrehen(callback) {
            my.bb8.roll(0, 270);
            setTimeout(function () {
                my.bb8.roll(0, 90);
            }, 1000);
            setTimeout(function () {
                my.bb8.roll(0, 270);
            }, 2000);
            setTimeout(function () {
                my.bb8.stop();
                callback();
            }, 3000);
        }

        //Einbrecher Usecase
        function findeDenEinbrecher() {
            bestaetigungsFarbe(function () {
                player.sound('soundfiles/Einbrecher/ichFindeDenEinbrecher.mp3', function () { //"ich finde den einbrecher"
                    driveToKoord(redTargetX, redTargetY, function () {
                        panik();
                        player.sound('soundfiles/Einbrecher/verschwindeDuDummerEinbrecher.mp3', function () {
                            player.sound('soundfiles/Einbrecher/hauAb.mp3', function () {
                                player.sound('soundfiles/Einbrecher/verschwinde2.mp3');
                            });
                        }); //„verschwinde du dummer Einbrecher“, „hau ab“, „geh bitte wieder weg“
                    });
                });
            });
        }

        //Verstecken Usecase
        function verstecken() {
            bestaetigungsFarbe(function () {
                player.sound('soundfiles/Verstecken/klarFangAnZuZählen2.mp3', function () { //"klar, fang an zu zählen!"
                    driveToKoord(yellowTargetX, yellowTargetY, function () {
                        player.sound('soundfiles/Verstecken/DuHastMichGefundenSchnitt.mp3');
                    });
                });
            });
        }

        function kreisFahren(callback) {
            var count = 0;
            var dir = 0;
            var interval = setInterval(function () {
                my.bb8.roll(30, dir);
                dir = dir + 7;
                my.bb8.randomColor();
                if (dir >= 365) {
                    dir = 0;
                    count++;
                }
                if (count > 1) {
                    clearInterval(interval);
                    my.bb8.stop();
                    callback();
                }
            }, 100);
        }

        //Kuscheltier Person
        function tierPerson() {
            bestaetigungsFarbe(function () {
                driveToKoord(yellowTargetX, yellowTargetY, function () {
                    kreisFahren(function () {
                        player.sound("soundfiles/Tier/dasHatSpassGemacht6.mp3");
                    });
                    player.sound('soundfiles/Tier/duziduzi.mp3', function () {
                        player.sound('soundfiles/Tier/duziduzi.mp3');
                    });
                });


            });
        }


        function klo() {
            bestaetigungsFarbe(function () {
                player.sound('soundfiles/Klo/aufToilette.mp3', function () { //"oh ich merke ich muss aufs klo..."
                    driveToKoord(blueTargetX, blueTargetY, function () {
                        player.sound('soundfiles/Klo/pissAndFlush.mp3', function () {
                            player.sound('soundfiles/Klo/puuuhDasWarErleichternd.mp3');
                        });
                    });
                })
            });
        }

        //Einkaufen
        function einkaufen() {
            bestaetigungsFarbe(function () {
                driveToKoord(purpleTargetX, purpleTargetY, function () {
                    driveToKoord(redTargetX, redTargetY, function () {
                        player.sound('soundfiles/Einkaufen/ichHätteGerneMilchEierUndZuckerOHH.mp3');
                    })
                })
            });
        }

        //UseCase7
        function party() {
            player.sound('soundfiles/Tanzen/lassUnsTanzen2.mp3', function () { //"disco disco party party"
                player.sound('soundfiles/Tanzen/dancemusik.mp3', function () {
                    freude(function () {
                    });
                });
                for (var i = 0; i <= 100; i++) {
                    my.bb8.randomColor();
                    i++;
                }
            });
            setTimeout(function () {
                my.bb8.roll(20, 90)
            }, 500);
            setTimeout(function () {
                my.bb8.roll(20, 180)
            }, 1000);
            setTimeout(function () {
                my.bb8.roll(20, 270)
            }, 1500);
            setTimeout(function () {
                my.bb8.roll(20, 0)
            }, 2000);
            setTimeout(function () {
                my.bb8.roll(20, 90)
            }, 2500);
            setTimeout(function () {
                my.bb8.roll(20, 180)
            }, 3000);
            setTimeout(function () {
                my.bb8.roll(20, 270)
            }, 3500);
            setTimeout(function () {
                my.bb8.roll(20, 0)
            }, 4000);
            setTimeout(function () {
                my.bb8.roll(20, 90)
            }, 4500);
            setTimeout(function () {
                my.bb8.roll(20, 180)
            }, 5000);
            setTimeout(function () {
                my.bb8.roll(20, 270)
            }, 5500);
            setTimeout(function () {
                my.bb8.roll(20, 0)
            }, 6000);
            setTimeout(function () {
                my.bb8.roll(20, 90)
            }, 6500);
            setTimeout(function () {
                my.bb8.roll(20, 180)
            }, 7000);
            setTimeout(function () {
                my.bb8.roll(20, 270)
            }, 7500);
            setTimeout(function () {
                my.bb8.roll(20, 0)
            }, 8000);
            setTimeout(function () {
                my.bb8.roll(20, 0)
            }, 8500);
            setTimeout(function () {
                my.bb8.roll(20, 90)
            }, 9000);
            setTimeout(function () {
                my.bb8.roll(20, 180)
            }, 9500);
            setTimeout(function () {
                my.bb8.roll(20, 270)
            }, 10000);
            setTimeout(function () {
                my.bb8.roll(20, 0)
            }, 10500);
            setTimeout(function () {
                my.bb8.stop();
            }, 11000);
        }

        //UseCase8
        function verkehrspolizist() {
            bestaetigungsFarbe(function () {
                driveToKoord(purpleTargetX, purpleTargetY, function () { //Straße AUTO!!!!
                    my.bb8.color({red: 255, green: 0, blue: 0}, function () {
                        player.sound('soundfiles/Verkehrspolizist/stehenBleiben2.mp3', function () { //"bitte anhalten!"
                            kopfDrehen(function () {
                                player.sound('soundfiles/Verkehrspolizist/weiterFahren.mp3'); //"jetzt weiterfahren"
                                my.bb8.color({red: 0, green: 255, blue: 0}, function (err, data) {
                                    console.log(err || "Color GREEN");
                                });
                            });
                        });
                    });
                })
            });
        }

        //UseCase9
        function machMalWas() {
            bestaetigungsFarbe(function () {
                player.sound('soundfiles/MachWas/viereckFahren.mp3', function () { //„ich kann im viereck fahren zum beispiel“
                    moveSquare(function () {
                        for (var i = 0; i <= 200; i++) {
                            my.bb8.randomColor();
                            i++;
                        }
                    });
                });
            });
        }

        function moveSquare(callback) {
            my.bb8.roll(60, 0);
            setTimeout(function () {
                my.bb8.roll(60, 90);
            }, 2000);
            setTimeout(function () {
                my.bb8.roll(60, 180);
            }, 4000);
            setTimeout(function () {
                my.bb8.roll(60, 270);
            }, 5000);
            setTimeout(function () {
                my.bb8.roll(60, 0);
            }, 6000);
            setTimeout(function () {
                my.bb8.stop();
                callback();
            }, 7000);
        }

        function driveToKoord(zielKoordX, zielKoordY, callback) {
            var ausrichtung = 0;

            if (xKoordRollB !== null && xKoordRollB !== 0 && xKoordRollB !== undefined) {
                startKoordRollBX = xKoordRollB;
                startKoordRollBY = yKoordRollB;
                console.log("GOT START KOORDINATEN " + startKoordRollBX + " " + startKoordRollBY);

                my.bb8.roll(70, 0);

                setTimeout(function () {
                    my.bb8.stop();
                }, 1000);

                setTimeout(function () {
                    stopKoordRollBX = xKoordRollB;
                    stopKoordRollBY = yKoordRollB;
                    console.log("GOT DIRECTION KOORDINATEN " + stopKoordRollBX + " " + stopKoordRollBY);
                    ausrichtungWinkel = Math.atan((startKoordRollBY - stopKoordRollBY) / (startKoordRollBX - stopKoordRollBX));
                    ausrichtungWinkel = ausrichtungWinkel * 180 / Math.PI;
                    console.log("WINKEL: " + ausrichtungWinkel);

                    //drives from top left to bottom right
                    if (startKoordRollBY < stopKoordRollBY && startKoordRollBX < stopKoordRollBX) {
                        console.log("links oben nach rechts unten");
                        ausrichtung = 360 - ausrichtungWinkel;

                        //drives from bottom left to top right
                    } else if (startKoordRollBY > stopKoordRollBY && startKoordRollBX < stopKoordRollBX) {
                        console.log("links unten nach rechts oben");
                        ausrichtung = (-ausrichtungWinkel);

                        //drives from top right to bottom left
                    } else if (startKoordRollBY < stopKoordRollBY && startKoordRollBX > stopKoordRollBX) {
                        console.log("rechts oben nach links unten");
                        ausrichtung = 180 + (-ausrichtungWinkel);

                        //drives from bottom left to top right
                    } else if (startKoordRollBY > stopKoordRollBY && startKoordRollBX > stopKoordRollBX) {
                        console.log("links unten nach rechts oben");
                        ausrichtung = 180 - ausrichtungWinkel;
                    }

                }, 2000);
                setTimeout(function () {
                    console.log("ausrichtung: " + ausrichtung);
                    my.bb8.roll(0, ausrichtung);
                }, 3000);
                setTimeout(function () {
                    my.bb8.stop();
                }, 4000);

                //AUSRICHTUNG ABGESCHLOSSEN!!! RollB schaut in der Kamera nach rechts

                setTimeout(function () {
                    stopKoordRollBX = xKoordRollB;
                    stopKoordRollBY = yKoordRollB;
                    console.log("NeueStopKoords: " + stopKoordRollBX + "Y: " + stopKoordRollBY);
                    //Berechnung vom Winkel zum Ziel
                    winkelZumZiel = Math.atan((stopKoordRollBY - zielKoordY) / (stopKoordRollBX - zielKoordX));
                    winkelZumZiel = winkelZumZiel * 180 / Math.PI;

                    console.log("Winkel zum Ziel: " + winkelZumZiel);

                    //rollB: bottom right target: top left
                    if (stopKoordRollBY > zielKoordY && stopKoordRollBX > zielKoordX) {
                        console.log("rollB: bottom right target: top left");
                        if (stopKoordRollBX <= 960 && zielKoordX > 960) {
                            neuerWinkel = ausrichtung + 180 + winkelZumZiel + 180;
                        } else {
                            neuerWinkel = ausrichtung + 180 + winkelZumZiel;
                        }

                        //rollB: bottom left target: top right
                    } else if (stopKoordRollBY > zielKoordY && stopKoordRollBX < zielKoordX) {
                        console.log("rollB: bottom left target: top right");
                        if (zielKoordX <= 960 && stopKoordRollBX > 960) {
                            neuerWinkel = ausrichtung - (-winkelZumZiel) + 180;
                        } else {
                            neuerWinkel = ausrichtung - (-winkelZumZiel);
                        }

                        //rollB: top left target: bottom right
                    } else if (stopKoordRollBY < zielKoordY && stopKoordRollBX < zielKoordX) {
                        console.log("rollB: top left target: bottom right");
                        if (zielKoordX <= 960 && stopKoordRollBX > 960) {
                            neuerWinkel = ausrichtung + winkelZumZiel + 180;
                        } else {
                            neuerWinkel = ausrichtung + winkelZumZiel;
                        }


                        //rollB: top right target: bottom left
                    } else if (stopKoordRollBY < zielKoordY && stopKoordRollBX > zielKoordX) {
                        console.log("rollB: top right target: bottom left");
                        if (stopKoordRollBX <= 960 && zielKoordX > 960) {
                            neuerWinkel = ausrichtung + (180 - (-winkelZumZiel)) + 180;
                        } else {
                            neuerWinkel = ausrichtung + (180 - (-winkelZumZiel));
                        }
                    }

                    my.bb8.roll(70, (neuerWinkel) % 360);

                    var distanceToMovingObjekt = 10000;

                    var interval = setInterval(function () {
                        aX = xKoordRollB;
                        aY = yKoordRollB;

                        var distanceX = zielKoordX - aX;
                        var distanceY = zielKoordY - aY;

                        distanceToMovingObjekt = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

                        if (distanceToMovingObjekt < 200) {
                            my.bb8.stop();

                            my.bb8.setHeading(0, function (serr, data) {
                            });
                            clearInterval(interval);
                            callback();
                        }
                    }, 200);
                }, 6000);
            }
        }

        keypress(process.stdin);
        process.stdin.on("keypress", handle);
        process.stdin.setRawMode(true);
        process.stdin.resume();
    }

}).start();
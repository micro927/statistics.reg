import express from 'express';
import axios from 'axios';
import { createPool } from 'mysql';
import cors from 'cors';
import { config } from 'dotenv';
import findConfig from 'find-config';
import { readFileSync } from 'fs';

const app = express();
app.use(cors())

// origin: process.env.VUE_APP_BASE_URL
// OR BLANK {}

config({ path: findConfig('.env.production') || findConfig('.env') || findConfig('.env.local') })
const HOST = 'localhost';
const PORT = process.env.VUE_APP_API_PORT || 9999;
const systemlog = process.env.WRITELOG_API

function writelog(text) {
    axios
        .get(systemlog, {
            params: {
                logtext: text,
                logtype: 'statistics'
            }
        })
        .then((response) => {
            console.log(response.data)
        })
}

const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

const slist = JSON.parse(readFileSync("./json/StatStudentList.json", "utf8"))
const clist = JSON.parse(readFileSync("./json/StatCurriculumList.json", "utf8"))

app.get('/test', (req, res) => {
    writelog('hi tester 2021! ')
    res.send('hi tester 2021!')
});

app.get('/v1/StatStudentList', (req, res) => {
    res.json(slist)
});

app.get('/v1/StatCurriculumList', (req, res) => {
    res.json(clist)
});

app.get('/v1/FindAllTitle', (req, res) => {
    let titles = []
    var i
    var ik
    var MenuId
    var show
    for (i in slist.TypeMenu) {
        MenuId = slist.TypeMenu[i].MenuId
        for (ik in slist.TypeMenu[i].Statistics) {
            show = slist.TypeMenu[i].Statistics[ik].StatTitle + " (" + MenuId + slist.TypeMenu[i].Statistics[ik].StatId + ")"
            titles.push(show)
        }
    }
    for (i in clist.TypeMenu) {
        MenuId = clist.TypeMenu[i].MenuId
        for (ik in clist.TypeMenu[i].Statistics) {
            show = clist.TypeMenu[i].Statistics[ik].StatTitle + " (" + MenuId + clist.TypeMenu[i].Statistics[ik].StatId + ")"
            titles.push(show)
        }
    }
    var term = req.query.keyword;
    var search = new RegExp(term, 'i');
    let result = titles.filter(item => search.test(item));
    res.send(result)
});

app.get('/v1/GetOption', async (req, res) => {
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log('Connection Error')
            writelog('Connection Error')
            res.json('connection error');
        } else {
            var app_semester
            var faculty
            connection.query("SELECT semester,year FROM app_semester", function (err, result) {
                if (err) {
                    connection.release();
                    console.log('Found some error when query app_semester ' + Date())
                    writelog('Found some error when query app_semester ' + Date())
                    res.json('app_semester error');
                } else {
                    app_semester = result
                    connection.query("SELECT faculty_id,TRIM(IF(faculty_id = 99,'',faculty_prefix_th)) faculty_prefix,TRIM(faculty_name_th) faculty_name FROM tbl_faculty WHERE faculty_id != 96", function (err, result) {
                        if (err) {
                            // connection.release();
                            console.log('Found some error when query app_semester ' + Date())
                            writelog('Found some error when query app_semester')
                            writelog(err.message)
                            res.json('faculty error');

                        } else {
                            faculty = result
                            let return_result = {
                                "app_semester": app_semester,
                                "faculty": faculty,
                            }
                            res.json(return_result);
                            console.log('GETOPTION ' + Date())
                            writelog('NEW USER : GETOPTION ')
                        }
                        connection.release();
                    });

                }
            });
        }
    });
});

//MAIN
app.get('/v1/data/:statid', async (req, res) => {

    let statid = req.params.statid
    var qlist
    try {

        var qlist = JSON.parse(readFileSync("./json/Data/" + statid + ".json", "utf8"))


        function cleanparam(param) {
            let res
            if (param == '999') {
                res = ''
            } else {
                res = param
            }
            return res
        }

        let semester = cleanparam(req.query.semester)
        let year = cleanparam(req.query.year)
        let fac = cleanparam(req.query.fac)
        let semestercurrent = cleanparam(req.query.semestercurrent)
        let admityear = cleanparam(req.query.admityear)
        let query = await qlist.query
        let order = await qlist.order
        let must_past_data = await qlist.past
        let header = await qlist.header
        let orderParam = []
        let semesterforfilter = await order.indexOf("s") === -1 ? (order.indexOf("c") === -1 ? '' : semestercurrent) : semester
        let yearpaststart = cleanparam(req.query.year)


        function convertorder(no) {
            let res
            if (order[no] === 'p') {
                return yearpaststart
            }
            else {
                if (order[no] === 's') {
                    res = semester
                } else if (order[no] === 'y') {
                    res = year
                } else if (order[no] === 'f') {
                    res = fac
                } else if (order[no] === 'c') { //semester for currently
                    res = semestercurrent == 3 ? 2 : semestercurrent
                } else if (order[no] === 'a') { //admit_year(year_admit in db)
                    res = admityear
                } else if (order[no] === 'o') { //semester for check with out_head table
                    res = semestercurrent
                } else {
                    res = ''
                }
                return '%' + res + '%'
            }
        }


        for (const i in order) {
            orderParam.push(convertorder(i))
        }

        console.log(order)
        writelog(order)
        // console.log(orderParam)
        writelog(orderParam.toString())



        const getUsers = () => new Promise((resolve, reject) => {
            pool.getConnection(async (err, connection) => {
                if (err) console.error(err);
                console.log('MySQL Connection Established: ', connection.threadId);

                function is_past_data(semesterforfilter, year) {
                    return new Promise(function (resolve, reject) {
                        connection.query("SELECT * FROM tbl_yearsemester WHERE set_semester LIKE ? AND set_year LIKE ?", [semesterforfilter, year], function (err, result) {
                            if (err) {
                                console.log('Found some error when query is_past_data')
                                writelog('Found some error when query is_past_data')
                                writelog(err.message)
                                // connection.release();
                                return reject(err)
                            }
                            // else {
                            var resultrow = result.length
                            var is_past_data = resultrow > 0 ? (semesterforfilter == '' && resultrow == 1 ? false : true) : false
                            resolve(is_past_data);
                            // connection.release();
                            // }

                        });
                    });
                }

                var is_this_past
                await is_past_data(await semesterforfilter, year).then((is_past_data) => {
                    is_this_past = is_past_data
                })


                if (must_past_data === "Y" && (!is_this_past)) {
                    console.log('FILTER ACTIVE ' + semesterforfilter + "/" + year);
                    writelog('FILTER ACTIVE ' + semesterforfilter + "/" + year);
                    let return_result = {
                        "header": header,
                        "order": order,
                        "error": "past_filter"
                    };
                    resolve(return_result);
                    connection.release(err => { if (err) console.error(err) });
                }
                else {
                    console.log('Getting ' + statid + ' statistics data : ' + connection.threadId);
                    writelog('Getting ' + statid + ' statistics data' + connection.threadId);
                    connection.query(query, orderParam, function (err, result) {

                        if (err) {
                            // connection.release();
                            console.log(err.message + ' ' + connection.threadId)
                            writelog(err.message)
                            writelog('main stat  ' + statid + '  query error')
                        }
                        else {
                            console.log('Finished ' + statid + ' statistics data : ' + connection.threadId);
                            writelog('Finished ' + statid + ' statistics data : ' + connection.threadId);
                            let return_result = {
                                "header": header,
                                "data": result,
                                "order": order,
                                "error": ""
                            }
                            resolve(return_result);
                            connection.release(err => { if (err) console.error(err) });
                        }
                    });
                }
            });
        });

        getUsers()
            .then(users => res.send(users))
            .catch(err => console.error(err));

    } catch (err) {
        if (err.code === 'ENOENT') {

            console.log(statid + ' data not found! : ' + Date());
            writelog(statid + ' data not found!');
            res.json({
                "header": header,
                "order": order,
                "error": statid + ' data not found! : ' + Date()
            });
        } else {
            res.json({
                "header": header,
                "order": order,
                "error": err
            });
        }
    }
});

app.listen((HOST, PORT), () => {
    console.log(`Running on http://${HOST}:${PORT}`);
    writelog(`Running Statistics API : ${HOST}:${PORT}`);
});
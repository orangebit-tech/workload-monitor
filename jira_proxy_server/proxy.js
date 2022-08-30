
require('dotenv').config()
var https = require("https");
var fs = require("fs");
var path = require("path");
var certificatePath = path.resolve(__dirname, "/etc/letsencrypt/live/a3i3.dev/");
var privateKey = fs.readFileSync(certificatePath + "/privkey.pem");
var certificate = fs.readFileSync(certificatePath + "/fullchain.pem");
var credentials = {key: privateKey, cert: certificate};
const express = require('express');
const app = express();
var cors = require('cors')
const axios = require('axios')
var data = null
var jira = null
var pmJira = null
var epics = null
app.use(cors())

async function fetchJira(){
    var totalIssues = []
    var maxResults = 100
    // ALL FIELDS
    // var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    // STABLE
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10106,customfield_10107,customfield_10145,customfield_10117,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    const response = await axios( {
        url: url, 
        method: 'get',
        mode: 'no-cors',
        headers: {
            'Content-Type':                 `application/json`,
        },
        data: {
            maxResults: maxResults,
            jqls: {
                project: 'CRM',
            }
        },
        auth: {
            username: process.env.VUE_APP_USERNAME,
            password: process.env.VUE_APP_JIRA_TOKEN,
        },
        withCredentials: true,
    }).then(async (res) => {
        console.log("RECEIVED INITIAL response ", res.data.startAt)
        var startAt = 0
        var start = 0
        var max = res.data.maxResults
        var total = res.data.total
        var totalReceived = res.data.issues.length
        var left = total - (start+totalReceived)
        console.log('START: ', startAt, " MAX: ", max, " TOTAL: ", total, " TOTAL_RECEIVED ", totalReceived, ' LEFT: ', left)
        totalIssues.push(...res.data.issues)
        jira = res.data
        if(left >max){
            var laps = parseInt(left/max)
            console.log("COUNTED LAPS ", laps)
            for(var i = 0; i<= laps; i++){
                startAt = startAt + max
                console.log('lap ', i ,' started ', ' start at updated ', startAt)
                await axios( {
                    // STABLE
                    url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC',
                    method: 'get',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type':                 `application/json`,
                    },
                    data: {
                        // startAt: startAt,
                        maxResults: max,
                        jqls: {
                            project: 'CRM',
                        }
                    },
                    auth: {
                        username: process.env.VUE_APP_USERNAME,
                        password: process.env.VUE_APP_JIRA_TOKEN,
                    },
                    withCredentials: true,
                }).then((resp) => {
                    // console.log('GOT RESPONSE FOR LAP ', i, ' which starts at ', resp.data.startAt)
                    left = left - resp.data.issues.length
                    jira.issues.push(...resp.data.issues)
                    totalIssues.push(...resp.data.issues)
                    console.log('START: ', startAt, " MAX: ", max, " TOTAL: ", total, " TOTAL_RECEIVED ", totalReceived, ' LEFT: ', left)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
        else {
            console.log("SKIPPING, ", left, " < ", max)
        }
    }).catch((err) => {
        console.log(err)
    })
    var fields106 = []
    console.log('RECEIVED RESPONSE', Object.keys(jira))
    for(var j = 0; j < jira.issues.length; j++){
        if(!jira.issues[j].fields.customfield_10106){
            fields106.push(j)
        }
    }
    console.log('total issues with missing 106 from request 1: ', fields106.length)
    console.log('total issues reveived request 1', jira.issues.length)
    return jira
}
async function fetchPMTasks(){
    var totalPmIssues = []
    var maxResults = 100
    // STABLE
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC';
    const response = await axios( {
        url: url, 
        method: 'get',
        mode: 'no-cors',
        headers: {
            'Content-Type':                 `application/json`,
        },
        data: {
            maxResults: maxResults,
            jqls: {
                project: 'CRM',
            }
        },
        auth: {
            username: process.env.VUE_APP_USERNAME,
            password: process.env.VUE_APP_JIRA_TOKEN,
        },
        withCredentials: true,
    }).then(async (res) => {
        console.log("RECEIVED INITIAL response ", res.data.startAt)
        var startAt = 0
        var start = 0
        var max = res.data.maxResults
        var total = res.data.total
        var totalReceived = res.data.issues.length
        var left = total - (start+totalReceived)
        console.log('START: ', startAt, " MAX: ", max, " TOTAL: ", total, " TOTAL_RECEIVED ", totalReceived, ' LEFT: ', left)
        totalPmIssues.push(...res.data.issues)
        pmJira = res.data
        if(left >max){
            var laps = parseInt(left/max)
            console.log("COUNTED LAPS ", laps)
            for(var i = 0; i<= laps; i++){
                startAt = startAt + max
                console.log('lap ', i ,' started ', ' start at updated ', startAt)
                await axios( {
                    url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC',
                    // url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20AND%20created%20%3E%3D%202021-08-06%20AND%20created%20%3C%3D%202022-08-06%20ORDER%20BY%20assignee%20ASC%2C%20created%20DESC', 
                    method: 'get',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type':                 `application/json`,
                    },
                    data: {
                        // startAt: startAt,
                        maxResults: max,
                        jqls: {
                            project: 'CRM',
                        }
                    },
                    auth: {
                        username: process.env.VUE_APP_USERNAME,
                        password: process.env.VUE_APP_JIRA_TOKEN,
                    },
                    withCredentials: true,
                }).then((resp) => {
                    // console.log('GOT RESPONSE FOR LAP ', i, ' which starts at ', resp.data.startAt)
                    left = left - resp.data.issues.length
                    pmJira.issues.push(...resp.data.issues)
                    totalPmIssues.push(...resp.data.issues)
                    console.log('START: ', startAt, " MAX: ", max, " TOTAL: ", total, " TOTAL_RECEIVED ", totalReceived, ' LEFT: ', left)
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
        else {
            console.log("SKIPPING, ", left, " < ", max)
        }
    }).catch((err) => {
        console.log(err)
    })
    // response.data.issues = [...jira]
    var fields106 = []
    for(var j = 0; j < pmJira.issues.length; j++){
        if(!pmJira.issues[j].fields.customfield_10106){
            fields106.push(j)
        }
    }
    console.log('total issues with missing 106 from request 2: ', fields106.length)
    console.log('total issues reveived request 2', pmJira.issues.length)
    console.log('RECEIVED RESPONSE')
    return pmJira
}
async function fetchEpics(){
    var totalIssues = []
    var maxResults = 100
    // ALL FIELDS
    // var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    // STABLE
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10105,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20%3D%20Epic%20AND%20status%20in%20(Backlog%2C%20Closed%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20Testing%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22%2C%20%22Writing%20Documentation%22)%20order%20by%20created%20DESC';
    const response = await axios( {
        url: url, 
        method: 'get',
        mode: 'no-cors',
        headers: {
            'Content-Type':                 `application/json`,
        },
        data: {
            maxResults: maxResults,
            jqls: {
                project: 'CRM',
            }
        },
        auth: {
            username: process.env.VUE_APP_USERNAME,
            password: process.env.VUE_APP_JIRA_TOKEN,
        },
        withCredentials: true,
    }).then(async (res) => {
        console.log("RECEIVED EPICS INITIAL response data", res.data)
        //prepare response
        var result = []
        var issues = []
        var duration = 10
        var progress = 0.5
        if(res.data && res.data.issues){
            issues = res.data.issues
        }
        if(issues.length >0){
            issues.map(issue => {
                var epic = {
                    id:             issue.id,
                    text:           issue.fields.summary,
                    start_date:     issue.fields.customfield_10105,
                    target_date:    issue.fields.customfield_10117,
                    end_date:       issue.fields.customfield_10145,
                    duration:       duration,
                    progress:       progress,
                    created:        issue.fields.created,
                }
                result.push(epic)
            })
        }
        epics = {}
        epics.data = result
        return result;
    }).catch((err) => {
        console.log(err)
    })
    var fields106 = []
    console.log('RECEIVED RESPONSE', Object.keys(jira))
    for(var j = 0; j < jira.issues.length; j++){
        if(!jira.issues[j].fields.customfield_10106){
            fields106.push(j)
        }
    }
    console.log('total issues with missing 106 from request 1: ', fields106.length)
    console.log('total issues reveived request 1', jira.issues.length)
    return jira
}
app.get('/jira/', async(req, res) => {
    try{
        await fetchJira()
        res.json(jira);
    } catch (error){
        console.log(error)
    }
});
app.get('/jira/pm', async(req, res) => {
    try{
        await fetchPMTasks()
        res.json(pmJira);
    } catch (error){
        console.log(error)
    }
});
app.get('/jira/epics', async(req, res) => {
    try{
        await fetchEpics()
        res.json(epics);
    } catch (error){
        console.log(error)
    }
});
  
app.listen(8000, () => {
console.log('listening on port 8000')
});
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443, function() {
 console.log("Appted on port 8443");
});

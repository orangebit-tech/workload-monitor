
require('dotenv').config()
var https =                 require("https");
var fs =                    require("fs");
var path =                  require("path");
var certificatePath =       path.resolve(__dirname,             process.env.VUE_APP_KEY_PAIR_PATH);
var privateKey =            fs.readFileSync(certificatePath +   process.env.VUE_APP_HTTPS_PRIV_KEY);
var certificate =           fs.readFileSync(certificatePath +   process.env.VUE_APP_HTTPS_CERT);
var credentials =           {key: privateKey, cert: certificate};
const express =             require('express');
const app =                 express();
var cors =                  require('cors')
const axios =               require('axios')
app.use(cors())


var jira = null
var pmJira = null
var epics = null
var allData = null
var newsLetter =            null



async function fetchJira(){
    var totalIssues = []
    var maxResults = 100
    // ALL FIELDS
    // var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    // STABLE
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10145,customfield_10117,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20%22Documentation%20Finished%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    //var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
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
        console.log('TOTAL ', total)
        console.log('START: ', startAt, " MAX: ", max, " TOTAL: ", total, " TOTAL_RECEIVED ", totalReceived, ' LEFT: ', left)
        //totalIssues.push(...res.data.issues)
        jira = res.data
        if(left > 0){
            console.log("LEFT > MAX")
            var laps = parseInt(left/max)
            console.log("COUNTED LAPS ", laps)
            for(var i = 0; i<= laps; i++){
                startAt = startAt + max
                console.log('lap ', i ,' started ', ' start at updated ', startAt)
                await axios( {
                    url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC',
                    // STABLE
                    // url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC',
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
                    //totalIssues.push(...resp.data.issues)
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
    // console.log('RECEIVED RESPONSE', Object.keys(jira))
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

    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC';

    // STABLE
    //var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC';

    // var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    // var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20AND%20created%20%3E%3D%202021-08-06%20AND%20created%20%3C%3D%202022-08-06%20ORDER%20BY%20assignee%20ASC%2C%20created%20DESC';
    // var url = 'https://americor.atlassian.net/rest/api/latest/search?jql=project=CRM&maxResults=10000';
    // var url = 'https://americor.atlassian.net/rest/api/3/issue/picker';
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
        if(left >=max){
            var laps = parseInt(left/max)
            console.log("COUNTED LAPS ", laps)
            for(var i = 0; i<= laps; i++){
                startAt = startAt + max
                console.log('lap ', i ,' started ', ' start at updated ', startAt)
                await axios( {
                    url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC',
                    // url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20AND%20created%20%3E%3D%202021-08-06%20AND%20created%20%3C%3D%202022-08-06%20ORDER%20BY%20assignee%20ASC%2C%20created%20DESC', 
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
    // https://americor.atlassian.net/issues/?filter=-4&jql=project%20%3D%20CRM%20AND%20issuetype%20%3D%20Epic%20AND%20status%20in%20(Backlog%2C%20Closed%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20Testing%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22%2C%20%22Writing%20Documentation%22)%20order%20by%20created%20DESC
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,customfield_10118,duedate,customfield_10102,customfield_10105,customfield_10106,customfield_10107,customfield_10145,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20%3D%20Epic%20AND%20status%20in%20(Backlog%2C%20Closed%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20Testing%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22%2C%20%22Writing%20Documentation%22)%20order%20by%20created%20DESC';
    //var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
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
        //console.log("RECEIVED EPICS INITIAL response data", res.data)
        //prepare response
        var result = []
        var issues = []
        var progress = 0.5
        if(res.data && res.data.issues){
            issues = res.data.issues
        }
        if(issues.length >0){
            issues.map(issue => {
                var duration = 0

                var targetStart         = issue.fields.customfield_10117
                var start               = issue.fields.customfield_10105
                var targetEnd           = issue.fields.customfield_10118
                var endDate             = issue.fields.customfield_10145

                var targetEndDate       = targetEnd ? new Date(targetEnd) : null

                if(targetEndDate !== undefined && targetEndDate !== null){
                    var tempEndDate = targetEndDate.getTime()
                    console.log(tempEndDate)
                }
                var labels  = issue.fields.labels
                //console.log(targetEndDate)        
                var epic = {
                    fields:         {
                        summary:              issue.fields.summary,
                        status:               issue.fields.status,
                        customfield_10105:    issue.fields.customfield_10105,
                        customfield_10117:    issue.fields.customfield_10117,
                        customfield_10145:    issue.fields.customfield_10145,
                        customfield_10115:    issue.fields.customfield_10115,
                        customfield_10118:    issue.fields.customfield_10118,
                        customfield_10105:    issue.fields.customfield_10105,
                        labels:               issue.fields.labels,
                        priority:             issue.fields.priority,
                    },
                    key:            issue.key,
                    id:             issue.id,
                    text:           issue.fields.summary,
                    start_date:     issue.fields.customfield_10105,
                    target_date:    issue.fields.customfield_10117,
                    end_date:       issue.fields.customfield_10145,
                    status:         issue.fields.status,
                    duration:       duration,
                    progress:       progress,
                    created:        issue.fields.created,
                    dep:            issue.fields.customfield_10115,
                    target_end_date: issue.fields.customfield_10118,
                    //parent:         issue.id !== '14783' ? 14783 : undefined
                    start:          issue.fields.customfield_10105,
                    end:            issue.fields.customfield_10117,
                    open:           true
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
}
async function fetchNewsLetter(){
    var maxResults = 100
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20Done%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20Testing%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20AND%20labels%20in%20(Coming%2C%20New)%20order%20by%20created%20DESC';
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
        var issues = []
        if(res.data && res.data){
            issues = res.data
        }
        newsLetter = issues
        return newsLetter;
    }).catch((err) => {
        console.log(err)
    })
}
async function fetchAllData(){
    finalResult = {}
    var totalIssues = []
    var maxResults = 100
    // ALL FIELDS
    // var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    // STABLE
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10145,customfield_10117,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    var pmUrl = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC';
    var epicsUrl = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10105,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20%3D%20Epic%20AND%20status%20in%20(Backlog%2C%20Closed%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20Testing%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22%2C%20%22Writing%20Documentation%22)%20order%20by%20created%20DESC';

    //var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    const response1 = await axios( {
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
    }).then(async (res1) => {
        console.log("RECEIVED INITIAL response ", res1.data.startAt)
        let startAt = 0
        let start = 0
        let max = res1.data.maxResults
        let total = res1.data.total
        let totalReceived = res1.data.issues.length
        let left = total - (start+totalReceived)
        console.log('START: ', startAt, " MAX: ", max, " TOTAL: ", total, " TOTAL_RECEIVED ", totalReceived, ' LEFT: ', left)
        totalIssues.push(...res1.data.issues)
        jira = res1.data
        if(!finalResult.issues){
            console.log("CREATED FINAL RESULT, ADDED ", res1.data.issues.length)
            finalResult = res1.data
        }
        else if(finalResult.issues){
            finalResult.issues.push(...res1.data.issues)
            console.log("FINAL RESULT, ADDED ", res1.data.issues.length)
        }
        if(left >= max){
            let laps = parseInt(left/max)
            console.log("COUNTED LAPS ", laps)
            for(let i = 0; i<= laps; i++){
                startAt = startAt + max
                console.log('lap ', i ,' started ', ' start at updated ', startAt)
                await axios( {
                    url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC',
                    // STABLE
                    // url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC',
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
                }).then((res2) => {
                    // console.log('GOT res2ONSE FOR LAP ', i, ' which starts at ', res2.data.startAt)
                    left = left - res2.data.issues.length
                    // allData.issues.push(...res2.data.issues)
                    finalResult.issues.push(...res2.data.issues)
                    console.log("FINAL RESULT, ADDED ", res2.data.issues.length)
                    totalIssues.push(...res2.data.issues)
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
    const response2 = await axios( {
        url: pmUrl, 
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
    }).then(async (res3) => {
        console.log("RECEIVED INITIAL response ", res3.data.startAt)
        let startAt = 0
        let start = 0
        let max = res3.data.maxResults
        let total = res3.data.total
        let totalReceived = res3.data.issues.length
        let left = total - (start+totalReceived)
        console.log('START: ', startAt, " MAX: ", max, " TOTAL: ", total, " TOTAL_RECEIVED ", totalReceived, ' LEFT: ', left)
        totalIssues.push(...res3.data.issues)
        if(!finalResult.issues){
            finalResult = res3.data
            console.log("CREATED FINAL RESULT, resp2, ADDED ", res3.data.issues.length)
        }
        else if(finalResult.issues){
            finalResult.issues.push(...res3.data.issues)
            console.log("FINAL RESULT, resp2, ADDED ", res3.data.issues.length)
        }
        pmJira = res3.data
        if(left >= max){
            let laps = parseInt(left/max)
            console.log("COUNTED LAPS ", laps)
            for(let i = 0; i<= laps; i++){
                startAt = startAt + max
                console.log('lap ', i ,' started ', ' start at updated ', startAt)
                await axios( {
                    url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC',
                    // url: 'https://americor.atlassian.net/rest/api/3/search?startAt='+startAt+'&maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20AND%20created%20%3E%3D%202021-08-06%20AND%20created%20%3C%3D%202022-08-06%20ORDER%20BY%20assignee%20ASC%2C%20created%20DESC', 
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
                }).then((res4) => {
                    // console.log('GOT RESPONSE FOR LAP ', i, ' which starts at ', res4.data.startAt)
                    left = left - res4.data.issues.length
                    pmJira.issues.push(...res4.data.issues)
                    finalResult.issues.push(...res4.data.issues)
                    console.log("RESULT, res4, ADDED ", res4.data.issues.length)
                    totalIssues.push(...res4.data.issues)
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
    //var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20Testing)%20order%20by%20created%20DESC';
    const response3 = await axios( {
        url: epicsUrl, 
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
    }).then(async (res5) => {
        //console.log("RECEIVED EPICS INITIAL response data", res5.data)
        //prepare response
        let result = []
        let issues = []
        let progress = 0.5
        
        if(res5.data && res5.data.issues){
            // if(!finalResult.epics){
            //     finalResult.epics = res.data
            // }
            // if(finalResult.epics){
            //     finalResult.epics.issues.push(...res.data.issues)
            // }
            issues = res5.data.issues
        }
        if(issues.length >0){
            issues.map(issue => {
                let duration = 0

                let targetStart         = issue.fields.customfield_10117
                let start               = issue.fields.customfield_10105
                let targetEnd           = issue.fields.customfield_10118
                let endDate             = issue.fields.customfield_10145

                var targetEndDate       = targetEnd ? new Date(targetEnd) : null

                if(targetEndDate !== undefined && targetEndDate !== null){
                    let tempEndDate = targetEndDate.getTime()
                    console.log(tempEndDate)
                }
                //console.log(targetEndDate)        
                let epic = {
                    id:             issue.id,
                    text:           issue.fields.summary,
                    start_date:     issue.fields.customfield_10105,
                    target_date:    issue.fields.customfield_10117,
                    end_date:       issue.fields.customfield_10145,
                    duration:       duration,
                    progress:       progress,
                    created:        issue.fields.created,
                    parent:         issue.id !== '14783' ? 14783 : undefined
                }
                result.push(epic)
            })
        }
        epics = {}
        epics.data = result
        if(!finalResult.epics){
            console.log("CREATED FINAL RESULT, resp3, ADDED ", res5.data.issues.length)
            finalResult.epics = result
        }
        // return result;
    }).catch((err) => {
        console.log(err)
    })
    axios.all([
        response1, 
        response2, 
        response3, 
        ]).then(axios.spread((...responses) => {
            const responseOne = responses[0]

            const responseTwo = responses[1]

            const responesThree = responses[2]

            // var chartData = [];

            // for(var i=0; i<responses[0].data.owner.length; i++){
            //     chartData[i] = responses[0].data.owner[i] + responses[1].data.owner[i] + responses[2].data.owner[i] + responses[3].data.owner[i] + responses[4].data.owner[i] + responses[5].data.owner[i] + responses[6].data.owner[i] + responses[7].data.owner[i] + responses[8].data.owner[i] + responses[9].data.owner[i]
            // }
            // chartData.splice(0, 35)
            // const chartDataObj = Object.assign({}, chartData);
            console.log(responesThree)
            // console.log(data)
            // return data
            // use/access the results 
        })).catch(errors => {
            console.log(errors)
    // react on errors.
    })
    // console.log('total issues reveived request 1', allData.issues.length)
    console.log(Object.keys(finalResult))
    return Object.keys(finalResult)
}
app.get('/jira/', async(req, res) => {
    try{
        await fetchJira()
        // console.log(jira)
        res.json(jira);
    } catch (error){
        console.log(error)
    }
    // res.send(data.json())
});
app.get('/jira/pm', async(req, res) => {
    try{
        await fetchPMTasks()
        // console.log(pmJira)
        res.json(pmJira);
    } catch (error){
        console.log(error)
    }
    // res.send(data.json())
});
app.get('/jira/epics', async(req, res) => {
    try{
        await fetchEpics()
        // console.log(pmJira)
        res.json(epics);
    } catch (error){
        console.log(error)
    }
    // res.send(data.json())
});
app.get('/jira/newsletter', async(req, res) => {
    try{
        await fetchNewsLetter()
        res.json(newsLetter);
    } catch (error){
        console.log(error)
    }
});


  
app.listen(process.env.VUE_APP_HTTP_PORT, () => {
console.log('listening on port '+ process.env.VUE_APP_HTTP_PORT)
});
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.VUE_APP_HTTPS_PORT, function() {
 console.log('Appted on port ' + process.env.VUE_APP_HTTPS_PORT);
});

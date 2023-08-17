
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

var newsLetter =            null
var news =                  null

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
        console.log("THIS IS RES ", res)
        var issues = []
        if(res.data && res.data){
            issues = res.data
        }
        newsLetter = issues
        return newsLetter;
    }).catch((err) => {
        // console.log(err)
    })
}
async function fetchNews(){
    var maxResults = 100
    var url = 'https://americor.atlassian.net/rest/api/3/search?maxResults='+maxResults+'&filter=-4&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20Done%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20Testing%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20AND%20labels%20in%20(Recent%2C%20"Next")%20order%20by%20created%20DESC';
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
        news = issues
        return news;
    }).catch((err) => {
        // console.log(err)
    })
}
async function fetchAllData(){
    var allDataResult = {}
    var urls = [
        // Issues
        'https://americor.atlassian.net/rest/api/3/search?maxResults=100&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10145,customfield_10117,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20%22Documentation%20Finished%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20%22In%20Testing%22%2C%20%22Ready%20for%20testing%22)%20order%20by%20created%20DESC',
        // PM tasks
        'https://americor.atlassian.net/rest/api/3/search?maxResults=100&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC',
        // Epics
        'https://americor.atlassian.net/rest/api/3/search?maxResults=100&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,customfield_10118,duedate,customfield_10102,customfield_10105,customfield_10106,customfield_10107,customfield_10145,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20%3D%20Epic%20AND%20status%20in%20(Backlog%2C%20Closed%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20%22In%20Testing%22%2C%20%22Ready%20for%20testing%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22%2C%20%22Writing%20Documentation%22)%20order%20by%20created%20DESC',
    ]
    var subRequests = []
    var subRequestsMap = {issues: 0, pm: 0, epics: 0}
    const rr = await Promise.allSettled(urls.map(endpoint => axios({
        url: endpoint,
        mode: 'no-cors', 
        headers: {'Content-Type': `application/json`}, 
        auth: {username: process.env.VUE_APP_USERNAME, password: process.env.VUE_APP_JIRA_TOKEN}, 
        withCredentials: true, 
        data: {maxResults: 100, jqls: {project: 'CRM'}}
    }))).then(
        axios.spread(async (...allData) => {
            allData.map((dat, ind) => {
                // console.log(ind)
                var mode = ''
                if(ind == 0){
                    mode = 'issues'
                }
                if(ind == 1){
                    mode = 'pm'
                }
                if(ind == 2){
                    mode = 'epics'
                }
                var issues = dat.value.data.issues.map(iss => {
                    var issue = iss
                    issue.expand                    = null
                    issue.fields.issuetype.self     = null
                    issue.fields.issuetype.iconUrl  = null
                    issue.fields.creator.self       = null
                    issue.fields.creator.avatarUrls = null
                    issue.fields.reporter.self      = null
                    issue.fields.reporter.avatarUrls= null
                    issue.fields.priority.self      = null
                    issue.fields.priority.iconUrl   = null
                    issue.fields.customfield_10115 ? issue.fields.customfield_10115.self = null : ''
                    issue.fields.customfield_10106 ? issue.fields.customfield_10106.self = null : ''
                    issue.fields.customfield_10106 ? issue.fields.customfield_10106.avatarUrls = null : ''
                    issue.fields.customfield_10107 ? issue.fields.customfield_10107.self = null : ''
                    issue.fields.customfield_10107 ? issue.fields.customfield_10107.avatarUrls = null : ''
                    issue.fields.assignee ? issue.fields.assignee.self = null : ''
                    issue.fields.assignee ? issue.fields.assignee.avatarUrls = null : ''
                    issue.fields.status.iconUrl = null
                    issue.fields.status.self = null
                    return issue
                })
                if(!allDataResult[mode]){
                    console.log('CREATING in ', mode, '   INITIAL ', issues.length, ' issues')
                    allDataResult[mode] = issues
                }
                else if(allDataResult[mode]){
                    console.log('ADDING TO ', mode, ' ', issues.length, ' issues')
                    allDataResult[mode].push(...issues)
                }
                var resps = {}
                if(!resps[mode]){
                    resps[mode] = []
                }
                let start = 0
                let max = dat.value.data.maxResults
                let total = dat.value.data.total
                let totalReceived = dat.value.data.issues.length
                let left = total - (start+totalReceived)
                let subUrls = {
                    issues: [
                        'https://americor.atlassian.net/rest/api/3/search?startAt=',
                        '&maxResults=100&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10145,customfield_10117,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(%22Help%20Request%3A%20Issue%22%2C%20Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22In%20Development%22%2C%20%22Documentation%20Finished%22%2C%20Paused%2C%20%22Tech%20Review%22%2C%20%22In%20Testing%22%2C%20%22Ready%20for%20testing%22)%20order%20by%20created%20DESC'
                    ],
                    pm: [
                        'https://americor.atlassian.net/rest/api/3/search?startAt=',
                        '&maxResults=100&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,duedate,customfield_10102,customfield_10118,customfield_10106,customfield_10107,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20in%20(Improvement%2C%20%22New%20Feature%22%2C%20Task%2C%20%22Tech%20debt%22%2C%20Sub-task)%20AND%20status%20in%20(Backlog%2C%20Done%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22)%20order%20by%20created%20DESC'
                    ],
                    epics: [
                        'https://americor.atlassian.net/rest/api/3/search?startAt=',
                        '&filter=-4&fields=id,key,parent,status,labels,priority,assignee,aggregatetimeestimate,creator,reporter,aggregateprogress,progress,issuetype,timespent,created,timeoriginalestimate,summary,customfield_10115,customfield_10118,duedate,customfield_10102,customfield_10105,customfield_10106,customfield_10107,customfield_10145,customfield_10117&jql=project%20%3D%20CRM%20AND%20issuetype%20%3D%20Epic%20AND%20status%20in%20(Backlog%2C%20Closed%2C%20%22Code%20Review%22%2C%20%22Development%20Plan%22%2C%20%22Documentation%20Finished%22%2C%20%22In%20Development%22%2C%20Paused%2C%20%22Released%20to%20Production%22%2C%20%22Team%20Code%20Review%22%2C%20%22Tech%20Review%22%2C%20%22In%20Testing%22%2C%20%22Ready%20for%20testing%22%2C%20%22To%20Document%22%2C%20%22Waiting%20for%20Release%22%2C%20%22Writing%20Documentation%22)%20order%20by%20created%20DESC'
                    ]
                }
                if(left >= max){
                    // Laps
                    let laps = parseInt(left/max) + 1
                    subRequestsMap[mode] = laps
                    var lapData = []
                    for (var k = 0; k <= laps; k++){
                        if(k == 0){
                            lapData[k] = 100
                        }
                        else {
                            lapData[k] = lapData[k-1] + 100
                        }
                    }
                    for (var j = 0; j < laps; j++){
                        subRequests.push(subUrls[mode][0]+lapData[j]+subUrls[mode][1])
                    }
                }
            })
            var subDataLength = 0
            const subresps = await Promise.allSettled(subRequests.map(endpoint => axios({
                url: endpoint,
                mode: 'no-cors', 
                headers: {'Content-Type': `application/json`}, 
                auth: {username: process.env.VUE_APP_USERNAME, password: process.env.VUE_APP_JIRA_TOKEN},
                withCredentials: true,
                data: {maxResults: 100, jqls: {project: 'CRM'}}
            }))
            ).then(
                axios.spread((...allSubdata) => {
                    subDataLength = allSubdata.length
                    allSubdata.map((sdat, indx) => {
                        var subIssues = sdat.value.data.issues.map(iss => {
                            var issue = iss
                            issue.expand                    = null
                            issue.fields.issuetype.self     = null
                            issue.fields.issuetype.iconUrl  = null
                            issue.fields.creator.self       = null
                            issue.fields.creator.avatarUrls = null
                            issue.fields.reporter.self      = null
                            issue.fields.reporter.avatarUrls= null
                            issue.fields.priority.self      = null
                            issue.fields.priority.iconUrl   = null
                            issue.fields.customfield_10115 ? issue.fields.customfield_10115.self        = null : ''
                            issue.fields.customfield_10106 ? issue.fields.customfield_10106.self        = null : ''
                            issue.fields.customfield_10106 ? issue.fields.customfield_10106.avatarUrls  = null : ''
                            issue.fields.customfield_10107 ? issue.fields.customfield_10107.self        = null : ''
                            issue.fields.customfield_10107 ? issue.fields.customfield_10107.avatarUrls  = null : ''
                            issue.fields.assignee ? issue.fields.assignee.self                          = null : ''
                            issue.fields.assignee ? issue.fields.assignee.avatarUrls                    = null : ''
                            issue.fields.status.iconUrl                                                 = null
                            issue.fields.status.self                                                    = null
                            return issue
                        })
                        if(subRequestsMap.issues > 0){
                            // console.log('ADDING TO ISSUES ', subIssues.length, ' issues')
                            allDataResult.issues.push(...subIssues)
                            subRequestsMap.issues = subRequestsMap.issues - 1
                        }
                        else if(subRequestsMap.pm > 0){
                            // console.log('ADDING TO PM ', subIssues.length, ' issues')
                            allDataResult.pm.push(...subIssues)
                            subRequestsMap.pm = subRequestsMap.pm - 1
                        }
                        else if(subRequestsMap.epics > 0){
                            // console.log('ADDING TO EPICS ', subIssues.length, ' issues')
                            allDataResult.epics.push(...subIssues)
                            subRequestsMap.epics = subRequestsMap.epics - 1
                        }                        
                    })
                })
            )
            // console.log("Subrequests expected: ", subRequests.length)
            // console.log("Subrequests actual: ", subDataLength)
            // console.log('Issues: ', allDataResult.issues.length)
            // console.log('Pm: ', allDataResult.pm.length)
            // console.log('Epics: ', allDataResult.epics.length)
            return allDataResult
        })
    );
    var epcs = []
    if(rr.epics.length >0){
        rr.epics.map(issue => {
            var duration = 0
            var targetStart         = issue.fields.customfield_10117
            var start               = issue.fields.customfield_10105
            var targetEnd           = issue.fields.customfield_10118
            var endDate             = issue.fields.customfield_10145
            var targetEndDate       = targetEnd ? new Date(targetEnd) : null
            var labels  = issue.fields.labels
            var progress = 0.5
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
                start:          issue.fields.customfield_10105,
                end:            issue.fields.customfield_10117,
                open:           true
            }
            epcs.push(epic)
        })
        rr.epics = []
        rr.epics = epcs
    }   
    return rr
}

// Routes
app.get('/jira/newsletter', async(req, res) => {
    try{
        await fetchNewsLetter()
        res.json(newsLetter);
    } catch (error){
        // console.log(error)
    }
});
app.get('/jira/news', async(req, res) => {
    try{
        await fetchNews()
        res.json(news);
    } catch (error){
        // console.log(error)
    }
});
app.get('/jira/all', async(req, res) => {
    try{
        var resp = await fetchAllData()
        res.json(resp)
    } catch (error){
        // console.log(error)
    }
});

app.listen(process.env.VUE_APP_HTTP_PORT, () => {
console.log('listening on port '+ process.env.VUE_APP_HTTP_PORT)
});
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.VUE_APP_HTTPS_PORT, function() {
 console.log('Appted on port ' + process.env.VUE_APP_HTTPS_PORT);
});

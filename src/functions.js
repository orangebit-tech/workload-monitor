export default {
    sortedIssues(items, filters, orderBy){
        var localitems = [...items]
        if(filters && filters.length > 0 && filters.includes('priority')){
            localitems = localitems.sort((a, b) => {
                return parseInt(a.fields.priority.id) - parseInt(b.fields.priority.id)
            })
        }
        if(filters && filters.length > 0 && filters.includes('date')){
            localitems = localitems.sort((a, b) => {
                return parseInt(a.id) - parseInt(b.id)
            })
        }
        var result = []
        var teams = []
        var pms = []
        var assignees = []
        var customers = []
        var developers = []
        var desiredStatusList = [
            'tech review',
            'development plan',
            'in development',
            'code review',
            'testing',
            'paused',
        ] 
        var desiredStatusPM = [
            'team code review',
            'released to production',
            'waiting for release',
            'writing documentation',
            'to document',
            'backlog',
            'qa research'
        ]
        var all = []
        if(orderBy == 'assignee'){
            var assigneesBlackList = []
            if(localitems){
                localitems.map(item => {
                    var assignee = item.fields.assignee?.displayName ? item.fields.assignee.displayName : "Unassigned"
                    var status = item.fields.status.name.toLowerCase()
                    if(!assignees.includes(assignee) && assignee !=='Unassigned'){
                        assignees.push(assignee)
                    }
                    if(!assignees.includes(assignee) && assignee =='Unassigned'){
                        assignees.unshift(assignee)
                    }
                    if(!assigneesBlackList.includes(assignee)){
                        if(item.fields.customfield_10115 && !customers.includes(item.fields.customfield_10115.value)){
                            customers.push(item.fields.customfield_10115.value)
                        }
                        // SORTED
                        if(!result[assignee]){
                            result[assignee] = {}
                        }
                        if(!result[assignee][status]){
                            result[assignee][status] = []
                        }
                        // sort filter statuses
                        if(item.fields.status && desiredStatusList.includes(item.fields.status.name.toLowerCase())){
                            all.push(item)
                            result[assignee][status].push(item)  
                        }
                    }
                })
            }
        }
        if(orderBy == 'developer' ){
            var developersBlackList = []
            if(localitems){
                localitems.map(item => {
                    var developer = item.fields.customfield_10107?.displayName ? item.fields.customfield_10107.displayName : "Unassigned"
                    var status = item.fields.status.name.toLowerCase()
                    if(!developers.includes(developer) && developer !=='Unassigned'){
                        developers.push(developer)
                    }
                    if(!developers.includes(developer) && developer =='Unassigned'){
                        developers.unshift(developer)
                    }
                    if(!developersBlackList.includes(developer)){
                        // CUSTOMERS
                        if(item.fields.customfield_10115 && !customers.includes(item.fields.customfield_10115.value)){
                            customers.push(item.fields.customfield_10115.value)
                        }
                        // TEAMS
                        if(!result[developer]){
                            result[developer] = {}
                        }
                        if(!result[developer][status]){
                            result[developer][status] = []
                        }
                        // sort filter statuses
                        if(item.fields.status && desiredStatusList.includes(item.fields.status.name.toLowerCase())){
                            all.push(item)
                            result[developer][status].push(item)                
                        }
                    }
                })
            }
        }
        if(orderBy == 'team' || !orderBy){
            var teamsBlackList = []
            if(localitems){
                localitems.map(item => {
                    var status = item.fields.status.name.toLowerCase()
                    var team = item.fields.customfield_10102?.value ? item.fields.customfield_10102.value : "Unassigned"
                    if(!teams.includes(team) && team !=='Unassigned'){
                        teams.push(team)
                    }
                    if(!teams.includes(team) && team =='Unassigned'){
                        teams.unshift(team)
                    }
                    if(!teamsBlackList.includes(team)){
                        if(item.fields.customfield_10115 && !customers.includes(item.fields.customfield_10115.value)){
                            customers.push(item.fields.customfield_10115.value)
                        }
                        // TEAMS
                        if(!result[team]){
                            result[team] = {}
                        }
                        if(!result[team][status]){
                            result[team][status] = []
                        }
                        // sort filter statuses
                        if(item.fields.status && desiredStatusList.includes(item.fields.status.name.toLowerCase())){
                            all.push(item)
                            result[team][status].push(item)                
                        }
                    }
                })
            }
        }
        if(orderBy == 'pm'){
            var pmsBlackList = []
            if(localitems){
                localitems.map(item => {
                    var status = ''
                    function itemStatus (status) {
                        item.fields.status.name.toLowerCase()
                        return    status == 'released to production'    ? 'done' 
                                : status == 'to document'               ? 'done' 
                                : status == 'tech review'               ? 'review' 
                                : status == 'development plan'          ? 'review' 
                                : status == 'in development'            ? 'in progress' 
                                : status == 'team code review'          ? 'qc' 
                                : status == 'code review'               ? 'qc' 
                                : status == 'qa'                        ? 'qc' 
                                : status == 'qa research'               ? 'qc' 
                                : status == 'testing'                   ? 'qc'
                                : status
                    }
                    status = itemStatus(item.fields.status.name.toLowerCase())
                    
                    var pm = item.fields.customfield_10106 && item.fields.customfield_10106.displayName ? item.fields.customfield_10106.displayName : "Unassigned"
                    pms.push(pm)

                    if(!pmsBlackList.includes(pm)){
                        if(item.fields.customfield_10106 && !customers.includes(item.fields.customfield_10106.displayName)){
                            customers.push(item.fields.customfield_10106.displayName)
                        }
                        // pms
                        if(!result[pm]){
                            result[pm] = {}
                        }
                        if(!result[pm][status]){
                            result[pm][status] = []
                        }
                        // sort filter statuses
                        if( item.fields.status &&  
                            (desiredStatusPM.includes(item.fields.status.name.toLowerCase()) 
                            || desiredStatusList.includes(item.fields.status.name.toLowerCase())
                            )){
                            all.push(item)
                            result[pm][status].push(item)                
                        }
                    }
                })
            }
        }
        if(filters){
            if(filters.hiddenAssignees && typeof(filters.hiddenAssignees == 'object')){
                assigneesBlackList = [...filters.hiddenAssignees]
            }
        }
        return result
    },
    getPriority(priority_id){
        var priorities = [
            {
                id: 1,
                priority: 'Emengency',
                priority_id: '7',
                color: '#f44336',
            },
            {
                id: 2,
                priority: 'Immediate',
                priority_id: '6',
                color: '#ff9800',
            },
            {
                id: 3,
                priority: 'High',
                priority_id: '3',
                color: 'yellow ',
            },
            {
                id: 4,
                priority: 'Normal',
                priority_id: '4',
                color: '#5fb037',
            },
            {
                id: 5,
                priority: 'Low',
                priority_id: '5',
                color: '#47b54c',
            }
        ]
        var priority = null
        priorities.map((item) => {
            if(parseInt(priority_id) == item.id){
                priority = item
            }
        })
        return priority
    },
    countTasks(tasks){
        var result = {}
        var disabled = [
            'closed',
            'hold',
            'cancelled',
        ]
        var keys = Object.keys(tasks)
        var count = 0;
        var highest = 0;
        var high = 0;
        var medium = 0;
        var low = 0;
        keys.map((option) => {
            if(!disabled.includes(option.toLowerCase())){
                count += tasks[option].length
                tasks[option].map(task => {
                    if(task.fields && task.fields.priority && task.fields.priority.id){
                        if(task.fields.priority.id == '1'){
                            highest = highest + 1
                        }
                        if(task.fields.priority.id == '2'){
                            high = high + 1
                        }
                        if(task.fields.priority.id == '3'){
                            medium = medium + 1
                        }
                        if(task.fields.priority.id == '4'){
                            low = low + 1
                        }
                    }
                })
            }
        })
        result.total = count
        result.highest = highest
        result.high = high
        result.medium = medium
        result.low = low
        return result
    },
    howLongAgo(date){
        var newDate  =  new Date(date)
        var howLong =   (new Date().getTime() - newDate.getTime())+(newDate.getTimezoneOffset()*60*1000)
        // var years =     parseInt(howLong/1000/60/60/24/30/365)
        var months =    parseInt(howLong/1000/60/60/24/30)
        var weeks =     parseInt(howLong/1000/60/60/720)
        var days =      parseInt(howLong/1000/60/60/24)
        var hrs =       parseInt(howLong/1000/60/60)
        var mins =      parseInt(howLong/1000/60)
        var secs =      parseInt(howLong/1000)
        if( months >=1){
            if(months == 1){
                return "One month ago"
            }
            else {
                return months + "  months ago"
            }
        }
        if( weeks >=1){
            if(weeks == 1){
                return "One week ago"
            }
            else {
                return weeks + "  weeks ago"
            }
        }
        if( days >=1){
            if(days == 1){
                return "One day ago"
            }
            else {
                return days + "  days ago"
            }
        }
        if( hrs >=1){
            if(hrs == 1){
                return "One hour ago"
            }
            else {
                return hrs + "  hours ago"
            }
        }
        if( mins >=1){
            if(mins == 1){
                return "One minute ago"
            }
            else {
                return mins + "  minutes ago"
            }
        }
        if( secs >=1){
            if(secs == 1){
                return "One second ago"
            }
            else {
                return secs + "  seconds ago"
            }
        }
        return ''
    },
    searchFilter(tasks, query, groupBy){
        var result = []
        if(query !== ''){
            if(typeof(tasks) == 'object' && !tasks.length){
                result = {}
                var empList = Object.keys(tasks)
                empList.map(empl => {
                    if(tasks[empl]){
                        var statuses = Object.keys(tasks[empl])
                        if(statuses && statuses.length >0){
                            statuses.map(stat => {
                                if(tasks[empl][stat] && tasks[empl][stat].length >0){
                                    var tasksArr = tasks[empl][stat]
                                    tasksArr.map(task => {
                                        var key = undefined
                                        if(groupBy == 'assignee' && task.fields.assignee){
                                            key = task.fields.assignee.displayName.toLowerCase()
                                        }
                                        if(groupBy == 'developer' && task.fields.customfield_10107){
                                            key = task.fields.customfield_10107.displayName.toLowerCase()
                                        }
                                        if(groupBy == 'team' && task.fields.customfield_10102){
                                            key = task.fields.customfield_10102.value.toLowerCase()
                                        }
                                        if(groupBy == 'pm' && task.fields.customfield_10106){
                                            key = task.fields.customfield_10106.displayName.toLowerCase()
                                        }
                                        if(task.fields.summary.toLowerCase().includes(query.toLowerCase()) 
                                        || task.key.toLowerCase().includes(query.toLowerCase())
                                        || (key && key.includes(query.toLowerCase()))){
                                            if(!result[empl]){
                                                result[empl] = {}
                                            }
                                            if(!result[empl][stat]){
                                                result[empl][stat] = []
                                            }
                                            result[empl][stat].push(task)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
            else {
                tasks.map(item => {
                    if(
                        item.fields.summary.toLowerCase().includes(query.toLowerCase()) 
                        || item.key.toLowerCase().includes(query.toLowerCase())
                        ||  (
                                item.fields.assignee 
                                && groupBy !=='pm'
                                && item.fields.assignee.displayName.toLowerCase().includes(query.toLowerCase())
                            )
                        ||  (
                                item.fields.customfield_10106 
                                && groupBy =='pm'
                                && item.fields.customfield_10106.displayName.toLowerCase().includes(query.toLowerCase())
                            )
                        ){

                        result.push(item)
                    }
                })
            }
        }
        if(result && Object.keys(result) && Object.keys(result).length >1){
            return result
        }
        if(result.length < 1){
            return tasks
        }
        return result

    }
}
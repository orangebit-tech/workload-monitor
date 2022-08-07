export default {
    getPriority(priority_id){
        var priorities = [
            {
                id: 1,
                priority: 'Emengency',
                priority_id: '7',
                color: '#d53e1a',
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
                color: 'yellow',
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
                color: '#E0F0FF',
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
        var disabled = [
            'ready for testing',
            'closed',
            'hold',
            'development plan',
            'cancelled',
        ]
        var priorities = Object.keys(tasks)
        console.log(priorities)
        var count = 0;
        priorities.map((option) => {
            if(!disabled.includes(option.toLowerCase())){
                count += tasks[option].length
            }
        })
        return count
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
    searchFilter(tasks, query){
        var result = []
        // console.log(tasks)
        if(query !== ''){
            if(typeof(tasks) == 'object' && !tasks.length){
                result = {}
                var empList = Object.keys(tasks)
                empList.map(empl => {
                    // console.log(empl)
                    if(tasks[empl]){
                        var statuses = Object.keys(tasks[empl])
                        // console.log('got statuses list', statuses)
                        if(statuses && statuses.length >0){
                            statuses.map(stat => {
                                // console.log('status ', stat)
                                if(tasks[empl][stat] && tasks[empl][stat].length >0){
                                    var tasksArr = tasks[empl][stat]
                                    // console.log('got tasks arr', tasksArr)
                                    tasksArr.map(task => {
                                        // console.log('task ', task.subject)
                                        if(task.fields.summary.toLowerCase().includes(query.toLowerCase()) 
                                        || task.key.toLowerCase().includes(query.toLowerCase())
                                        || (task.fields.assignee && task.fields.assignee.displayName.toLowerCase().includes(query.toLowerCase()))){
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
                    if(item.fields.summary.toLowerCase().includes(query.toLowerCase()) 
                    || item.key.toLowerCase().includes(query.toLowerCase())
                    || (item.fields.assignee && item.fields.assignee.displayName.toLowerCase().includes(query.toLowerCase()))){
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
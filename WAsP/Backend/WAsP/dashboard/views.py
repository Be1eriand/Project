from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from django.db.models import Q, F
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import json as simplejson
from django.contrib.auth.decorators import login_required

#########################################################################
# Custom class to hold adjustable static values used throughout project #
#########################################################################



class static:
    #EXPECTED = float(DB_Settings.objects.get(setting_id=1).value)/100 # Expected Productivity Goal, converted to ratio
    LIVE_TIME = "13:00:00" # Time when User is viewing Dashboards (for live Machines)
    LIVE_DATE = str(Task.objects.latest('datetime').datetime)[:10] + " " + LIVE_TIME # Date when User is viewing Dashboards
    DEFAULT_DAYS = 7 # Default number of days to display for live dashboard
    TIME_PERIODS = [356, 186, 90, 60, 30, 21, 14, 7, 3, 1]  # Obsolete in v1.0, kept for testing purposes


# getTasks(
#   uid (int): payroll/user id of welder, if 0, return all Tasks based on dates
#   start_date (str): starting date of filter FORMAT MUST BE: YYYY-MM-DD HH:MM:SS
#   end_date (str): ending date of filter FORMAT MUST BE: YYYY-MM-DD HH:MM:SS
# ) returns QuerySet of Task objects filtered by payroll id and date parameters
def getTasks(uid, start_date, end_date):
    
    tasks = None #initialise

    # Some functions require midnight to be appended to the date to get the full gamut of the date range
    # Some functions use its own time, so if length of input date parameters = 10, only date was passed
    # need to append time
    if (len(start_date) == 10):
        start_date += " 00:00:00"
    if (len(end_date) == 10):
        end_date += " 23:59:59"

    print(start_date)
    dt_start = datetime.strptime(start_date, '%Y-%m-%d %H:%M:%S') #convert to datetime type
    dt_end = datetime.strptime(end_date, '%Y-%m-%d %H:%M:%S') #convert to datetime type

    tasks = Task.objects.filter( # filter Task objects
        Q(datetime__gte=dt_start) &
        Q(datetime__lte=dt_end)                                    
    )

    if (uid != 0): #if user is greater than 0, filter using uid
        tasks.filter(Q(uid=uid))

    return tasks


# activeWelders(
#   return_jobids (int): 1 or else, if 1 appends job ids of active welders in final built list
#   return_machineids (int): 1 or else, if 1 appends machine ids of active welders in final built list
#   return_taskids (int): 1 or else, if 1 appends task ids of active welders in final built list
#   start_date (str): starting date of filter FORMAT MUST BE: YYYY-MM-DD HH:MM:SS
#   end_date (str): ending date of filter FORMAT MUST BE: YYYY-MM-DD HH:MM:SS
# ) returns [list] of current welders, default returns just payroll/user ids, option parameters above append additional data
# If all optional parameters are 1 the list will be returned as:
# [[user id, job id, machine id, task id, datetime], [user id, job id, machine id, task id, datetime], ..., [user id, job id, machine id, task id, datetime]]
# One entry for each active welder

# Logic: If a welder logs into (100) a machine, but has not logged out, they are considered "Active"

def activeWelders(return_jobids, return_machineids, return_taskids, return_datetimes, start_date, end_date):

    tasks = getTasks(0, start_date, end_date) # store all tasks for all welders
    
    if (tasks == None):
        return None # skip all steps if there are no valid tasks

    actives = [] # initialise output list

    for t in tasks: # loop through valid tasks
        y = [] # initialise temporary list

        # Welder logs in, store their user ID in a temporary list
        if (t.type == 100):
            y.append(t.uid)

            # Build list, appending various columns as requested
            if (return_jobids == 1):
                y.append(t.job_id)
            if (return_machineids == 1):
                y.append(t.machine_id)
            if (return_taskids == 1):
                y.append(t.task_id)
            if (return_datetimes == 1):
                y.append(t.datetime)

            actives.append(y) # append temp list to output list

        # Welder Logs Out, remove from temporary list
        if (t.type == 101):
            for a in actives:
                if a[0] == t.uid:
                    actives.remove(a)

    return actives

#############################################################
#            Productivity Analytics Functions               #
#############################################################

# Productivity calculation is:
#
#       productivity = actual_hours / (shift_hours * expected_arctime_of_job / 60)
#
# Logic: Scan Timesheets of welder, store shift_hours, scan Tasks for comparable login/logout of same welder
#        store actual_hours between log in and log out, calculate worked job's arctime (category 1 = 10min
#        arctime), output calculation based on above algorithm

# getProductivity(
#   uid (int): payroll/user id of welder, if 0: all welders (unfinished, currently needs a uid to function)
#   mid (int): machine id, if 0: all machines
#   jid (int): job id, if 0: all machines
#   from_date (datetime): starting date of filter FORMAT MUST BE IN Python DateTime
#   to_date (datetime): ending date of filter FORMAT MUST BE IN Python DateTime
#   list_return (int): if 1 appends to output list task data used to calculate productivity
#  ) returns calculated overall productivity based on input parameters
# 
# If list_return is 1, returned list is in format:
#   [overall_productivity_value, [[[task_data], task_productivity_value], [[task_data], task_productivity_value], ..., [[task_data], task_productivity_value]]]
def getProductivity(uid, mid, jid, from_date, to_date, list_return):

    productivity_list = [] #initialise
    productivity_list_output = [] #initialise

    # If date parameters == 0, store earliest and latest dates from Timesheets
    # Check if int or str as some functions pass a string
    if (from_date == 0 or from_date == "0"):
        from_date = Timesheet_Entry.objects.earliest('date').date

    if (to_date == 0 or to_date == "0"):
        to_date = Timesheet_Entry.objects.latest('date').date

    task_db = [] #initialise

    results = Timesheet_Entry.objects.filter( #First Timesheet query, filtering on date parameters
        Q(date__gte=from_date) & Q(date__lte=to_date)
    )

    if uid != 0: #filter on payroll/user id, currently mandatory due to bugs if no welder present
        results = results.filter(
            Q(payroll_id=uid)
        )

    for shift in results: #loop through results from query

        shift_date = str(shift.date)[:10] #strip time from datetime
        shift_hours = shift.shift_length # store rostered shift hours

        tasks = Task.objects.filter( #Second query, on Tasks, find a comparable Task for welder + date
            Q(datetime__contains=shift_date)
        )

        if uid != 0:  # filter on payroll/user id, but doesn't function right now (in development)
            tasks = tasks.filter(
                Q(uid=uid)
            )

        if mid != 0: # filter on machine id if wanted
            tasks = tasks.filter(
                Q(machine_id=mid)
            )

        if jid != 0: # filter on job id if wanted
            tasks = tasks.filter(
                Q(job_id=jid)
            )

        for t in tasks: #loop through filtered valid tasks

            # On log in task type, store user and datetime in a temporary list
            if (t.type == 100):
                task_db.append(tuple([
                    t.uid,
                    t.datetime
                ]))

            # On log out task type, scan temporary list for comparable user/datetime
            if (t.type == 101):

                for i in task_db: #loop temp list to find linked log in

                    if (i[0] == t.uid): # find comparable entry in login temp list
                        weldtime = t.datetime - i[1] #calculate actual weld time based on login time and logout time

                        #calculate actual welding time in "decimal time"
                        #ie: 5hrs 30mins = 5.5
                        (h, m, s) = str(weldtime).split(':')
                        actual_hours = int(h) + int(m)/60 + int(s)/3600 

                        cid = Job.objects.get(
                            Q(job_id=t.job_id)
                        ).category # locate task job's category type

                        arctime = Category.objects.get(
                            Q(category_id=cid)
                        ).arctime # locate arctime based on category

                        target_productivity = float(DB_Settings.objects.get(setting_id=cid).value)/100

                        # calculate expected hours worked based on original timesheet entry
                        expected_productivity = (shift_hours*arctime/60) 

                        # calculate productivity ratio of actual_hours vs calculated expected
                        productivity = actual_hours/expected_productivity

                        productivity_list.append(productivity) # append value

                        productivity_list_output.append([ # append full task data + prod value to separate list
                                t.uid,
                                t.job_id,
                                t.machine_id,
                                str(datetime.strftime(t.datetime, '%Y-%m-%d')),
                                productivity,
                                target_productivity
                            ])

                        task_db.remove(tuple([i[0], i[1]])) # remove login/logout from temporary list so its not duplicated

    if (productivity_list): #if any valid productivity values exist
        if (list_return): #if chosen to append full task data, return average of productivity and data
            return [(sum(productivity_list) / len(productivity_list)), productivity_list_output]
        else: # otherwise, return average of stored productivities
            return (sum(productivity_list) / len(productivity_list))
    else:
        return None


def getProductivity2(uid, mid, jid, from_date, to_date, returnUid=-1, returnMid=-1, returnJid=-1):
    tasks = Task.objects.all()
    timesheets = Timesheet_Entry.objects.all()

    if from_date != 0:
        if type(from_date) == datetime:
            from_date = from_date.replace(hour=00, minute=00, second=00)
        elif type(from_date) == str:
            from_date = from_date[:10] + " 00:00:00"
        tasks = tasks.filter(datetime__gte=from_date)
        timesheets = timesheets.filter(date__gte=from_date)


    if to_date != 0:
        if type(to_date) == datetime:
            to_date = to_date.replace(hour=23, minute=59, second=59)
        elif type(from_date) == str:
            to_date = to_date[:10] + " 23:59:59"
        tasks = tasks.filter(datetime__lte=to_date)
        timesheets = timesheets.filter(date__gte=from_date)
        

    if uid != 0:
        tasks = tasks.filter(uid=uid)
        timesheets = timesheets.filter(payroll_id=uid)

    if jid != 0:
        tasks = tasks.filter(job_id=jid)
    if mid != 0:
        tasks = tasks.filter(machine_id=mid)

    data = []

    for i in tasks:

        if i.type == 100:
            startOfDay = i.datetime.replace(hour=00, minute=00, second=00)
            endOfDay = i.datetime.replace(hour=23, minute=59, second=59)
            logout = tasks.filter(
                type=101, datetime__gte=startOfDay, datetime__lte=endOfDay, uid=i.uid)
            if len(logout) == 1:
                logout = logout.first()
                actualTime = (logout.datetime - i.datetime).seconds / 3600
                machine = i.machine_id
                job = i.job_id
                user = i.uid
                timesheet = timesheets.filter(
                    date=startOfDay, payroll_id=i.uid).first()
                category = Job.objects.filter(job_id=job).first().category
                bookedTime = timesheet.shift_length
                arctime = Category.objects.filter(
                    category_id=category).first().arctime
                expectedTime = bookedTime*arctime/60
                productivity = actualTime / expectedTime

                data.append({
                    "uid": user,
                    "mid": machine,
                    "jid": job,
                    "category": category,
                    "bookedTime": bookedTime,
                    "expectedTime": expectedTime,
                    "actualTime": actualTime,
                    "productivity": productivity

                })
                

    count = 0
    productivitySum = []

    # for i in data:
    #     print(i["jid"], i["productivity"])

    if len(data) == 0:
        return None

    #if all 3 returns are set to -1, return the average
    if returnUid == -1 and returnMid == -1 and returnJid == -1:
        for i in data:
            productivitySum.append(i["productivity"])
            count = count+1
        return(sum(productivitySum) / count)

    dataReturn = {}

    if returnUid == 1:
        for i in data:
            if i["uid"] in dataReturn:
                dataReturn[i["uid"]].append(i["productivity"])
            else:
                dataReturn[i["uid"]] = [i["productivity"]]

    if returnMid == 1:
        for i in data:
            if i["mid"] in dataReturn:
                dataReturn[i["mid"]].append(i["productivity"])
            else:
                dataReturn[i["mid"]] = [i["productivity"]]

    if returnJid == 1:
        for i in data:
            if i["jid"] in dataReturn:
                dataReturn[i["jid"]].append(i["productivity"])
            else:
                dataReturn[i["jid"]] = [i["productivity"]]


    for k, v in dataReturn.items():
        dataReturn[k] = sum(dataReturn[k])/len(dataReturn[k])

    return dataReturn













# getAllProductivity(
#   from_date (datetime or str): starting date of filter
#                               Format must be datetime, but a str() may be passed and converted
#   to_date (datetime or str): ending date of filter
#                               Format must be datetime, but a str() may be passed and converted
# datetime is required to iterate through the date range, all other functions pass str dates, so kept that option
def getAllProductivity(from_date, to_date):

    total_productivity = [] #initialise
    welders = User_List.objects.values_list('payroll_id', flat=True) #create a list of welders

    # convert string dates to python date formats
    if (isinstance(from_date, str)):
        from_date = datetime.strptime(from_date, '%Y-%m-%d')
    else: #if originally a datetime, convert to date
        from_date = from_date.date()

    if (isinstance(to_date, str)):
        to_date = datetime.strptime(to_date, '%Y-%m-%d')
    else:
        to_date = to_date.date()
    
    #Iterate through date range
    while (from_date <= to_date):

        # on each date, for each loop through welders and get any productivities that exist
        for w in welders:
            p = getProductivity(w, 0, 0, from_date, from_date, 1)
            #print(p)
            if p: #if productivity exists, append it to temp list
                total_productivity.append(p)

        from_date = from_date + timedelta(days=1) #increment the date

    # if any productivity was returned, calculate overall productivity average and return it
    # with productivity task data
    if total_productivity:
        productivity_sum = 0
        for p in total_productivity:
            productivity_sum += p[0]
        return [(productivity_sum / len(total_productivity)), total_productivity]

    else:
        return None

# DEPRECATED FUNCTION. May be used in future, but was replaced by getAllProductivity()
# Used to draw original version of productivity line graph, returns [y-values, x-values]
# getProgressiveProductivity(
#   uid (int): payroll/user id of welder
#   mid (int): machine id
#   jid (int): job id
#   periods (list): list of periods (days), ie: [100, 50, 1]
# ) returns string of productivity values based on period list and periods
# [y-values = productivity, x-values = day periods]
def getProgressiveProductivity(uid, mid, jid, periods):

    output = [] #initialise
    xaxis = periods.copy() #initialise
    for t in periods: #loop through periods

        # find productivity for welder between today and period
        productivity = getProductivity(
            uid, mid, jid, getPeriodDate(0), getPeriodDate(int(t)), 0)

        if (productivity == None): #if no productivity on day, remove xaxis label
            xaxis.remove(t)

        else:
            productivity = productivity * 100 #calc N% value of productivity rather than decimal ratio
            output.append(productivity)

    return [','.join(map(str, output)), xaxis] #return list to pass to chart.js graph code


# activeProductivity(
#   period (int): if 0, full range of data, otherwise number of days off latest date in Tasks
# ) returns list of Active Tasks between now and time delta period of days in past
# This function returns various interesting datapoints and information to Live Dashboard page
# in one function
def activeProductivity(period):

    latest = Task.objects.latest('datetime').datetime #get latest Task datetime
    date = latest - (timedelta(days=period)) #calculate date based on period

    if (period == 0): #if period is 0, set as earliest date instead
        date = Task.objects.earliest('datetime').datetime
    
    #print(str(date))
    #obtain active welders/machines between two date ranges
    active_machines = activeWelders(1, 1, 1, 1, str(date), static.LIVE_DATE)
    #active_machines = activeWelders(1, 1, 1, 1, date, static.LIVE_DATE)

    activeJobs = [] #initialise

    # built list will have this form
    # 0,    1,      2,      3,  4
    # uid, job, machine, task, datetime
    
    if active_machines:

        expected = 0
        for x in active_machines:  # loop through active welders/machines and build list

            # get expected productivity for job welder is working on
            category = getJob(x[1]).category
            expected = float(DB_Settings.objects.get(setting_id=category).value)/100

            activeJobs.append({
                'machineName': machineDetails(x[2])[0],
                'machineID': x[2],
                'jobID': x[1],
                'category': category,
                'workerName': welderName(x[0])[0]+" "+welderName(x[0])[1],
                'workerID': x[0],
                'current': getProductivity(x[0], 0, 0, str(date), static.LIVE_DATE, 0),
                'expected': expected,
                'tid': x[3]
            })

    return activeJobs


# machineDetails(
#   mid (int): machine id
# ) returns description and location id of machine
def machineDetails(mid):
    try:
        machine = Machine.objects.get(machine_id=mid)
        return [machine.desc, machine.location_id]
    except:
        return None

##################################################
#                Welder Functions                #
##################################################

# welderName(
#   uid (int): payroll/user id of welder
# ) returns Full Name of welder
def welderName(uid):
    try:
        user = User_List.objects.get(payroll_id=uid)
        return [user.first_name, user.last_name]

    except:
        return "Invalid User ID"

# getAllWelders() returns list of names for all welders
# if employed (employment_status = 1)
# ordered by last name, may be improved in future with various sorting options
def getAllWelders():
    welders = User_List.objects.values_list('payroll_id', 'first_name', 'last_name')
    return welders.filter(
        Q(employment_status=1)
    ).order_by('last_name')

# getWelder(
#   uid (int): payroll/user id
# ) returns QuerySet of welder from payroll id
def getWelder(uid):
    try:
        welder = User_List.objects.get(
            Q(payroll_id=uid)
        )
    except:
        welder = None

    return welder

##################################################
#                Machine Functions               #
##################################################


# getAllMachines() returns list of all Machine objects
def getAllMachines():
    machines = Machine.objects.values_list('machine_id', 'desc', 'location_id')
    return machines

# getMachine(
#   mid (int): machine id
# ) return specific machine based on id
def getMachine(mid):
    try:
        machine = Machine.objects.get(
            Q(machine_id=mid)
        )
    except:
        machine = None

    return machine

##################################################
#               Job Functions                    #
##################################################

# getJob(
#   jid (int): job id
# ) returns specific job
def getJob(jid):
    try:
        job = Job.objects.get(
            Q(job_id=jid)
        )
    except:
        job = None
    
    return job

# getAllJobs(
#   active (int): 0, 1, or 2. If 0 = return all jobs, if 1 return active jobs, if 2 return inactive jobs (has ended date)
#   sort_type (str): sort type for output jobs, current sorting types:
#                   remainingP (remaining hrs %)
#                   remainingN (remaining hrs count)
#                   date (start date of job)
#                   job (job id)
#   order (str): d = descending, a = ascending
# ) returns list of jobs based on input parameters
def getAllJobs(active, sort_type, order):

    # parse list of all jobs
    jobs = Job.objects.values_list('job_id', 'category', 'start_date', 'end_date', 'accum_hrs', 'total_hrs')
    
    # store sort type into variable ob which is passed to filter function
    if sort_type == 'date':
        ob = 'start_date' #if date, set as start_date column of DB table

    elif sort_type == 'remainingN':
        ob = 'ordering' #if remaining hrs set to 'ordering' as this a temporary variable created in annotate function below

        if order == 'd':
            ob = '-' + ob #in all cases, if ordering is desc, prepend a negative sign to bring of ordering type (- = desc)

        # F() allows for calculating on columns and ordering via new calculated column
        # Calculate the difference of total hrs vs accumulated hrs and order by this
        jobs = jobs.filter().annotate(ordering=F('total_hrs') - F('accum_hrs')).order_by(ob)

        # determine if active or inactive (or both) jobs required and return either
        if (active == 1):
            return jobs.filter(Q(end_date=None))
        elif (active == 2):
            return jobs.filter(~Q(end_date=None))
        else:
            return jobs

    # As above with remainingN, but percentage of hours remaining
    elif sort_type == 'remainingP':
        ob = 'ordering'

        if order == 'd':
            ob = '-' + ob

        # Calculate percentage of hours remaining and order by this new calculated column
        jobs = jobs.filter().annotate(ordering=(F('total_hrs') - F('accum_hrs')) / F('total_hrs')).order_by(ob)

        # determine if active or inactive (or both) jobs required and return either
        if (active == 1):
            return jobs.filter(Q(end_date=None))
        elif (active == 2):
            return jobs.filter(~Q(end_date=None))
        else:
            return jobs


    # sort by job id
    elif sort_type == 'job':
        ob = 'job_id'
    else: #otherise, sort by accum hrs
        ob = 'accum_hrs'
    
    if order == 'd':
        ob = '-' + ob #prepend - if descending

    # filter and return what jobs are wanted (active, inactive, or both)
    if (active == 1):
        return jobs.filter(
            Q(end_date=None)
        ).order_by(ob)
    elif (active == 2):
        return jobs.filter(
            ~Q(end_date=None)
        ).order_by(ob)
    else:
        return jobs.filter().order_by(ob)

# getJobHistoric(
#   jid (int): job id
# ) returns list of various datapoints for graphing purposes on Job Tracking Dashboard for a specific job
# list format:
#   [[worked_hrs_for_job], [accumulated_work_hr_for_job], [dates_of_tasks], [task_data_for_job]]
def getJobHistoric(jid):

    output = None # initialise, important in case jid doesn't exist
    task_db = [] # initialise temp list

    tasks = Task.objects.filter(job_id=jid) #grab tasks for specified job

    welders = User_List.objects.all() #grab welders
    welder_names = [] #initialise

    for w in welders: # welder names are used multiple times, store as list to reduce DB calls
        welder_names.append(tuple([w.payroll_id, w.first_name, w.last_name]))

    job_table_data, xlabels, y_values_bar, y_values_line = [], [], [], [] #initialise temp lists

    if tasks: #if tasks exist

        for t in tasks: #loop through each task

            # find log in and append to temp list the task details
            if (t.type == 100):

                task_tuple = tuple([t.job_id, t.uid, t.datetime, t.machine_id])
                task_db.append(task_tuple)

            # find log out and search temp list for comparable log in
            if (t.type == 101):

                for i in task_db:

                    if (i == task_tuple):

                        # Get number of hours between log in and log out
                        task_hrs = t.datetime - i[2]

                        # convert to a decimal time
                        # 5hrs 30mins = 5.5
                        (h, m, s) = str(task_hrs).split(':')
                        actual_hours = round(
                            int(h) + int(m)/60 + int(s)/3600, 2)

                        str_datetime = str(t.datetime.date()) # convert datetime to string

                        name = [(n[1], n[2])
                                for n in welder_names if n[0] == t.uid] #find welder and return name

                        # store all calculated/found data into core list
                        job_table_data.append(
                            [t.job_id, t.uid, name, str_datetime, t.machine_id, actual_hours])

                        # Append an empty value + date if no work was done on date
                        if (len(xlabels) > 0):
                            last_date = datetime.strptime(xlabels[len(xlabels)-1], '%Y-%m-%d').date()
                            date_diff = (t.datetime.date()-last_date).days -1
                            if (date_diff > 0):
                                while date_diff != 0:
                                    xlabels.append(str(t.datetime.date() - timedelta(days=date_diff)))
                                    y_values_bar.append(0)
                                    y_values_line.append(y_values_line[len(y_values_line)-1])
                                    date_diff -= 1
                        
                        xlabels.append(str_datetime) # dates into xlabel list
                        
                        y_values_bar.append(actual_hours) #hours into y_values list (bar graph)

                        # calculate accumulated hours, ie:
                        # task A = 5hrs, task B = 3hrs, task C = 1.5hrs
                        # [5, 3+5=8, 1.5+8=9.5, ...]
                        # [5, 8, 9.5, ...]
                        # list grows and accumulates on each task
                        if (y_values_line):
                            add_value = y_values_line[len(y_values_line)-1]
                        else:
                            add_value = 0
                        y_values_line.append((actual_hours+add_value))

                        # remove login/logout from temp list
                        task_db.remove(task_tuple)

    # output built list primarily used for graph and table on Job Tracking Dashboard Page
    output = [y_values_bar, y_values_line, xlabels, job_table_data]
    return output


##########################################################
#                   MISC FUNCTIONS                       #
##########################################################


def expectedProductivity():
    return float(DB_Settings.objects.get(setting_id=1).value)/100

# getPeriodDate(
#   period (int): days in past from latest date in database
#                  if 0: just return earliest date
#                  if -1: just return latest date
# ) return date in YYY-MM-DD format from input period
def getPeriodDate(period):

    latest = Task.objects.latest('datetime').datetime #get latest date from DB
    date = latest - (timedelta(days=period)) # calculate period of days since that date

    # if earliest date wanted, 0 is passed
    if (period == 0):
        date = Task.objects.earliest('datetime').datetime
    # if latest date is wanted, 1 is passed
    elif (period == -1):
        date = Task.objects.latest('datetime').datetime

    return datetime.strftime(date, '%Y-%m-%d')

### getValid functions used on Dashboard to search for matching welders, machines, or jobs
### based on input parameters.

### All functions work the same:
# ie: if want valid user ids, input machine+jid combo for all users that did those
# or, if want valid machines, input uid+jid combo for all machines that use those two
# Return valid UIDs from optional jid/mids
def getValidUIDs(mid, jid, from_date, to_date):

    if (from_date == 0 or from_date == "0"):
        from_date = Task.objects.earliest('datetime').datetime

    if (to_date == 0 or to_date == "0"):
        to_date = Task.objects.latest('datetime').datetime

    results = Task.objects.filter(
        Q(datetime__gte=from_date) & Q(datetime__lte=to_date)
    )

    if jid != 0:
        results = results.filter(job_id=jid)
    
    if mid != 0:
        results = results.filter(machine_id=mid)

    return results

# Return valid JIDs from optional uid/mids
def getValidJIDs(u, mid, from_date, to_date):

    if (from_date == 0 or from_date == "0"):
        from_date = Task.objects.earliest('datetime').datetime

    if (to_date == 0 or to_date == "0"):
        to_date = Task.objects.latest('datetime').datetime

    results = Task.objects.filter(
        Q(datetime__gte=from_date) & Q(datetime__lte=to_date)
    )

    if u != 0:
        results = results.filter(
            Q(uid=u)
        )

    if mid != 0:
        results = results.filter(
            Q(machine_id=mid)
        )

    return results

# Return valid MIDs from optional uid/jids
def getValidMIDs(u, jid, from_date, to_date):

    if (from_date == 0 or from_date == "0"):
        from_date = Task.objects.earliest('datetime').datetime

    if (to_date == 0 or to_date == "0"):
        to_date = Task.objects.latest('datetime').datetime

    results = Task.objects.filter(
        Q(datetime__gte=from_date) & Q(datetime__lte=to_date)
    )

    if u != 0:
        results = results.filter(
            Q(uid=u)
        )

    if jid != 0:
        results = results.filter(
            Q(job_id=jid)
        )

    return results




#########################################
#                                       #
#               TEMPLATES               #
#                                       #
#########################################




################################
#     PRODUCTIVITY DB HOME     #
################################

@login_required
def productivityDashboard(request):

    # Date Functions
    # Both datetime and str(datetime)'s are required for functions and use on the page
    # note: don't use getPeriodDate() because that returns a string and we must use timedelta function below
    earliest_date = Task.objects.earliest('datetime').datetime # get latest date
    str_earliest_date = datetime.strftime(earliest_date, '%Y-%m-%d') # convert to str
    curr_date = Task.objects.latest('datetime').datetime # get current date
    # calculate a start date based on DEFAULT_DAYS set at top of Views
    start_date = curr_date - relativedelta(days=+static.DEFAULT_DAYS)
    str_curr_date = datetime.strftime(curr_date, '%Y-%m-%d')
    str_start_date = datetime.strftime(start_date, '%Y-%m-%d')
    str_today = datetime.strftime(datetime.today(), '%Y-%m-%d')
    days_since_first = (datetime.strptime(str_today, '%Y-%m-%d') - datetime.strptime(str_earliest_date, '%Y-%m-%d')).days
    days_since_last = (datetime.strptime(str_today, '%Y-%m-%d') - datetime.strptime(str_curr_date, '%Y-%m-%d')).days

    all_productivity = getAllProductivity(start_date, curr_date) #obtain all productivity values based on calc'd dates
    #print(all_productivity)
    productivity_list, all_productivity_value, new_productivity_targets = [], [], [] #initialise

    # split productivity data into value and data list
    if all_productivity:
        all_productivity_value = all_productivity[0]
        productivity_list = all_productivity[1]

    # initialise
    new_productivity, new_productivity_labels, new_productivity_list = [], [], []
    productivity_js = None #temp json storage variable
    npl_js = None #temp json storage variable

    # if a valid productivity value was returned, perform functions on it
    if productivity_list:
        productivity_list = productivity_list[1:]
        #print(productivity_list)
        for p in productivity_list:
            # build data for graph + table
            new_productivity_list.append([p[1][0][0], p[1][0][1], p[1][0][2], p[1][0][3], p[1][0][4], p[1][0][5]])
            new_productivity.append(float(p[1][0][4])*100) #append productivity value, multiple by 100x for graphing purposes
            new_productivity_targets.append(p[1][0][5])
            new_productivity_labels.append(p[1][0][3]) #append date for x-axis label

        productivity_list = new_productivity_list.copy()

        prod_average_target = sum(new_productivity_targets) / len(new_productivity_targets)

        #json storage required for 'safe' transfer to HTML, ie: -'s and spaces are converted to & tags and cause javascript errors
        productivity_js = simplejson.dumps(productivity_list)
        npl_js = simplejson.dumps(new_productivity_labels)

    #Pass Context Variables to Template
    return render(request, "productivity-dashboard.html", {
        
        'productivity_value': all_productivity_value,
        'productivity_list': productivity_list,
        'productivity_json': productivity_js,
        'new_productivity': new_productivity,
        'new_productivity_labels': npl_js,
        'new_productivity_targets': new_productivity_targets,
        'welders': getAllWelders(),
        'machines': getAllMachines(),
        'expected': prod_average_target,
        'jobs': getAllJobs(None, 'date', 'a'),
        'active_jobs': getAllJobs(1, 'date', 'a'),
        'ended_jobs': getAllJobs(2, 'date', 'a'),
        'home': True,
        'fd': str_start_date,
        'td': str_curr_date,
        'days_since_first': days_since_first,
        'days_since_last': days_since_last
    })


#######################################
#       PRODUCTIVITY DB FILTERED      #
#######################################

@login_required
def productivityDashboardFiltered(request, welder, machine, job, fromdate, todate):

    # Date Functions
    earliest_date = getPeriodDate(0)
    curr_date = Task.objects.latest('datetime').datetime
    str_curr_date = datetime.strftime(curr_date, '%Y-%m-%d')
    str_today = datetime.strftime(datetime.today(), '%Y-%m-%d')
    days_since_first = (datetime.strptime(
        str_today, '%Y-%m-%d') - datetime.strptime(earliest_date, '%Y-%m-%d')).days
    days_since_last = (datetime.strptime(str_today, '%Y-%m-%d') -
                       datetime.strptime(str_curr_date, '%Y-%m-%d')).days

    # initialise temp lists
    # "new" variables are the latest iteration for the linegraph, getProgressiveProductivity() is deprecated and its use was removed
    new_productivity, new_productivity_labels, new_productivity_targets = [], [], []
    productivity_js = None
    npl_js = None
    productivity = None
    prod_average_target = 0

    productivity_results = getAllProductivity(fromdate, todate)
    all_productivity = productivity_results[0] # get all productivity, used for averages/trends

    if (welder > 0): # if filtered options includes a welder UID, get Productivity of that welder
        productivity_list = getProductivity(
            welder, machine, job, fromdate, todate, 1) # grab productivity of selected input url parameters
        if productivity_list:
            productivity_list = productivity_list[1]
            for p in productivity_list:
                new_productivity.append(float(p[4])*100) # re-generate productivity list data for graph/table on page
                new_productivity_labels.append(p[3]) # store graph x labels (dates)
                new_productivity_targets.append(p[5])

            productivity_js = simplejson.dumps(productivity_list) # convert lists to json objects as Django handles text better
            npl_js = simplejson.dumps(new_productivity_labels)
            prod_average_target = sum(new_productivity_targets) / len(new_productivity_targets)
        
            productivity = (sum(new_productivity) / len(new_productivity))/100 # productivity is average of all productivity values

    else: # if filtered options wants ALL welders, get Productivity of all welders, lists are handled differently
        
        productivity_list = None #initialise
        new_productivity_list = []

        productivity = all_productivity

        if (isinstance(all_productivity, list)):
            productivity_list = all_productivity.copy() #make a copy of the all productivity data
            
            # set productivity value to first item in list (average of all task productivities)
            productivity = productivity_list[0]

            #reset productivity list to remove first item (overall productivity value)
            productivity_list = productivity_list[1:]
            
            for p in productivity_list:
                for l in p:
                    new_productivity_list.append(
                        [l[1:][0][0][0], l[1:][0][0][1], l[1:][0][0][2], l[1:][0][0][3], l[1:][0][0][4], l[1:][0][0][5]])  # due to unusual nature of productivity list output, need to build a new list to transform data correctly
                    # append productivity value, multiple by 100x for graphing purposes
                    new_productivity.append(float(l[1:][0][0][4])*100)
                    # append date for x-axis label
                    new_productivity_labels.append(l[1:][0][0][3])
                    new_productivity_targets.append(l[1:][0][0][5])

        else:
            productivity_list = productivity_results[1:]
            for p in productivity_list:
                for l in p:
                    #print(l)
                    new_productivity_list.append(
                        [l[1][0][0], l[1][0][1], l[1][0][2], l[1][0][3], l[1][0][4], l[1][0][5]]
                    )
                    new_productivity.append(float(l[1][0][4]*100))
                    new_productivity_labels.append(l[1][0][3])
                    new_productivity_targets.append(l[1][0][5])

        
        #same logic as above, but with all data
        if productivity_list:
            print(new_productivity_targets)
            # generate json objects of data
            productivity_list = new_productivity_list.copy()
            productivity_js = simplejson.dumps(productivity_list)
            npl_js = simplejson.dumps(new_productivity_labels)
            prod_average_target = sum(new_productivity_targets) / len(new_productivity_targets)

    valid_welders, valid_machines, valid_jobs = None, None, None #initialise

    # If no productivity figure was returned, it must not be a valid combo of uid+mid+jid
    # Search and return a list of valid combinations, used as dropdowns on page in the form of an "error: reselect data"
    if productivity == None:
        valid_uids = getValidUIDs(machine, job, fromdate, todate)
        valid_welders = []
        for u in valid_uids:
            w_uid = int(u.uid)
            w = getWelder(w_uid)
            if w:
                welder_value = [w_uid, w.first_name, w.last_name]
                if welder_value not in valid_welders:
                    valid_welders.append(welder_value)


        valid_mids = getValidMIDs(welder, job, fromdate, todate)
        valid_machines = []
        for m in valid_mids:
            n = getMachine(int(m.machine_id))
            if n:
                machine_value =  [n.machine_id, n.desc]
                if machine_value not in valid_machines:
                    valid_machines.append(machine_value)

        valid_jids = getValidJIDs(welder, machine, fromdate, todate)
        valid_jobs = []

        for j in valid_jids:
            i = getJob(int(j.job_id))
            if i:
                job_value = i.job_id
                if job_value not in valid_jobs:
                    valid_jobs.append(job_value)

    # Trending calculation, last value vs productivity
    trending = 0
    last_prod = 0

    if new_productivity:
        last_prod = new_productivity[len(new_productivity)-1] # latest value in productivity list

        # Set trending, -1 is trending down, = is trending up
        if round(productivity*100) > last_prod:
            trending = -1
        elif round(productivity*100) < last_prod:
            trending = 1

    #Pass Context Variables to Template
    return render(request, "productivity-dashboard.html", {
        'productivity_value': productivity,
        'productivity_all': all_productivity,
        'productivity_list': productivity_list,
        'productivity_json': productivity_js,
        'new_productivity': new_productivity,
        'new_productivity_labels': npl_js,
        'new_productivity_targets': new_productivity_targets,
        'expected': prod_average_target,
        'prod_trending': trending,
        'last_prod': last_prod/100,
        'welders': getAllWelders(),
        'w': getWelder(welder),
        'machines': getAllMachines(),
        'm': getMachine(machine),
        'jobs': getAllJobs(None, 'date', 'a'),
        'j': getJob(job),
        'welder_tasks': getTasks(welder, fromdate, todate),
        'valid_welders': valid_welders,
        'valid_machines': valid_machines,
        'valid_jobs': valid_jobs,
        'latest_date': getPeriodDate(-1),
        'earliest_date': getPeriodDate(0),
        'days_since_first': days_since_first,
        'days_since_last': days_since_last,
        'w_url': welder,
        'm_url': machine,
        'j_url': job,
        'fd_url': fromdate,
        'td_url': todate,
        'fd': str(fromdate),
        'td': str(todate)
    })


#########################################
#             LIVE MACHINES             #
#########################################

################################
#      LIVE MACHINES HOME      #
################################

@login_required
def liveMachines(request):
    
    #Pass Context Variables to Template
    return render(request, "live-machines.html", {
        'activeJobs': activeProductivity(static.DEFAULT_DAYS), # generate active jobs/machines based on set days range at top
        'periodDate': getPeriodDate(30),
        'currDate': static.LIVE_DATE[:-9] #trim datetime for just date
    })

###################################
#       LIVE MACHINES PERIOD      #
###################################


@login_required
def livePeriod(request, period):

    #Pass Context Variables to Template
    return render(request, "dashboard-home.html", {
        'activeJobs': activeProductivity(period), #get active productivity for set period of days
        'period': period,
        'periodDate': getPeriodDate(period),
        'currDate': static.LIVE_DATE[:-9]
    })



################################################
#           JOB TRACKING DASHBOARD             #
################################################


###################################
#       LIVE MACHINES PERIOD      #
###################################

@login_required
def jobs(request):

    # initialise int storage variables
    total_accum_hrs, total_hrs, overworked_hrs, overworked_jobs, overworked_jobs_hrs, completed_jobs = 0, 0, 0, 0, 0, 0

    jobs = getAllJobs(None, 'worked', 'd') #grab ALL jobs
    active_jobs = getAllJobs(1, 'worked', 'd') #grab only active jobs
    inactive_jobs = getAllJobs(2, 'worked', 'd') #grab only inactive jobs

    ######### Interesting Data Cards on top of Dashboard, only examples to showcase to SmartFab
    # Loop through jobs and calculate accum and total hrs for all jobs
    for j in jobs:
        total_accum_hrs += j[4]
        total_hrs += j[5]
        if (j[3] != None):
            diff_hrs = j[4]-j[5]

            # 0.5% over goal is a temporary figure for considering a job as overworked
            if (diff_hrs/j[5] >= 0.005):
                overworked_hrs += (diff_hrs)
                overworked_jobs += 1
                overworked_jobs_hrs += j[5]

    # calculate ratios/%s for jobs and hours
    jobs_ratio = len(inactive_jobs) / len(jobs)
    hours_ratio = total_accum_hrs / total_hrs

    # Find completed jobs in the last 30 days
    date = Task.objects.latest('datetime').datetime - timedelta(days=30)
    for j in jobs:
        if (j[3]):
            if(j[3] >= datetime.date(date)):
                completed_jobs += 1
    
    #Pass Context Variables to Template
    return render(request, "jobstracker.html", {
        'home': True,
        'periodDate': getPeriodDate(30),
        'currDate': static.LIVE_DATE[:-9],
        'jobs': jobs,
        'active_jobs': active_jobs,
        'inactive_jobs': inactive_jobs,
        'jobs_ratio': jobs_ratio,
        'j': 1,
        'total_accum_hrs': total_accum_hrs,
        'total_hrs': total_hrs,
        'overworked_hrs': overworked_hrs,
        'overworked_jobs': overworked_jobs,
        'overworked_jobs_hrs': overworked_jobs_hrs,
        'completed_jobs': completed_jobs,
        'hours_ratio': hours_ratio,
        'sort_type': 'worked',
        'order': 'd'

    })

#########################################################
#           JOB TRACKING FILTERED DASHBOARD             #
#########################################################


@login_required
def jobsFiltered(request, job, filtered_type, sort_type, order):

    # initialise
    total_accum_hrs, total_hrs, overworked_hrs, overworked_jobs, overworked_jobs_hrs, completed_jobs = 0, 0, 0, 0, 0, 0

    # same logic as non-filtered page, just with specific job id
    jobs = getAllJobs(None, sort_type, order)
    active_jobs = getAllJobs(1, sort_type, order)
    inactive_jobs = getAllJobs(2, sort_type, order)

    for j in jobs:
        total_accum_hrs += j[4]
        total_hrs += j[5]
        if (j[3] != None):
            diff_hrs = j[4]-j[5]

            if (diff_hrs/j[5] >= 0.005):
                overworked_hrs += (diff_hrs)
                overworked_jobs += 1
                overworked_jobs_hrs += j[5]

    jobs_ratio = len(inactive_jobs) / len(jobs)
    hours_ratio = total_accum_hrs / total_hrs

    date = Task.objects.latest('datetime').datetime - timedelta(days=30)
    for j in jobs:
        if (j[3]):
            if(j[3] >= datetime.date(date)):
                completed_jobs += 1

    #Pass Context Variables to Template
    return render(request, "jobstracker.html", {
        'periodDate': getPeriodDate(30),
        'currDate': static.LIVE_DATE[:-9],
        'jobs': jobs,
        'active_jobs': active_jobs,
        'inactive_jobs': inactive_jobs,
        'jobs_ratio': jobs_ratio,
        'j': job,
        'sort_type': sort_type,
        'filtered_type': filtered_type,
        'order': order,
        'j_url': job,
        'f_url': filtered_type,
        's_url': sort_type,
        'o_url': order,
        'total_accum_hrs': total_accum_hrs,
        'total_hrs': total_hrs,
        'overworked_hrs': overworked_hrs,
        'overworked_jobs': overworked_jobs,
        'overworked_jobs_hrs': overworked_jobs_hrs,
        'completed_jobs': completed_jobs,
        'hours_ratio': hours_ratio,
        'hours_ratio': hours_ratio,
        'order': order
    })

#########################################################
#           JOB TRACKING HISTORIC DASHBOARD             #
#########################################################


@login_required
def jobsHistoric(request, jid):

    # Grab data for all jobs and individual job id
    jobs = Job.objects.values_list('job_id', 'category', 'start_date', 'end_date', 'accum_hrs', 'total_hrs')
    job = jobs.get(job_id=jid)
    

    # dates for urls to productivity dashboard
    earliest_date = getPeriodDate(0)
    latest_date = getPeriodDate(-1)

    # Calculate "real world" times for total and accum hrs
    #h_a = hour_accum, m_a min_accum so you can say 5.5 = 5hrs 30mins
    #h_t = hour_total, m_t = min,_total
    if job:
        (h_a, m_a) = str(job[4]).split('.')
        h_a = int(h_a)
        m_a = int((int(m_a[:2])/100)*60)

        (h_t, m_t) = str(job[5]).split('.')
        h_t = int(h_t)
        m_t = int((int(m_t[:2])/100)*60)

    # get historic data for job id
    job_data = getJobHistoric(jid)

    job_labels_js = None, None, None # initialise

    # if data exists, split it up into each individual type to pass as Context variables
    if job_data:
        table_data = job_data[3]
        xlabels = job_data[2]
        y_values_bar = job_data[1]
        y_values_line = job_data[0]

        job_labels_js = simplejson.dumps(xlabels) #json object to better handle text in HTML

    # Get status to output as an indicator on page
    status = "Active"
    if job[4] >= job[5]:
        status = "Completed"

    #Pass Context Variables to Template
    return render(request, "jobs-dashboard.html", {
        'j': job,
        'jobs': jobs,
        'j_url': jid,
        'job_data': job_data,
        'table_data': table_data,
        'xlabels': job_labels_js,
        'y_values_bar': y_values_bar,
        'y_values_line': y_values_line,
        'job_hrs': job[4],
        'job_total_hrs': job[5],
        'h_a': h_a,
        'm_a': m_a,
        'h_t': h_t,
        'm_t': m_t,
        'status': status,
        'earliest_date': earliest_date,
        'latest_date': latest_date
    })

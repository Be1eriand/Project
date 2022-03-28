from django.shortcuts import render
from django.http import HttpResponse
from .models import *
from django.db.models import Q
from datetime import *
from dashboard.models import * #imports the models created in the dashboard
from django.db.models.query import QuerySet
from django.template.defaulttags import register
from dateutil.relativedelta import relativedelta
from django.contrib.auth.decorators import login_required
# Create your views here.


@login_required
def home(request):
    return render(request, "report-home.html", {
            'users': User_List.objects.all(),
            'machines': Machine.objects.all(),
            'jobs': Job.objects.all()
        })


@login_required
def report1(request, job=None):

    if job is None:
        job = int(request.POST.get("job"))
    jobObject = Job.objects.filter(job_id = job).first()
    startDate = jobObject.start_date
    endDate = jobObject.end_date

    #Get all tasks associated with a job
    tasks = Task.objects.filter(job_id = job)

    #Get all workers associated with the job
    workers = []
    workerName = {}
    for i in tasks:
        if i.uid not in workers:
            workers.append(i.uid)
            workerObj = User_List.objects.filter(payroll_id = i.uid).first()
            workerName[i.uid] = workerObj.first_name + " " + workerObj.last_name

    bookedHoursPerWorker = {}
    actualHoursPerWorker = {}
    expectedHoursPerWorker = {}
    productivityPerWorker = {}
    for i in workers:
        bookedHoursPerWorker[i] = getBookedTimePerJob(i, job, 0, 0)[job]
        actualHoursPerWorker[i] = getActualTimePerJob(i, job, 0, 0)[job]
        expectedHoursPerWorker[i] = getExpectedTimePerJob(bookedHoursPerWorker[i], job)
        productivityPerWorker[i] = actualHoursPerWorker[i] / expectedHoursPerWorker[i]


    #to do 
        #time active = time since job start date to start end date (or now)

    return render(request, "report-1.html", {
        "jobNumber": job,
        "workers": workers,
        "totalProductivity": getProductivity2(0, 0, job, 0, 0),
        "bookedHoursPerWorker": bookedHoursPerWorker,
        "actualHoursPerWorker": actualHoursPerWorker,
        "expectedHoursPerWorker": expectedHoursPerWorker,
        "productivityPerWorker": productivityPerWorker,
        "totalBooked": sum(bookedHoursPerWorker.values()),
        "totalExpected": sum(expectedHoursPerWorker.values()),
        "totalActual": sum(actualHoursPerWorker.values()),
        "numberOfWelders": len(workers),
        "workerName": workerName,
    })


@login_required
def report2(request, employee=None, fromDate=None, toDate=None):

    productivityByMachine = {}
    productivityByJob = {}

    # Get the employee data if it wasn't parsed in the url 
    if employee is None:
        employee = int(request.POST.get("employee"))
    
    #Get name of employee
    employeeObject = User_List.objects.filter(payroll_id = employee).first()
    name = employeeObject.first_name + " " +  employeeObject.last_name


    # #Get the date range if it wasn't parsed in the url 
    if fromDate is None:
        dateSelection = request.POST.get("date")
        fromDate = getDateRange(dateSelection).date().strftime("%Y-%m-%d")
    if toDate is None:
        toDate = str(datetime.now().date().strftime("%Y-%m-%d"))

    fromDate = fromDate + " 00:00:00"
    toDate = toDate  + " 23:59:59"


    
    
    bookedTime = getBookedTimePerJob(employee, 0, fromDate, toDate)
    expectedTime = getExpectedTimePerJob(bookedTime)
    actualTime = getActualTimePerJob(employee, 0, fromDate, toDate)
    earliestDates = getEarliestDates(employee)
    latestDates = getLatestDates(employee)



    #Gets the total average productivity of a worker
    userTotal = getProductivity(employee, 0, 0, fromDate, toDate)

    #Gets the average productivity of a worker by machine
    for machine in Machine.objects.all():
        i = getProductivity(employee, machine.machine_id, 0, fromDate, toDate)
        if (i is not None):
            productivityByMachine[machine.desc] =  i

    #Gets the average productivity of a worker by job
    for job in Job.objects.all():
        i = getProductivity(employee, 0, job.job_id, fromDate, toDate)
        #only add jobs the employee has worked on to the list
        if (i is not None):
            productivityByJob[job.job_id] = i

    #total productivity across all users, machines, job, etc in timeframe
    totalProductivity  = getAllProductivity(fromDate, toDate)



    return render(request, "report-2.html", {
        "totalProductivity": totalProductivity,
        "userTotal": userTotal,
        "productivityByMachine": productivityByMachine,
        "productivityByJob": productivityByJob,
        "fromDate": fromDate[:10],
        "toDate": toDate[:10],
        "bookedTime": bookedTime,
        "expectedTime":expectedTime,
        "actualTime": actualTime,
        "totalHoursBooked" : sum(bookedTime.values()),
        "totalHoursActual":sum(actualTime.values()),
        "totalHoursExpected":sum(expectedTime.values()),
        "name": name,
        "currentTime" : datetime.now(),
        "earliestDates":earliestDates,
        "latestDates": latestDates,
        })


@login_required
def report3(request, machine=None, fromDate=None, toDate=None):

    
    
    # Get the machine data if it wasn't parsed in the url 
    if machine is None:
        machine = int(request.POST.get("machine"))

    #Get the date range if it wasn't parsed in the url 
    if fromDate is None:
        dateSelection = request.POST.get("date")
        fromDate = getDateRange(dateSelection).date().strftime("%Y-%m-%d")
    if toDate is None:
        toDate = str(datetime.now().date().strftime("%Y-%m-%d"))
    fromDate = fromDate + " 00:00:00"
    toDate = toDate  + " 23:59:59"

    #Get list of tasks that someone used this machine for
    Tasks = Task.objects.filter(machine_id = machine).filter(Q(datetime__gte=fromDate) & Q(datetime__lte=toDate))
    
    #Find Employees that used this machine
    users = {}
    for i in Tasks:
        if i.uid not in users:
            userObject = User_List.objects.filter(payroll_id = i.uid).first()
            firstname = userObject.first_name
            lastname = userObject.last_name
            name = firstname + " " + lastname
            users[i.uid] = name
    #Get amount of hours each employee has worked on this machine within the timeframe
    userTime  = {}
    for uid,name in users.items():        
        userTime[uid] = getActualHoursByMachine(uid, 0, machine, fromDate, toDate)
        
    #Find jobs that used this machine
    jobs = []
    for i in Tasks:
        if i.job_id not in jobs:
            jobs.append(Job.objects.filter(job_id = i.job_id).first().job_id)
    #Get amount of time each job was worked on
    jobTime = {}
    category = {}
    productivity = {}
    
   
    #test = getProductivity2(0, 11, 8341, datetime(2021, 6, 1), datetime(2021, 12, 16), 1, -1, -1)
    #print(test)


    for i in jobs:
        jobTime[i] = getActualHoursByMachine(0, i, machine, fromDate, toDate)
        category[i] = Job.objects.filter(job_id = i).first().category
        productivity[i] = getProductivity2(0, machine, i, fromDate, toDate)
    


    return render(request, "report-3.html", {
        "users":users,
        "userTime": userTime,
        "jobTime":jobTime,
        "machine": machine,
        "category":category,
        "productivity":productivity,
        "fromDate":fromDate[:10],
        "toDate":toDate[:10],
        "currentTime" : datetime.now(),
    })



def getDateRange(dateRange):
    dateFrom = ""
    todaysDate = datetime.now()
    if dateRange == "day":
            dateFrom = todaysDate - timedelta(1)
    elif dateRange == "week":
            dateFrom = todaysDate - timedelta(7)
    elif dateRange == "fortnight":
            dateFrom = todaysDate - timedelta(14)
    elif dateRange == "month":
            dateFrom = todaysDate + relativedelta(months=-1)
    elif dateRange == "3month":
            dateFrom = todaysDate + relativedelta(months=-3)
    elif dateRange == "6month":
            dateFrom = todaysDate + relativedelta(months=-6)
    elif dateRange == "year":
            dateFrom = todaysDate + relativedelta(years=-1)
    else: 
            dateFrom = Task.objects.earliest('datetime').datetime

    dateFrom = dateFrom.replace(hour=00, minute=00, second=00)
    return dateFrom

def getProductivity(uid, mid, jid, from_date, to_date):

    productivity_list = []

    if (from_date == 0 or from_date == "0"):
        from_date = Timesheet_Entry.objects.earliest('date').date

    if (to_date == 0 or to_date == "0"):
        to_date = Timesheet_Entry.objects.latest('date').date

    task_db = []

    results = Timesheet_Entry.objects.filter(
        Q(date__gte=from_date) & Q(date__lte=to_date)
    )

    if uid != 0:
        results = results.filter(
            Q(payroll_id=uid)
        )

    for shift in results:

        shift_date = str(shift.date)[:10]
        shift_hours = shift.shift_length

        tasks = Task.objects.filter(
            Q(uid=uid) & Q(datetime__contains=shift_date)
        )

        if mid != 0:
            tasks = tasks.filter(
                Q(machine_id=mid)
            )

        if jid != 0:
            tasks = tasks.filter(
                Q(job_id=jid)
            )

        for t in tasks:
            if (t.type == 100):
                task_db.append(tuple([
                    t.uid,
                    t.datetime
                ]))

            if (t.type == 101):

                for i in task_db:

                    if (i[0] == t.uid):
                        weldtime = t.datetime - i[1]

                        (h, m, s) = str(weldtime).split(':')

                        actual_hours = int(h) + int(m)/60 + int(s)/3600

                        cid = Job.objects.get(
                            Q(job_id=t.job_id)
                        ).category

                        arctime = Category.objects.get(
                            Q(category_id=cid)
                        ).arctime

                        expected_productivity = (shift_hours*arctime/60)

                        productivity = actual_hours/expected_productivity

                        productivity_list.append(productivity)

                        task_db.remove(tuple([i[0], i[1]]))

                        continue

    if (productivity_list):
        return (sum(productivity_list) / len(productivity_list))
    else:
        return None



#Finds the productivity. If return Uid/Mid/Jid are all -1, it'll return the average productivy
#If ONE of the 3 are set to 1, it'll set the key to either uid/mid/jid, and the productivity as
#the value, then aggregate the keys
def getProductivity2(uid, mid, jid, from_date, to_date, returnUid=-1, returnMid=-1, returnJid=-1):
    tasks = Task.objects.all()
    timesheets = Timesheet_Entry.objects.all()
    

    if from_date != 0:
        if type(from_date) == datetime:
            from_date = from_date.replace(hour=00, minute=00, second=00)
        elif type(from_date) == str:
            from_date = from_date[:10] + " 00:00:00"
        tasks = tasks.filter(datetime__gte = from_date)
        timesheets = timesheets.filter(date__gte = from_date)

    if to_date != 0:
        if type(to_date) == datetime:
            to_date = to_date.replace(hour=23, minute=59, second=59)
        elif type(from_date) == str:
            to_date = to_date[:10] + " 23:59:59"
        tasks = tasks.filter(datetime__lte = to_date)
        timesheets = timesheets.filter(date__gte = from_date)


    if uid != 0:
        tasks = tasks.filter(uid = uid)
        timesheets = timesheets.filter(payroll_id = uid)

    
    if jid != 0:
        tasks = tasks.filter(job_id = jid)
    if mid != 0:
        tasks = tasks.filter(machine_id = mid)

    

    data = []
    for i in tasks:
        if i.type == 100:
            startOfDay = i.datetime.replace(hour=00, minute=00, second=00)
            endOfDay = i.datetime.replace(hour=23, minute=59, second=59)
            logout = tasks.filter(type = 101, datetime__gte = startOfDay, datetime__lte = endOfDay, uid = i.uid)
            if len(logout) == 1:
                logout = logout.first()
                actualTime = (logout.datetime - i.datetime).seconds / 3600
                machine = i.machine_id
                job = i.job_id
                user = i.uid
                timesheet = timesheets.filter(date = startOfDay, payroll_id = i.uid).first()
                category = Job.objects.filter(job_id = job).first().category
                bookedTime = timesheet.shift_length
                arctime = Category.objects.filter(category_id = category).first().arctime
                expectedTime = bookedTime*arctime/60
                productivity = actualTime / expectedTime

                
                data.append({
                    "uid": user, 
                    "mid":machine, 
                    "jid":job, 
                    "category":category,
                    "bookedTime":bookedTime,
                    "expectedTime":expectedTime,
                    "actualTime":actualTime,
                    "productivity":productivity

                    })

    count = 0
    productivitySum = []

    # for i in data:
    #     print(i["jid"], i["productivity"])



    if len(data) == 0:
        return None
    
    
    #if all 3 returns are set to -1, return the average
    if returnUid == -1 and returnMid == -1 and returnJid ==-1:
        for i in data:
            productivitySum.append(i["productivity"])
            count=count+1
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
    


    for k,v in dataReturn.items():
        dataReturn[k] = sum(dataReturn[k])/len(dataReturn[k])

    return dataReturn


def getAllProductivity(from_date, to_date):

    total_productivity = []
    welders = User_List.objects.values_list('payroll_id', flat=True)

    for w in welders:
        a = getProductivity(w, 0, 0, from_date, to_date)
        if a is not None:
            total_productivity.append(a)
    if (None in total_productivity):
        return None


    if len(total_productivity) != 0:
        return (sum(total_productivity) / len(total_productivity))
    else:
        return None

#Finds the amount of time a person should have worked on a particular job (if 100% productive)
def getBookedTimePerJob(employee, job, from_date=0, to_date=0):


    timesheetEntries = Timesheet_Entry.objects.filter(payroll_id = employee)
    taskEntries = Task.objects.filter(uid = employee)
    hoursDict = {}
    hoursTemp=[]



    #filter dates
    if from_date != 0:
        timesheetEntries = timesheetEntries.filter(date__gte = from_date)
        taskEntries = taskEntries.filter(datetime__gte = from_date)
    if to_date != 0:
        timesheetEntries = timesheetEntries.filter(date__lte = to_date)
        taskEntries = taskEntries.filter(datetime__lte = to_date)

    if job != 0:
        taskEntries = taskEntries.filter(job_id = job)

    #find any timesheet entries dates that match the users task dates, and aggregate them into a dctionary wherer the job is the key and the total timesheet hours is the value
    for i in taskEntries:
        if i.type == 100:
            hoursTemp = timesheetEntries.filter(date = i.datetime.replace(hour=0, minute=0, second=0))[0].shift_length
            if i.job_id in hoursDict:
                hoursDict[i.job_id] += hoursTemp
            else:
                hoursDict[i.job_id] = hoursTemp

    return hoursDict

#Finds the amount of time an employee has worked on a job
def getActualTimePerJob(employee, job, from_date=0, to_date=0):
        login = {}
        logout = {}
        timeDifference = {}
        jobOnDate = {}
        hoursPerJob={}
        


        
        taskEntries = Task.objects.filter(uid = employee)
        if from_date != 0:
            taskEntries = taskEntries.filter(datetime__gte = from_date)
        if to_date != 0:
            taskEntries = taskEntries.filter(datetime__lte = to_date)

        if job != 0:
            taskEntries = taskEntries.filter(job_id = job)

        #seperates the logins and logouts into two seperate dictionarys 
        for i in taskEntries:
            if i.type == 100:
                login[i.datetime.date()] = i.datetime
            else:
                logout[i.datetime.date()] = i.datetime

        #removes any entries that don't exist in the other (e.g. user forgets to login/logout)
        for k,v in login.items():
            if k not in logout:
                login.pop(k, None)
        for k,v in logout.items():
            if k not in login:
                logout.pop(k, None)

        #gets the time that they were logged in per day
        for k,v in login.items():
            timeDifference[k] = logout[k] - login[k]

        #gets the machine the employee worked on that day        
        for i in taskEntries:
            if i.datetime.date() not in jobOnDate:
                jobOnDate[i.datetime.date()] = i.job_id

        #k, k2 = date, v = job number, v2 = time
        for (k,v), (k2,v2) in zip(jobOnDate.items(), timeDifference.items()):
            if v in hoursPerJob:
                hoursPerJob[v] += v2.seconds/3600
            else:
                hoursPerJob[v] = v2.seconds/3600
        
        return(hoursPerJob)
        

#Get the expected time that an employee should have worked on a job, based off of booked time and and category (arctime)
def getExpectedTimePerJob(bookedTime, jobNum=0):
    allJobs = Job.objects.all()
    categories = Category.objects.all()

    expectedTime = {}

    if jobNum != 0:
        job = Job.objects.filter(job_id = jobNum).first()
        category = categories.filter(category_id = job.category)
        arctime = category[0].arctime
        return (bookedTime*arctime)/60
    elif type(bookedTime == dict):
        for k, v in bookedTime.items():
            jobs = allJobs.filter(job_id = k)
            
            if jobs.count() == 1:
                job = jobs[0]
                category = categories.filter(category_id = job.category)
                arctime = category[0].arctime
                expectedTime[k] = (v*arctime)/60
            

    return expectedTime
            
def getEarliestDates(user):
    dates = {}
    if user!=0:
        tasks = Task.objects.filter(uid = user)
    else: 
        tasks = Task.objects.filter.all()

    for i in tasks:
        currJobId = i.job_id
        earlist = tasks.filter(job_id = currJobId).earliest('datetime').datetime.date()
        dates[currJobId] = earlist
    return dates

def getLatestDates(user):
    dates = {}
    if user!=0:
        tasks = Task.objects.filter(uid = user)
    else: 
        tasks = Task.objects.filter.all()
        
    for i in tasks:
        currJobId = i.job_id
        latest = tasks.filter(job_id = currJobId).latest('datetime').datetime.date()
        dates[currJobId] = latest
    return dates

#Get how many hours either a user or job (not both) worked on a particular machine 
def getActualHoursByMachine(user, job, machine, fromDate, toDate):
    login = {}
    logout = {}
    timeDifference = {}
    tasks = Task.objects.filter(machine_id = machine).filter(Q(datetime__gte=fromDate) & Q(datetime__lte=toDate))

    if user == 0:
        tasks = tasks.filter(job_id = job)
    elif job == 0:
        tasks = tasks.filter(uid = user)
    
    #seperates the logins and logouts into two seperate dictionarys 
    for i in tasks:
        if i.type == 100:
            login[i.datetime.date()] = i.datetime
        else:
            logout[i.datetime.date()] = i.datetime

    #removes any entries that don't exist in the other (e.g. user forgets to login/logout)
    for k,v in login.items():
        if k not in logout:
            login.pop(k, None)
    for k,v in logout.items():
        if k not in login:
            logout.pop(k, None)

    #gets the time that they were logged in per day (in minutes)
    for k,v in login.items():
        timeDifference[k] = (logout[k] - login[k]).seconds/3600

    #gets the sum of the time they were logged in
    total = sum(timeDifference.values())
    return(total)

#dict lookup filter for the template
@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)

#filter to convert decimal to percentage 
@register.filter(is_safe=True)
def format_percent(value: float, args: str=""):
    """
    Format a numeric value as percentage
    :param value: the numeric value
    :param args: a CSV string of arguments to the formatting operation
    :return: the formatted value
    """
    # splits the arguments string into a list of arguments
    arg_list = [arg.strip() for arg in args.split(',')] if args else []
    # sets the precision (number of decimal digits)
    precision = int(arg_list[0]) if len(arg_list) > 0 else 0
    # should the "%" symbol be included?
    include_symbol = bool(arg_list[1]) if len(arg_list) > 1 else True
    symbol = "%" if include_symbol else ""
    # builds and returns the formatted value
    return f"{value * 100.0:.{precision}f}{symbol}"



from dashboard.models import *
from django.utils.timezone import make_aware
import csv

#python manage.py runscript ingest

def run():
    
    path = 'dashboard/data/'

    # Clear all objects from old data
    Machine.objects.all().delete()
    Category.objects.all().delete()
    Job.objects.all().delete()
    Location.objects.all().delete()
    Payroll_User.objects.all().delete()
    Task_Type.objects.all().delete()
    Timesheet.objects.all().delete()
    Timesheet_Entry.objects.all().delete()
    User_List.objects.all().delete()
    User.objects.all().delete()
    User_Role.objects.all().delete()
    User_Type.objects.all().delete()
    Task.objects.all().delete()

    count = 0
    ## Ingest from CSV files

    # Payroll_User
    file = 'payroll_users.csv'
    obj = Payroll_User

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            es = True if i['employment_status'] == 1 else False
            m = obj(
                payroll_id=i['payroll_id'],
                first_name=i['first_name'],
                last_name=i['last_name'],
                employment_status=es
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # Timesheet
    file = 'timesheet_data.csv'
    obj = Timesheet

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            m = obj(
                timesheet_id=i['timesheet_id'],
                payroll_id=i['payroll_id'],
                date=i['date'],
                shift_start=i['shift_start'],
                shift_end=i['shift_end']
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # User
    file = 'users.csv'
    obj = User

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            st = True if i['status'] == '1' else False
            ts = True if i['timesheet_status'] == '1' else False
            m = obj(
                uid=i['uid'],
                payroll_id=i['payroll_id'],
                first_name=i['first_name'],
                last_name=i['last_name'],
                status=st,
                timesheet_status=ts
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # User_Type
    file = 'user_types.csv'
    obj = User_Type

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            st = True if i['status'] == '1' else False
            m = obj(
                type_id=i['type_id'],
                desc=i['desc'],
                level=i['level'],
                status=st
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # User_List
    file = 'user_list.csv'
    obj = User_List

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            st = True if i['employment_status'] == '1' else False
            m = obj(
                payroll_id=i['payroll_id'],
                first_name=i['first_name'],
                last_name=i['last_name'],
                employment_status=st
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # User_Role --- ### UNFINISHED ###
    # file = 'user_roles.csv'
    # obj = User_Role

    # with open(path+file, 'r') as f:
    #     r = csv.DictReader(f)
    #     for i in r:
    #         m = obj(
    #             uid=i['uid'],
    #             type_id=i['type_id']
    #         )
    #         m.save()
    #         count += 1

    #     print(f"{count} {obj.__name__} records added.")
    #     count = 0

    # Timesheet_Entry
    file = 'timesheets.csv'
    obj = Timesheet_Entry

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            m = obj(
                tid=i['tid'],
                org_timesheet_id=i['org_timesheet_id'],
                payroll_id=i['payroll_id'],
                date=i['date'],
                shift_start=i['shift_start'],
                shift_end=i['shift_end'],
                shift_length=i['shift_length']
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # Machine
    file = 'machines.csv'
    obj = Machine

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            m = Machine(
                machine_id = i['machine_id'],
                desc = i['desc'],
                location_id = i['location_id']
                )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # Category
    file = 'categories.csv'
    obj = Category

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            m = obj(
                category_id=i['category_id'],
                arctime=i['arctime']
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # Job
    file = 'jobs.csv'
    obj = Job
    
    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            ed = i['end_date'] if i['end_date'] != '0' else None
            m = obj(
                job_id=i['job_id'],
                category=i['category'],
                start_date=i['start_date'],
                end_date=ed,
                accum_hrs=i['accum_hrs'],
                total_hrs=i['total_hrs']
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # Location
    file = 'locations.csv'
    obj = Location

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            m = obj(
                location_id=i['location_id'],
                desc=i['desc']
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # Task_Type
    file = 'task_types.csv'
    obj = Task_Type

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            m = obj(
                task_type_id=i['task_type_id'],
                desc=i['desc']
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    # Task
    file = 'log.csv'
    obj = Task

    with open(path+file, 'r') as f:
        r = csv.DictReader(f)
        for i in r:
            m = obj(
                task_id=i['task_id'],
                uid=i['user'],
                type=i['type'],
                job_id=i['job'],
                machine_id=i['machine'],
                datetime=i['datetime']
            )
            m.save()
            count += 1

        print(f"{count} {obj.__name__} records added.")
        count = 0

    obj = DB_Settings

    m = obj(
        setting_id = 1,
        name = "cat1_productivity_target",
        desc = "Category 1 Productivity Target",
        value = "95.00"
    )
    m.save()

    m = obj(
        setting_id=2,
        name="cat2_productivity_target",
        desc="Category 2 Productivity Target",
        value="95.00"
    )
    m.save()

    m = obj(
        setting_id=3,
        name="cat3_productivity_target",
        desc="Category 3 Productivity Target",
        value="95.00"
    )
    m.save()

    m = obj(
        setting_id=4,
        name="cat4_productivity_target",
        desc="Category 4 Productivity Target",
        value="95.00"
    )
    m.save()
    
    m = obj(
        setting_id=5,
        name="cat5_productivity_target",
        desc="Category 5 Productivity Target",
        value="95.00"
    )
    m.save()



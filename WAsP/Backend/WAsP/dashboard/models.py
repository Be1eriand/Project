from django.db import models
from django.core.validators import MinLengthValidator, MaxValueValidator, MinValueValidator

# Create your models here.

# static values to make dev easier
class static:
    NAME_LENGTH = 25 #max length of a first and surname in database
    DESC_LENGTH = 25 #max length of a description field

class ingest:
    def generate_bulk(file):
        output = []
        with open(file, 'r') as f:
            r = csv.DictReader(f)
            for i in r:
                output.append(i)
            #headers = r.fieldnames

        return output



## SmartFab HR RDBMS

class Payroll_User(models.Model):
    payroll_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=static.NAME_LENGTH)
    last_name = models.CharField(max_length=static.NAME_LENGTH)
    employment_status = models.BooleanField()

class Timesheet(models.Model):
    timesheet_id = models.CharField(max_length=128, primary_key=True)
    payroll_id = models.IntegerField()
    date = models.DateField()
    shift_start = models.TimeField()
    shift_end = models.TimeField()

## Dashboard RDBMS

class User(models.Model):
    uid = models.IntegerField(primary_key=True)
    payroll_id = models.IntegerField()
    first_name = models.CharField(max_length=static.NAME_LENGTH)
    last_name = models.CharField(max_length=static.NAME_LENGTH)
    status = models.BooleanField()
    timesheet_status = models.BooleanField()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    def user(id):
        try:
            u = User.objects.get(uid=id)
            return str(u)
        except:
            return "User not found."
        
class User_Type(models.Model):
    type_id = models.IntegerField(primary_key=True)
    desc = models.CharField(max_length=static.DESC_LENGTH)
    level = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)])
    status = models.BooleanField()

class User_List(models.Model):
    payroll_id = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=static.NAME_LENGTH)
    last_name = models.CharField(max_length=static.NAME_LENGTH)
    employment_status = models.BooleanField()

class User_Role(models.Model):
    uid = models.IntegerField()
    type_id = models.IntegerField()

class Timesheet_Entry(models.Model):
    tid = models.IntegerField(primary_key=True)
    org_timesheet_id = models.CharField(max_length=128)
    payroll_id = models.IntegerField()
    date = models.DateTimeField()
    shift_start = models.TimeField()
    shift_end = models.TimeField()
    shift_length = models.FloatField()

class Machine(models.Model):
    machine_id = models.IntegerField(primary_key=True)
    desc = models.CharField(max_length=static.DESC_LENGTH)
    location_id = models.IntegerField(null=True)

class Location(models.Model):
    location_id = models.IntegerField(primary_key=True)
    desc = models.CharField(max_length=static.DESC_LENGTH)

class Category(models.Model):
    category_id = models.IntegerField(primary_key=True)
    arctime = models.IntegerField()

class Job(models.Model):
    job_id = models.IntegerField(primary_key=True)
    category = models.IntegerField()
    start_date = models.DateField()
    end_date = models.DateField(null=True)
    accum_hrs = models.FloatField()
    total_hrs = models.FloatField()

class Task_Type(models.Model):
    task_type_id = models.IntegerField(primary_key=True)
    desc = models.CharField(max_length=static.DESC_LENGTH)


## IoT emulated into RDBMS for dev purposes
class Task(models.Model):
    task_id = models.CharField(max_length=128, primary_key=True)
    uid = models.IntegerField()
    type = models.IntegerField()
    job_id = models.IntegerField()
    machine_id = models.IntegerField()
    datetime = models.DateTimeField()

class DB_Settings(models.Model):
    setting_id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=128)
    desc = models.CharField(max_length=128)
    value = models.CharField(max_length=128)

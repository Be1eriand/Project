meta:
  id: sensor_data
  file-extension: sensor_data
  endian: le
  
seq:
  - id: machineid
    type: u2
  
  - id: welderid
    type: u4
    
  - id: jobid
    type: u4
    
  - id: time
    type: time
  
  - id: date
    type: date
  
  - id: rtdata #real time data
    type: data

types:
  time:
    -webide-representation: "{padded_hour}:{padded_minute}:{padded_second}"
    seq:
      - id: second
        type: u4
        valid:
          max: 59999 #(seconds + millisecond) * 1000
      - id: minute
        type: u1
        valid:
          max: 59
      - id: hour
        type: u1
        valid:
          max: 23
          
    instances:
      padded_second:
        value: '((second/1000) <= 9.999 ? "0" : "") + (second/1000).to_s'
      padded_minute:
        value: '(minute <= 9 ? "0" : "") + minute.to_s'
      padded_hour:
        value: '(hour <= 9 ? "0" : "") + hour.to_s'
        
  date:
    -webide-representation: "{padded_year}-{padded_month}-{padded_day}"
    seq:
      - id: day
        type: u1
        valid:
          min: 1
          max: 31
      - id: month
        type: u1
        valid:
          min: 0
          max: 12
      - id: year
        type: u4
        
    instances:
      padded_day:
        value: '(day <= 9 ? "0" : "") + day.to_s'
      padded_month:
        value: '(month <= 9 ? "0" : "") + month.to_s'
      padded_year:
        value: |
          (year <= 999 ? "0" +
            (year <= 99 ? "0" +
              (year <= 9 ? "0" : "")
            : "")
          : "") + year.to_s
    
  data:
    seq:
      - id: current
        type: u4 #32-bit integer xxxx.yyy *1000 = xxxxyyy
      - id: voltage
        type: u4
      - id: temperature
        type: u4
      - id: length
        type: u4
      - id: wirefeedrate
        type: u4
      - id: gasused
        type: u4
        
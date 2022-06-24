meta:
  id: sensor_data
  endian: le
  
seq:
  - id: machineid
    type: u2
  
  - id: welderid
    type: u4
    
  - id: taskid
    type: u4
    
  - id: runid
    type: u1
    
  - id: time
    type: time
  
  - id: date
    type: date
  
  - id: rtdata #real time data
    type: data

types:
  time:
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
        
  date:
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
    
  data:
    seq:
      - id: current
        type: u4 #32-bit integer xxxx.yyy * 1000 = xxxxyyy
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
        
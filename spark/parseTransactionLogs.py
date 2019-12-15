from pyspark import SparkContext, SparkConf
from datetime import datetime

conf = SparkConf().setAppName('CitiBoardLogger').setMaster("local")
sc = SparkContext(conf=conf)

logFile = sc.textFile("./data/transactionalLogs.csv")

lineAsArr = logFile.map(lambda s: s.split(","))
brd_grps = lineAsArr.map(lambda array: (array[0], [array[1], array[2], array[3], array[4], array[5]])) \
                    .groupByKey() \
                    .mapValues(list)

def groupUsers(allTrans):

    park_usr = None
    dt_end   = None
    time_end = None
    st_park  = None

    ride_usr = None
    grpd_trans = {}

    for trans in allTrans:

        action = trans[2]

        if action == "parked":
            park_usr = trans[1]
            dt_end   = trans[3]
            time_end = trans[4]
            st_park  = trans[0]

            if park_usr == ride_usr:

                endDateTime = dt_end   + ' ' + time_end
                stDateTime  = dt_start + ' ' + time_start

                endDateTimeObj = datetime.strptime(endDateTime, '%Y-%m-%d %H:%M:%S')
                stDateTimeObj  = datetime.strptime(stDateTime,  '%Y-%m-%d %H:%M:%S')

                durationMins = ((endDateTimeObj - stDateTimeObj).total_seconds()) / 60

                grpd_trans[park_usr] = [dt_end, time_end, st_chkout, st_park, durationMins]
        else:
            ride_usr   = trans[1]
            dt_start   = trans[3]
            time_start = trans[4]
            st_chkout  = trans[0]

    if(ride_usr == None):
        grpd_trans[park_usr] = [dt_end, time_end, st_park, st_park, 0]

    return grpd_trans


def printData(brd_usr_grp):
    board_id = brd_usr_grp[0]
    last_entry = None
    with open(f'./historical_reports/board_{board_id}.csv', 'w+') as f:
        for key, value in brd_usr_grp[1].items():
            row = f'{value[0]}, {value[1]}, {value[2]}, {value[3]}, {value[4]}\n'
            f.write(row)


brd_usr_grps = brd_grps.mapValues(groupUsers)
brd_usr_grps.foreach(printData)

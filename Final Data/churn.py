import csv
f = open('data.csv', 'w')
counter = 0
with open('final_output.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
            f.write(str(counter) + ', ' + row[2] + ', ' + row[3] + ', ' + row[4] + ', ' + row[5] + ', ' + row[6] + ', ' + row[7] + ', ' + row[8] + ', ' + row[9] + ', ' + row[10] + ', '+ row[11] + ', ' + row[12] + ', ' + row[13] + ', ' + row[14] + ', ' + row[15] + '\n')
            counter = counter + 1

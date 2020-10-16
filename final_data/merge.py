import csv
f = open('output_states.csv', "w")
counter = 0
with open('states.csv') as csvfile:
    readCSV = csv.reader(csvfile, delimiter=',')
    for row in readCSV:
        district = ''
        state = str(row[1])
        #print state
        if ((state[1] + state[2]) in ['CT','ME','MA','NH','RI','VT','NJ','NY','IL','CO','MN','NV','NM','MD','DE','CA','VA','HI','OR','WA']):
            district = 'BLUE'
        if ((state[1] + state[2]) in ['AZ','IN','MI','OH','WI','IA','KS','ID','MO','NE','ND','SD','WY','FL','GA','UT','NC','SC','AK','WV','AL','KY','MS','TN','AR','LA','OK','TX','PA','MT']):
            district = 'RED'
        f.write(str(counter) + ', ' + row[0] + ',' + row[1] + ', ' + row[2] + ', ' + str(district) + '\n')
        counter = counter + 1

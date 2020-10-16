f = open('states_final.csv')
lines=f.readlines()
for line in lines:
            print (line[0:2] +  line[13:],end='')

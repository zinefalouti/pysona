#Auto-Scoring for Persona Assignment to Project in Creation
def main():
    pscores = [5,7,10,6,5]
    assignscore = assembly(2,pscores,"Technical")
    print(f"The Persona Score for this Project is: {assignscore}")

#Facing each Persona Paremeter against Project Complexity to deduce a fragment of the Assign Score
def fragment(complexity,pscore,weight):
    score = max(0,(10-(max(0,complexity-pscore)+weight)))
    return score

#Assembly and grading the Assign Score from the Persona 5 Parameters
def assembly(complexity,pscores,type):
    
    techsav = fragment(complexity,pscores[0],weightmeasure(type)[0])
    effic = fragment(complexity,pscores[1],weightmeasure(type)[1])
    curio = fragment(complexity,pscores[2],weightmeasure(type)[2])
    intuit = fragment(complexity,pscores[3],weightmeasure(type)[3])
    expert = fragment(complexity,pscores[4],weightmeasure(type)[4])

    assignscore = (techsav+effic+curio+intuit+expert)/5

    return int(assignscore)

#Using Project Type to define weights
def weightmeasure(type):

    weightref = {
        'Creative':[1,3,0,1,1],
        'Technical':[1,1,3,1,0],
        'Business':[2,0,2,0,1],
        'Marketing':[1,1,0,2,1],
        'Management':[1,0,2,1,0]
        }
    
    return weightref[type]


if __name__ == '__main__':
    main()
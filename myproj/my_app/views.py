from django.shortcuts import render
import json
from django.http import HttpResponse
import sqlite3
import pdb
import datetime
import random

# Create your views here.

def initiateDb():
    connexion = sqlite3.connect('to_do_list.db')
    cur = connexion.cursor()
    return cur,connexion


def filtering(req):

    task = req.GET.get('task')
    prio = req.GET.get('prio')
    page = int(req.GET.get('page'))
    assigned = req.GET.get('assigned')

    cur, connexion = initiateDb()

    lowLimit = 0 if page==1 else (page*10) - 10

    query = ""

    columns = {'task':task,'priority':prio,'assigned':assigned}

    query = "SELECT * FROM mytodos WHERE "

    emptyColsLen = len([val for val in columns.values() if val == " "])
    fullCols = 0

    for column,val in columns.items():
        if val == " ":
            continue
        else:
            if column=='task':
                query += f"task LIKE '%{val}%'"
            else:
                query += f"{column}={int(val)}"
            fullCols +=1
            
            if fullCols + emptyColsLen == 3:
                break
            else:
                query += " AND "
   
    try:
        res = cur.execute(query)
        res = res.fetchall()
        filteredTodos = res[lowLimit:10*page]
        connexion.close()
        return HttpResponse(json.dumps({'todos':filteredTodos}))

    except:
        return HttpResponse(json.dumps({'error':'Something is wrong'}))

    # try:
    #     res = cur.execute(f'SELECT * FROM boozt3 WHERE {category}="{val}" LIMIT 100')
    #     res = res.fetchall()
    #     connexion.close()
    #     return HttpResponse(json.dumps({'todos':res}))
    
    # except:
    #     return HttpResponse(json.dumps({'error':'Something is wrong'}))

    

def getTodos(req):

    page = int(req.GET.get('page'))

    lowLimit = 0 if page==1 else (page*10) - 10

    cur, connexion = initiateDb()
    res = cur.execute('SELECT * FROM mytodos')
    res = cur.fetchall()
    
    res = res[lowLimit:10*page]
    connexion.close()

    return HttpResponse(json.dumps({'todos':res}))

#from io import StringIO
import re
import socket, requests
import numpy as np
import urllib.request
import datetime as dt
from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
import os
import sys, getopt
import io

prov=['Arg','Buenos Aires','Ciudad de Buenos Aires','Catamarca','Chaco','Chubut','rdoba','Corrientes','Entre R','Formosa','Jujuy','La Pampa','La Rioja','Mendoza','Misiones ','Neuqu','o Negro','Salta','San Juan','San Luis','Santa Cruz','Santa Fe','Santiago del Estero','Tierra del Fuego','Tucum']

directorio=['arg','buenosaires','caba','catamarca','chaco','chubut','cordoba','corrientes','entrerios','formosa','jujuy','lapampa','larioja','mendoza','misiones','neuquen','rionegro','salta','sanjuan','sanluis','santafe','santiago','santacruz','tfuego','tucuman']

#converts pdf, returns its text content as a string
def pdf2txt(fname, pages=None):
    if not pages:
        pagenums = set()
    else:
        pagenums = set(pages)

    output = io.StringIO()
    manager = PDFResourceManager()
    converter = TextConverter(manager, output, laparams=LAParams())
    interpreter = PDFPageInterpreter(manager, converter)

    infile = open(fname, 'rb')
    for page in PDFPage.get_pages(infile, pagenums):
        interpreter.process_page(page)
    infile.close()
    converter.close()
    text = output.getvalue()
    output.close
    return text 
#---------------------------------------------------------------------------------------
def check_availability():
    ' Check if the report has been uploaded '
    lastday=dt.datetime.today()
    lastday=lastday.strftime('%d-%m-%y')
    # if was already download is because we already performed the assimilation
    filenm0=lastday+'-reporte-vespertino-covid-19.pdf'
    if (os.path.exists('../dat/'+filenm0)):
        raise SystemExit(0) # already performed
    try:
        print('cheque si se puede bajar')
        pdf_carga(lastday) # continue
    except ValueError:
        print ('no lo encuentra')
        raise SystemExit(0) # not available (stop execution)
    return
#---------------------------------------------------------------------------------------
def descarga_pdf(dia):
    if socket.gethostname()=='sun': # UNNE web server
        http_proxy  = "http://10.40.1.254:3128"
        https_proxy = http_proxy

        proxyDict = {
            "http"  : http_proxy,
            "https" : https_proxy}
        os.environ["http_proxy"] = http_proxy
        os.environ["https_proxy"] = http_proxy
        os.environ["HTTP_PROXY"] = http_proxy
        os.environ["HTTPS_PROXY"] = http_proxy
        
    else:
        proxyDict ={}
    
    endfl1=['-reporte-vespertino-covid-19.pdf','_reporte_vespertino_covid_19.pdf']
    url = 'https://www.argentina.gob.ar/sites/default/files/'
    ddia=[dia,dia[1:]] # a veces lo ponen con un solo digito
    
    filenm0=dia+endfl1[0]
    if dia[0]=='0':
        ndiar=2
    else:
        ndiar=1
    if (os.path.exists('../dat/'+filenm0)):
        filename='../dat/'+filenm0
    else:
        opener = urllib.request.URLopener()
        opener.addheader('User-Agent', 'whatever')
        
        for idia in range(ndiar):
            for iend in range(2):

                try:
                    filenm1=ddia[idia]+endfl1[iend]
                    print ('url:',url+filenm1)
                    filename, headers = opener.retrieve(url+filenm1, '../dat/'+filenm0)
                    break
                except urllib.error.HTTPError:
                    if iend==1 and idia==ndiar-1:
                        #urllib.error('HTTPError')
                        raise ValueError('HTTPError')
                    else:
                            continue
                
    return filename




#---------------------------------------------------------------------------------------
def cleanro(string):
    
    string=string.replace('.', '')
    return int(re.sub("[^0-9]", "", string))


#---------------------------------------------------------------------------------------
def pdf_cases(fname):
    lpaso=False
    texto=pdf2txt(fname, pages=[0])
    
    cases=np.zeros(len(prov))
    for line in texto.split("\n"):
        if 'confirmados' in line:
            words=line.split()
            iw=words.index('confirmados')
            cases[0]=cleanro(words[iw+1])
            break
    for ipage in range(1,3):
        #txtpage = pdf_document.getPage(ipage)
        #texto=txtpage.extractText()
        texto=pdf2txt(fname, pages=[ipage])
        for line in texto.split("\n"):
 #           print ('Linea: ',line)
            if 'Detalle por provincia' in line:
                lpaso=True
            if lpaso:
                for j in range(len(prov)):
                    if prov[j] in line:
#                        print (line)
#                        print (prov[j])
                        words=line.split()
#                        if prov[j]=='Buenos Aires':
#                            print (words)
#                            print ('1:',words[1])
                        if not (prov[j]=='Buenos Aires' and words[1] == 'Ciudad'):
                            jn=-3
                            if len(words)==3: jn=-2
                            if len(words)==1: words=['0','0','0'] # problems with negative values?
                            if len(words)==2: jn=-1
                            if words[-2] is not '|':
                                words[-2]=words[-2].replace('|','')
                                jn=-2
#                            print ('palabras leepdf:',words)
                            cases[j]=cleanro(words[jn])
    return cases

#---------------------------------------------------------------------------------------
def pdf_muertes(fname):
    lpaso=False
    muertes=np.zeros(len(prov))
    lmujeres=False
    for ipage in range(0,2):
        texto=pdf2txt(fname, pages=[ipage])
        for line in texto.split("\n"):
            if 'notificaron' and 'nuevas muertes' in line:
                words=line.split()
                iw=words.index('notificaron')
                muertes[0]=cleanro(words[iw+1])
                break
        lmirarsiguientelinea=False
        for line in texto.split("\n"):
            words=line.split()
            if len(words)>1:
                if words[0].isnumeric() and 'hombres' in line:
                    lpaso=True
                    muerteshombres=cleanro(words[0])
    #                print ('muertes hombres:',muerteshombres)
            if lpaso:
                if len(words)>=1:                    
                    lmuerteasgn=False
#                    if words[0].isnumeric() and 'res'  in line:\
                    if words[0].isnumeric():
                        for j in range(1,len(prov)):
                            if  prov[j] in line and not (j==1 and 'Ciudad' in line):
                                muertes[j]+= cleanro(words[0])
                                lmuerteasgn=True
                        if lmuerteasgn == False:
                            lmirarsiguientelinea=True
                            muertenoasgn=cleanro(words[0])
                    elif lmirarsiguientelinea:
                         for j in range(len(prov)):
                             if  prov[j] in line:
                                muertes[j]+= muertenoasgn
                                lmirarsiguientelinea=False
                    if words[0].isnumeric() and 'mujeres' in line:
                        lmujeres=True
                        break
        if lmujeres:
            break
    # compruebo
    if muerteshombres != sum(muertes[1:]):
        print('Total de muertes: ',muerteshombres)
        print('Asignadas: ',sum(muertes[1:]))
        print('Hay un problema en muertes hombres no se asigna una provincia')

    # mujeres
    conteommujeres=0
    lpaso=False
    for ipage in range(0,2):
        texto=pdf2txt(fname, pages=[ipage])
        lmirarsiguientelinea=False
        for line in texto.split("\n"):
            if len(line.split()) == 2 and 'mujeres' in line:
                lpaso=True
                muertesmujeres=cleanro(line.split()[0])
    #            print ('muertes mujeres:',muertesmujeres)
            if lpaso:
                words=line.split()
                if len(words)>=1:
                    lmuerteasgn=False
#                    print (words)
#                    if words[0].isnumeric() and 'residente'  in line:
                    if words[0].isnumeric():
#                        print ('Muertes se no se quien:',words[0])
                        for j in range(1,len(prov)):
                            if  prov[j] in line and not (j==1 and 'Ciudad' in line):
                                muertes[j]+= cleanro(words[0])
                                lmuerteasgn=True
                                conteommujeres+=cleanro(words[0])
#                                print('Asigno',prov[j],words[0])
                        if lmuerteasgn == False:
                            lmirarsiguientelinea=True
                            muertenoasgn=cleanro(words[0])
                    elif lmirarsiguientelinea:
#                        print(line)
                        for j in range(len(prov)):
                            if  prov[j] in line:
                                muertes[j]+= muertenoasgn
                                conteommujeres+=muertenoasgn
                                lmirarsiguientelinea=False
#                                print('Asigno dps',prov[j],muertenoasgn)

                    if 'En las' and 'fueron' in line:
                        break
        #                            print('Asigno a: ',prov[j])

    if muertesmujeres is not conteommujeres:
        print('Total de muertes: ',muertesmujeres)
        print('Asignadas: ',conteommujeres)
        print('Hay un problema en muertes mujeres no se asigna una provincia')
        
    return muertes
#---------------------------------------------------------------------------------------
def loaddate_range(lastdaysnvs) : #lastdaysnvs):

    lastday=dt.datetime.today()    
    date_format = "%d-%m-%y"
    
    ndays=(lastday-lastdaysnvs).days + 1 

#    date_list = [lastday - dt.timedelta(days=x) for x in range(jdaycut-1,-1,-1)] # no incluyo el ultimo
    date_list = [lastdaysnvs + dt.timedelta(days=x) for x in range(1,ndays)] # no incluyo el del snvs

    cases_list=[]
    muertes_list=[]
    lprob=False
    for day in date_list:
#        print('Dia',day.strftime('%d-%m-%y'))
        try:
            cases,muertes = pdf_carga(day.strftime('%d-%m-%y'))
            cases_list.append(cases)
            muertes_list.append(muertes)
#        except FileNotFoundError: 
#        except urllib.error.HTTPError:
        except ValueError:
            #cases_list.append('TBA')
            #muertes_list.append('TBA')         
            print('No data')
            # directamente me como un dia pero pongo los datos de los dias siguientes
            # total lo mismo es relevante
            date_list=date_list[:-1]            
    if (cases_list[-1]=='TBA'):# ultimo dia no esta disponible lo saco y listo
        date_list=date_list[:-1]
        cases_list=cases_list[:-1]
        muertes_list=muertes_list[:-1]
    for i in range(len(cases_list)):
        if cases_list[i]=='TBA':
            print ('No tengo un dato disponible')
            lprob=True # le paso para que no trabaje con los datos

    repordict={'cases':cases_list,'muertes':muertes_list,'dates':date_list,
               'directorio':directorio,'lproblem':lprob}

    return repordict

#---------------------------------------------------------------------------------------
def extract_cases(dat,provincia=None,cantidad=None):
    ' Extractor del dictionary '
    
    iprov=directorio.index(provincia)

    dates=[]; cases=[]; muertes=[]
    for iday in range(len(dat['cases'])):
        
        dates.append(dat['dates'][iday].strftime('%d/%m-%Y'))

        if dat['cases'][iday] == 'TBA' :
            #no data
            cases.append(0) 
            muertes.append(0) 
            #cases.append(NaN) ???
        else:
#            print(dat['cases'][iday][iprov])
            cases.append(dat['cases'][iday][iprov])
            muertes.append(dat['muertes'][iday][iprov])

#    print ('leepdf',provincia,dates)

    return cases,muertes,dates

#---------------------------------------------------------------------------------------
def pdf_carga(dia):
    ''' dia=10-11-20 '''

    filename=descarga_pdf(dia) # descarga de la web
    #filename=dia+'-reporte-vespertino-covid-19.pdf' # tomo del directorio
    cases=pdf_cases(filename)
    muertes=pdf_muertes(filename)
    
    return cases,muertes

#---------------------------------------------------------------------------------------
#if __name__ == '__main__':

#    pdf_carga('02-11-20')
#    dat=loaddate_range(4)
#    cases,muertes,dates=extract_cases(dat,provincia='caba')#,cantidad=None)    
#    print('cases:',cases)
#    print('muertes:',muertes)
#    print ('main lee_pdf')

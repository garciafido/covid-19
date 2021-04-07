import json
from bs4 import BeautifulSoup
import browser


URL = 'https://www.argentina.gob.ar/salud/coronavirus-COVID-19/sala-situacion'


def get_tables(url):
    all_tables = {}
    display, driver = browser.get_driver()
    try:
        driver.get(url)
        browser.select_frame_by_text(driver, text='Casos confirmados por provincia')
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        tables = soup.find_all('table')
        for table in tables:
            data = []
            table_body = table.find('tbody')
            rows = table_body.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                cols = [ele.text.strip() for ele in cols]
                data.append([ele for ele in cols if ele])
            if data[0][0] == 'ProvinciaBuenos Aires':
                all_tables['Confirmados'] = {
                    'header': ['Provincia', 'Confirmados del día', 'Totales'],
                    'rows': [
                                data[0][0].replace('Provincia', ''),
                                data[0][1].replace('Confirmados del día', ''),
                                data[0][2].replace('Totales', ''),
                            ] + data[1:]
                }
            elif data[0][0] == 'Confirmados':
                all_tables['Totales'] = {'rows': data}
            elif data[0][0] == 'JurisdicciónBuenos Aires':
                all_tables['PorTexto'] = {
                    'header': ['Jurisdicción', 'FEMENINO', 'MASCULINO', 'SIN DATO'],
                    'rows': [
                                data[0][0].replace('Jurisdicción', ''),
                                data[0][1].replace('FEMENINO', ''),
                                data[0][2].replace('MASCULINO', ''),
                                data[0][3].replace('SIN DATO', ''),
                            ] + data[1:]
                }
    finally:
        browser.close_driver(display, driver)
    return all_tables


if __name__ == '__main__':
    tables = get_tables(URL)
    print(json.dumps(tables, ensure_ascii=False, indent=2).encode('utf8').decode())




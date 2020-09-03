# coding=utf-8
import datetime
import json
import os

FILE_BASE_PATH = '../res/'

forecast_files = [
    ['Argentina', 'arg-for1.csv'],
    ['Buenos Aires', 'baires-for1.csv'],
    ['CABA', 'caba-for1.csv'],
    ['Catamarca', 'catamarca-for1.csv'],
    ['Chaco', 'chaco-for1.csv'],
    ['Chubut', 'chubut-for1.csv'],
    ['GBA', 'conurbano-for1.csv'],
    ['Cordoba', 'cordoba-for1.csv'],
    ['Corrientes', 'corrientes-for1.csv'],
    ['Entre Rios', 'entrerios-for1.csv'],
    ['Formosa', 'formosa-for1.csv'],
    ['Jujuy', 'jujuy-for1.csv'],
    ['La Pampa', 'lapampa-for1.csv'],
    ['La Rioja', 'larioja-for1.csv'],
    ['Mendoza', 'mendoza-for1.csv'],
    ['Misiones', 'misiones-for1.csv'],
    ['Neuquen', 'neuquen-for1.csv'],
    ['Rio Negro', 'rionegro-for1.csv'],
    ['Salta', 'salta-for1.csv'],
    ['San Juan', 'sanjuan-for1.csv'],
    ['San Luis', 'sanluis-for1.csv'],
    ['Santa Cruz', 'santacruz-for1.csv'],
    ['Santa Fe', 'santafe-for1.csv'],
    ['Santiago del Estero', 'santiago-for1.csv'],
    ['Tierra del Fuego', 'tfuego-for1.csv'],
    ['Tucuman', 'tucuman-for1.csv']
]

forecast_files_2 = [
    ['Argentina', 'arg-for2.csv'],
    ['Buenos Aires', 'baires-for2.csv'],
    ['CABA', 'caba-for2.csv'],
    ['Catamarca', 'catamarca-for2.csv'],
    ['Chaco', 'chaco-for2.csv'],
    ['Chubut', 'chubut-for2.csv'],
    ['GBA', 'conurbano-for2.csv'],
    ['Cordoba', 'cordoba-for2.csv'],
    ['Corrientes', 'corrientes-for2.csv'],
    ['Entre Rios', 'entrerios-for2.csv'],
    ['Formosa', 'formosa-for2.csv'],
    ['Jujuy', 'jujuy-for2.csv'],
    ['La Pampa', 'lapampa-for2.csv'],
    ['La Rioja', 'larioja-for2.csv'],
    ['Mendoza', 'mendoza-for2.csv'],
    ['Misiones', 'misiones-for2.csv'],
    ['Neuquen', 'neuquen-for2.csv'],
    ['Rio Negro', 'rionegro-for2.csv'],
    ['Salta', 'salta-for2.csv'],
    ['San Juan', 'sanjuan-for2.csv'],
    ['San Luis', 'sanluis-for2.csv'],
    ['Santa Cruz', 'santacruz-for2.csv'],
    ['Santa Fe', 'santafe-for2.csv'],
    ['Santiago del Estero', 'santiago-for2.csv'],
    ['Tierra del Fuego', 'tfuego-for2.csv'],
    ['Tucuman', 'tucuman-for2.csv']
]

forecast_files_3 = [
    ['Argentina', 'arg-for3.csv'],
    ['Buenos Aires', 'baires-for3.csv'],
    ['CABA', 'caba-for3.csv'],
    ['Catamarca', 'catamarca-for3.csv'],
    ['Chaco', 'chaco-for3.csv'],
    ['Chubut', 'chubut-for3.csv'],
    ['GBA', 'conurbano-for3.csv'],
    ['Cordoba', 'cordoba-for3.csv'],
    ['Corrientes', 'corrientes-for3.csv'],
    ['Entre Rios', 'entrerios-for3.csv'],
    ['Formosa', 'formosa-for3.csv'],
    ['Jujuy', 'jujuy-for3.csv'],
    ['La Pampa', 'lapampa-for3.csv'],
    ['La Rioja', 'larioja-for3.csv'],
    ['Mendoza', 'mendoza-for3.csv'],
    ['Misiones', 'misiones-for3.csv'],
    ['Neuquen', 'neuquen-for3.csv'],
    ['Rio Negro', 'rionegro-for3.csv'],
    ['Salta', 'salta-for3.csv'],
    ['San Juan', 'sanjuan-for3.csv'],
    ['San Luis', 'sanluis-for3.csv'],
    ['Santa Cruz', 'santacruz-for3.csv'],
    ['Santa Fe', 'santafe-for3.csv'],
    ['Santiago del Estero', 'santiago-for3.csv'],
    ['Tierra del Fuego', 'tfuego-for3.csv'],
    ['Tucuman', 'tucuman-for3.csv']
]


monitor_files = [
    ['Argentina', 'arg.csv'],
    ['Buenos Aires', 'baires.csv'],
    ['CABA', 'caba.csv'],
    ['Catamarca', 'catamarca.csv'],
    ['Chaco', 'chaco.csv'],
    ['Chubut', 'chubut.csv'],
    ['GBA', 'conurbano.csv'],
    ['Cordoba', 'cordoba.csv'],
    ['Corrientes', 'corrientes.csv'],
    ['Entre Rios', 'entrerios.csv'],
    ['Formosa', 'formosa.csv'],
    ['Jujuy', 'jujuy.csv'],
    ['La Pampa', 'lapampa.csv'],
    ['La Rioja', 'larioja.csv'],
    ['Mendoza', 'mendoza.csv'],
    ['Misiones', 'misiones.csv'],
    ['Neuquen', 'neuquen.csv'],
    ['Rio Negro', 'rionegro.csv'],
    ['Salta', 'salta.csv'],
    ['San Juan', 'sanjuan.csv'],
    ['San Luis', 'sanluis.csv'],
    ['Santa Cruz', 'santacruz.csv'],
    ['Santa Fe', 'santafe.csv'],
    ['Santiago del Estero', 'santiago.csv'],
    ['Tierra del Fuego', 'tfuego.csv'],
    ['Tucuman', 'tucuman.csv']
]


def read_table(csv_file):
    filepath = os.path.join(FILE_BASE_PATH, csv_file)
    with open(filepath, 'r') as f:
        text = f.read()
    return map(lambda x: x.split(','), text.replace('\r', '').split('\n'))


def get_table_values(date, table):
    # filter empty rows
    table_values = map(lambda row: map(float, row), filter(lambda row: len(row) > 1, table))
    # add date column
    return map(lambda (index, row): [(date + datetime.timedelta(days=index)).isoformat()] + row,
                                     enumerate(table_values))


def get_chart_value(iso_date, values):
    observation = None
    if len(values) == 2:
        mean, std_dev = values
    else:
        observation, mean, std_dev = values
    list_date = iso_date.split('-')
    value =  {
        "show_date": '{}/{}'.format(list_date[2], list_date[1]),
        "date": iso_date,
        "ensemble": [
            round(mean-std_dev, 1) if mean-std_dev > 0 else 0,
            round(mean+std_dev, 1) if mean+std_dev > 0 else 0,
        ],
        "mean": round(mean, 1) if mean > 0 else 0
    }
    if observation is not None:
        value['observation'] = round(observation, 0) if observation > 0 else 0
    return value


def data_for_charts(table_values, is_forecast=False):
    def min_max(index):
        values = [row[index] for row in table_values]
        return [min(values), max(values)]

    if is_forecast:
        cases_indexes = (1, 2)
        r_indexes = (3, 4)
        actives_indexes = (5, 6)
        deads_indexes = (7, 8)
    else:
        cases_indexes = (1, 2, 3)
        r_indexes = (4, 5)
        actives_indexes = (6, 7)
        deads_indexes = (8, 9, 10)

    cases = map(lambda row: get_chart_value(row[0], [row[i] for i in cases_indexes]), table_values)
    r = map(lambda row: get_chart_value(row[0], [row[i] for i in r_indexes]), table_values)
    actives = map(lambda row: get_chart_value(row[0], [row[i] for i in actives_indexes]), table_values)
    deads = map(lambda row: get_chart_value(row[0], [row[i] for i in deads_indexes]), table_values)

    return {
        'cases': cases,
        'r': r,
        'actives': actives,
        'deads': deads,
        'minMaxCases': min_max(cases_indexes[0]),
        'minMaxR': min_max(r_indexes[0]),
        'minMaxActives': min_max(actives_indexes[0]),
        'minMaxDeaths': min_max(deads_indexes[0]),
        'lastDate': cases[len(cases)-1]['date'],
        'lastR': r[len(r)-1]['mean']
    }


def add_empty_dates(date, first_table_date, table_values):
    delta = first_table_date - date
    for i in reversed(range(delta.days)):
        day = date + datetime.timedelta(days=i)
        empty_row = [0.0 for x in table_values[0]]
        empty_row[0] = day.isoformat()
        table_values.insert(0, empty_row)


def setNewMinMax(previous, new):
    for field in ['minMaxCases', 'minMaxR', 'minMaxActives', 'minMaxDeaths']:
        previous[field] = [min(previous[field], new[field]), max(previous[field], new[field])]


def add_ensamble_data(previous, row_number, values, ensamble_number):
    for field in ['cases', 'deads', 'actives', 'r']:
        previous_data = previous[field][row_number]
        previous_data['ensemble{}'.format(ensamble_number)] = values[field][row_number]['ensemble']
        previous_data['mean{}'.format(ensamble_number)] = values[field][row_number]['mean']


def write_json():
    data = {'monitoreo': {}, 'prediccion': {}, 'fecha_de_asimilacion': None}
    no_date = True

    def get_values(filepath):
        try:
            table = read_table(filepath)
        except Exception as e:
            if e.strerror != 'No such file or directory':
                return None
            raise e
        parsed_date = map(int, table[0][len(table[0])-1].replace('/', '-').split('-'))
        date = datetime.date(year=parsed_date[2], month=parsed_date[1], day=parsed_date[0])
        return get_table_values(date, table[1:])

    for file in forecast_files:
        table_values = get_values(file[1])
        if table_values is not None:
            data['prediccion'][file[0]] = data_for_charts(table_values, is_forecast=True)

    for file in forecast_files_2:
        table_values = get_values(file[1])
        if table_values is not None:
            values = data_for_charts(table_values, is_forecast=True)
            setNewMinMax(data['prediccion'][file[0]], values)
            for i in range(len(data['prediccion'][file[0]]['cases'])):
                add_ensamble_data(data['prediccion'][file[0]], i, values, 2)

    for file in forecast_files_3:
        table_values = get_values(file[1])
        if table_values is not None:
            values = data_for_charts(table_values, is_forecast=True)
            setNewMinMax(data['prediccion'][file[0]], values)
            for i in range(len(data['prediccion'][file[0]]['cases'])):
                add_ensamble_data(data['prediccion'][file[0]], i, values, 3)

    for file in monitor_files:
        try:
            table = read_table(file[1])
        except Exception as e:
            if e.strerror == 'No such file or directory':
                continue
            raise e
        parsed_dates = table[0][len(table[0]) - 1].replace('/', '-').strip(' ').split(' ')

        if no_date:
            parsed_date = map(int, parsed_dates[1].split('-'))
            ran_date = datetime.date(year=parsed_date[2], month=parsed_date[1], day=parsed_date[0])
            data["fecha_de_asimilacion"] = ran_date.isoformat()
            no_date = False

        parsed_date = map(int, parsed_dates[0].split('-'))
        first_table_date = datetime.date(year=parsed_date[2], month=parsed_date[1], day=parsed_date[0])
        date = datetime.date(year=2020, month=3, day=3)
        table_values = get_table_values(first_table_date, table[1:])
        if first_table_date > date:
            add_empty_dates(date, first_table_date, table_values)
        data['monitoreo'][file[0]] = data_for_charts(table_values)

    with open('sample_data.json', 'w') as f:
        f.write(json.dumps(data, indent=2))


if __name__ == '__main__':
    write_json()
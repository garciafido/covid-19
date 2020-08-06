# coding=utf-8
import datetime
import json


forecast_files = [
    ['Argentina', 'arg-for1.csv']
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
    with open(csv_file, 'r') as f:
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
            mean-std_dev,
            mean+std_dev
        ],
        "mean": mean
    }
    if observation is not None:
        value['observation'] = observation
    return value


def data_for_charts(table_values, is_forecast=False):
    def min_max(*indexes):
        values = [list(row[i] for i in indexes) for row in table_values]
        return [min([min(*v) for v in values]), max([max(*v) for v in values])]

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
        'minMaxCases': min_max(*cases_indexes),
        'minMaxR': min_max(*r_indexes),
        'minMaxActives': min_max(*actives_indexes),
        'minMaxDeaths': min_max(*deads_indexes),
        'lastDate': cases[len(cases)-1]['date'],
        'lastR': r[len(r)-1]['mean']
    }


def write_json():
    data = {'monitoreo': {}, 'prediccion': {}}

    for file in forecast_files:
        table = read_table(file[1])
        parsed_date = map(int, table[0][len(table[0])-1].replace('/', '-').split('-'))
        date = datetime.date(year=parsed_date[2], month=parsed_date[1], day=parsed_date[0])
        table_values = get_table_values(date, table[1:])
        data['prediccion'][file[0]] = data_for_charts(table_values, is_forecast=True)

    for file in monitor_files:
        table = read_table(file[1])
        date = datetime.date(year=2020, month=3, day=3)
        table_values = get_table_values(date, table[1:])
        data['monitoreo'][file[0]] = data_for_charts(table_values)

    with open('sample_data.json', 'w') as f:
        f.write(json.dumps(data, indent=2))


if __name__ == '__main__':
    write_json()
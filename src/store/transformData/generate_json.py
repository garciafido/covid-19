# coding=utf-8
import datetime
import json
import os

FILE_BASE_PATH = '../res/'


def filenames(posfix=''):
    return [
        ['Argentina', 'arg{}.csv'.format(posfix)],
        ['Buenos Aires', 'baires{}.csv'.format(posfix)],
        ['CABA', 'caba{}.csv'.format(posfix)],
        ['Catamarca', 'catamarca{}.csv'.format(posfix)],
        ['Chaco', 'chaco{}.csv'.format(posfix)],
        ['Chubut', 'chubut{}.csv'.format(posfix)],
        ['GBA', 'conurbano{}.csv'.format(posfix)],
        ['Cordoba', 'cordoba{}.csv'.format(posfix)],
        ['Corrientes', 'corrientes{}.csv'.format(posfix)],
        ['Entre Rios', 'entrerios{}.csv'.format(posfix)],
        ['Formosa', 'formosa{}.csv'.format(posfix)],
        ['Jujuy', 'jujuy{}.csv'.format(posfix)],
        ['La Pampa', 'lapampa{}.csv'.format(posfix)],
        ['La Rioja', 'larioja{}.csv'.format(posfix)],
        ['Mendoza', 'mendoza{}.csv'.format(posfix)],
        ['Misiones', 'misiones{}.csv'.format(posfix)],
        ['Neuquen', 'neuquen{}.csv'.format(posfix)],
        ['Rio Negro', 'rionegro{}.csv'.format(posfix)],
        ['Salta', 'salta{}.csv'.format(posfix)],
        ['San Juan', 'sanjuan{}.csv'.format(posfix)],
        ['San Luis', 'sanluis{}.csv'.format(posfix)],
        ['Santa Cruz', 'santacruz{}.csv'.format(posfix)],
        ['Santa Fe', 'santafe{}.csv'.format(posfix)],
        ['Santiago del Estero', 'santiago{}.csv'.format(posfix)],
        ['Tierra del Fuego', 'tfuego{}.csv'.format(posfix)],
        ['Tucuman', 'tucuman{}.csv'.format(posfix)]
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
            mean-std_dev if mean-std_dev > 0 else 0,
            mean+std_dev if mean+std_dev > 0 else 0,
        ],
        "mean": mean if mean > 0 else 0
    }
    if observation is not None:
        value['observation'] = observation if observation > 0 else 0
    return value


def data_for_charts(table_values, is_forecast=False):
    def min_max(index, dev_index):
        values = [(row[index] - row[dev_index], row[index] + row[dev_index]) for row in table_values]
        return [min([v[0] for v in values]), max([v[1] for v in values])]

    if is_forecast:
        cases_indexes = (1, 2)      # mean, dev
        r_indexes = (3, 4)          # mean, dev
        actives_indexes = (5, 6)    # mean, dev
        deads_indexes = (7, 8)      # mean, v
    else:
        cases_indexes = (1, 2, 3)   # obs, mean, dev
        r_indexes = (4, 5)          # mean, dev
        actives_indexes = (6, 7)    # mean, dev
        deads_indexes = (8, 9, 10)  # obs, mean, dev

    cases = map(lambda row: get_chart_value(row[0], [row[i] for i in cases_indexes]), table_values)
    r = map(lambda row: get_chart_value(row[0], [row[i] for i in r_indexes]), table_values)
    actives = map(lambda row: get_chart_value(row[0], [row[i] for i in actives_indexes]), table_values)
    deads = map(lambda row: get_chart_value(row[0], [row[i] for i in deads_indexes]), table_values)

    return {
        'cases': cases,
        'r': r,
        'actives': actives,
        'deads': deads,
        'minMaxCases': min_max(cases_indexes[-2], cases_indexes[-1]),
        'minMaxR': min_max(r_indexes[-2], r_indexes[-1]),
        'minMaxActives': min_max(actives_indexes[0], actives_indexes[-1]),
        'minMaxDeaths': min_max(deads_indexes[0], deads_indexes[-1]),
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
        previous[field] = [min(previous[field][0], new[field][0]), max(previous[field][1], new[field][1])]


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

    for file in filenames(posfix='-for1'):
        table_values = get_values(file[1])
        if table_values is not None:
            data['prediccion'][file[0]] = data_for_charts(table_values, is_forecast=True)

    for file in filenames(posfix='-for2'):
        table_values = get_values(file[1])
        if table_values is not None:
            values = data_for_charts(table_values, is_forecast=True)
            setNewMinMax(data['prediccion'][file[0]], values)
            for i in range(len(data['prediccion'][file[0]]['cases'])):
                add_ensamble_data(data['prediccion'][file[0]], i, values, 2)

    for file in filenames(posfix='-for3'):
        table_values = get_values(file[1])
        if table_values is not None:
            values = data_for_charts(table_values, is_forecast=True)
            setNewMinMax(data['prediccion'][file[0]], values)
            for i in range(len(data['prediccion'][file[0]]['cases'])):
                add_ensamble_data(data['prediccion'][file[0]], i, values, 3)

    for file in filenames():
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
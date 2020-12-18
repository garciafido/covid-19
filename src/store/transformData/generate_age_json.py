# coding=utf-8
import datetime
import json
import os

FILE_BASE_PATH = '../res/'


def filenames(posfix=''):
    return [
        ['Argentina', 'arg{}.csv'.format(posfix)],
        ['Buenos Aires', 'baires{}.csv'.format(posfix)],
        ['AMBA', 'amba{}.csv'.format(posfix)],
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


def data_for_charts(table_values):
    def min_max(index, dev_index):
        values = [(row[index] - row[dev_index], row[index] + row[dev_index]) for row in table_values]
        return [min([v[0] for v in values]), max([v[1] for v in values])]


    # Obs cases ageg 0	
    # Mean cases ageg 0	
    # Std Dev cases ageg 0	
    cases_indexes_0 = (1, 2, 3)   # obs, mean, dev

    # Obs cases ageg 1	
    # Mean cases ageg 1	
    # Std Dev cases ageg 1
    cases_indexes_1 = (4, 5, 6)   # obs, mean, dev

    # Obs cases ageg 2	
    # Mean cases ageg 2	
    # Std Dev cases ageg 2
    cases_indexes_2 = (7, 8, 9)   # obs, mean, dev

    # Mean active ageg 0	
    # Std Dev active ageg 0
    actives_indexes_0 = (10, 11)   # mean, dev

    # Mean active ageg 1	
    # Std Dev active ageg 1
    actives_indexes_1 = (12, 13)   # mean, dev

    # Mean active ageg 2	
    # Std Dev active ageg 2
    actives_indexes_2 = (14, 15)   # mean, dev

    # Obs deaths ageg 0	
    # Mean deaths ageg 0	
    # Std Dev deaths ageg 0
    deads_indexes_0 = (16, 17, 18)   # obs, mean, dev

    # Obs deaths ageg 1	
    # Mean deaths ageg 1	
    # Std Dev deaths ageg 1
    deads_indexes_1 = (19, 20, 21)   # obs, mean, dev

    # Obs deaths ageg 2	
    # Mean deaths ageg 2	
    # Std Dev deaths ageg 2
    deads_indexes_2 = (22, 23, 24)   # obs, mean, dev

    # Obs hosp ageg 0	
    # Mean hosp ageg 0	
    # Std Dev hosp ageg 0
    hosp_indexes_0 = (25, 26, 27)   # obs, mean, dev

    # Obs hosp ageg 1	
    # Mean hosp ageg 1	
    # Std Dev hosp ageg 1
    hosp_indexes_1 = (28, 29, 30)   # obs, mean, dev

    # Obs hosp ageg 2	
    # Mean hosp ageg 2	
    # Std Dev hosp ageg 2
    hosp_indexes_2 = (31, 32, 33)   # obs, mean, dev

    # Obs therapy ageg 0	
    # Mean therapy ageg 0	
    # Std Dev therapy ageg 0
    therapy_indexes_0 = (34, 35, 36)   # obs, mean, dev

    # Obs therapy ageg 1	
    # Mean therapy ageg 1	
    # Std Dev therapy ageg 1
    therapy_indexes_1 = (37, 38, 39)   # obs, mean, dev

    # Obs therapy ageg 2	
    # Mean therapy ageg 2	
    # Std Dev therapy ageg 2
    therapy_indexes_2 = (40, 41, 42)   # obs, mean, dev

    cases_0 = map(lambda row: get_chart_value(row[0], [row[i] for i in cases_indexes_0]), table_values)
    cases_1 = map(lambda row: get_chart_value(row[0], [row[i] for i in cases_indexes_1]), table_values)
    cases_2 = map(lambda row: get_chart_value(row[0], [row[i] for i in cases_indexes_2]), table_values)
    actives_0 = map(lambda row: get_chart_value(row[0], [row[i] for i in actives_indexes_0]), table_values)
    actives_1 = map(lambda row: get_chart_value(row[0], [row[i] for i in actives_indexes_1]), table_values)
    actives_2 = map(lambda row: get_chart_value(row[0], [row[i] for i in actives_indexes_2]), table_values)
    deads_0 = map(lambda row: get_chart_value(row[0], [row[i] for i in deads_indexes_0]), table_values)
    deads_1 = map(lambda row: get_chart_value(row[0], [row[i] for i in deads_indexes_1]), table_values)
    deads_2 = map(lambda row: get_chart_value(row[0], [row[i] for i in deads_indexes_2]), table_values)
    hosp_0 = map(lambda row: get_chart_value(row[0], [row[i] for i in hosp_indexes_0]), table_values)
    hosp_1 = map(lambda row: get_chart_value(row[0], [row[i] for i in hosp_indexes_1]), table_values)
    hosp_2 = map(lambda row: get_chart_value(row[0], [row[i] for i in hosp_indexes_2]), table_values)
    therapy_0 = map(lambda row: get_chart_value(row[0], [row[i] for i in therapy_indexes_0]), table_values)
    therapy_1 = map(lambda row: get_chart_value(row[0], [row[i] for i in therapy_indexes_1]), table_values)
    therapy_2 = map(lambda row: get_chart_value(row[0], [row[i] for i in therapy_indexes_2]), table_values)

    return {
        'cases_0': cases_0,
        'cases_1': cases_1,
        'cases_2': cases_2,
        'minMaxCases_0': min_max(cases_indexes_0[-2], cases_indexes_0[-1]),
        'minMaxCases_1': min_max(cases_indexes_1[-2], cases_indexes_1[-1]),
        'minMaxCases_2': min_max(cases_indexes_2[-2], cases_indexes_2[-1]),
        'actives_0': actives_0,
        'actives_1': actives_1,
        'actives_2': actives_2,
        'minMaxActives_0': min_max(actives_indexes_0[0], actives_indexes_0[-1]),
        'minMaxActives_1': min_max(actives_indexes_1[0], actives_indexes_1[-1]),
        'minMaxActives_2': min_max(actives_indexes_2[0], actives_indexes_2[-1]),
        'deads_0': deads_0,
        'deads_1': deads_1,
        'deads_2': deads_2,
        'minMaxDeaths_0': min_max(deads_indexes_0[0], deads_indexes_0[-1]),
        'minMaxDeaths_1': min_max(deads_indexes_1[0], deads_indexes_1[-1]),
        'minMaxDeaths_2': min_max(deads_indexes_2[0], deads_indexes_2[-1]),
        'hosp_0': hosp_0,
        'hosp_1': hosp_1,
        'hosp_2': hosp_2,
        'minMaxHosp_0': min_max(hosp_indexes_0[0], hosp_indexes_0[-1]),
        'minMaxHosp_1': min_max(hosp_indexes_1[0], hosp_indexes_1[-1]),
        'minMaxHosp_2': min_max(hosp_indexes_2[0], hosp_indexes_2[-1]),
        'therapy_0': therapy_0,
        'therapy_1': therapy_1,
        'therapy_2': therapy_2,
        'minMaxTherapy_0': min_max(therapy_indexes_0[0], therapy_indexes_0[-1]),
        'minMaxTherapy_1': min_max(therapy_indexes_1[0], therapy_indexes_1[-1]),
        'minMaxTherapy_2': min_max(therapy_indexes_2[0], therapy_indexes_2[-1]),
        'lastDate': cases_0[len(cases_0)-1]['date'],
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
    data = {'monitoreo': {}, 'fecha_de_asimilacion': None}
    no_date = True

    def get_no_date():
        return no_date

    def set_no_date(value):
        no_date = value

    def get_values(filepath):
        try:
            table = read_table(filepath)
        except Exception as e:
            if e.strerror != 'No such file or directory':
                return None
            raise e
        parsed_date = map(int, table[0][len(table[0])-1].replace('/', '-').split(" ")[1].split('-'))
        date = datetime.date(year=parsed_date[2], month=parsed_date[1], day=parsed_date[0])
        if get_no_date():
            data["fecha_de_asimilacion"] = date.isoformat()
            set_no_date(False)
        return get_table_values(date, table[1:])

    for file in filenames(posfix='-age'):
        table_values = get_values(file[1])
        if table_values is not None:
            data['monitoreo'][file[0]] = data_for_charts(table_values)

    with open('age_data.json', 'w') as f:
        f.write(json.dumps(data, indent=2))


if __name__ == '__main__':
    write_json()
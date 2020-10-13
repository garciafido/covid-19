import json
import numpy as np
import matplotlib as mpl
import matplotlib.pyplot as plt
from matplotlib.colors import LinearSegmentedColormap


def save_colormap_image(cmap, orange_values, orange_r_values, cmap_name):
    colors = cmap(orange_values)
    gradient = np.vstack((orange_r_values, orange_r_values))
    fig, axe = plt.subplots(nrows=1)
    cm = LinearSegmentedColormap.from_list(cmap_name, colors)
    im = axe.imshow(gradient, aspect='auto', cmap=cm)
    axe.set_axis_off()
    fig.colorbar(im, ax=axe)
    plt.savefig(cmap_name)


def generate_colormaps():
    def get_hex_values(cmap_values):
        return map(lambda rgba: '#{:02x}{:02x}{:02x}'.format(
            *map(lambda v: int(v * 255), rgba)[:-1]), cmap_values)

    oranges = plt.get_cmap('Oranges')
    orange_values = np.arange(0, 0.5, 0.005)
    orange_r_values = np.linspace(0, 1, 100)
    save_colormap_image(oranges, orange_values, orange_r_values, 'Oranges')

    reds = plt.get_cmap('Reds')
    red_values = np.arange(0.5, 1, 0.005)
    red_r_values = np.linspace(1, 10, 100)
    save_colormap_image(reds, red_values, red_r_values, 'Reds')

    return {
        'Oranges': get_hex_values(oranges(orange_values)),
        'Reds': get_hex_values(reds(red_values)),
    }


colormap = [
    "#FFFFFF",
    "#F3E08C",
    "#FAC55F",
    "#FAA930",
    "#FBA953",
    "#F96A00",
    "#F34E00",
    "#E32F00",
    "#D00A00",
]

def sample():
    fig, ax = plt.subplots(figsize=(6, 1))
    fig.subplots_adjust(bottom=0.5)

    cmap = mpl.colors.ListedColormap(colormap)
    #ax.tick_params(size=0)

    cb2 = mpl.colorbar.ColorbarBase(ax, cmap=cmap, orientation='horizontal')
    #cb2.set_ticks([])
    fig.savefig("colormap.svg")

if __name__ == "__main__":
    #print(json.dumps(generate_colormaps(), indent=2))
    sample()

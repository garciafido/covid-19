import fitz

filename = 'sala-situacion-covid-19_15-03-2021.pdf'


def to_png(filename):
    doc = fitz.open(filename)
    for i in range(len(doc)):
        for img in doc.getPageImageList(i):
            xref = img[0]
            pix = fitz.Pixmap(doc, xref)
            if pix.n < 5:       # this is GRAY or RGB
                pix.writePNG("p%s-%s.png" % (i, xref))
            else:               # CMYK: convert to RGB first
                pix1 = fitz.Pixmap(fitz.csRGB, pix)
                pix1.writePNG("p%s-%s.png" % (i, xref))
                pix1 = None
            pix = None


def to_txt(filename):
    doc = fitz.open(filename)
    for i in range(len(doc)):
        page = doc.loadPage(i)
        for id in {
                # "text": 0,
                # "html": 1,
                # "json": 1,
                "rawjson": 1,
                # "xml": 0,
                # "xhtml": 1,
                "dict": 1,
                # "rawdict": 1,
                # "words": 0,
                "blocks": 1,
            }.keys():
            print(f'=========================>>>>>>>>>> {id}')
            text = page.getText(id)
            print(text)


if __name__ == "__main__":
    to_txt(filename)
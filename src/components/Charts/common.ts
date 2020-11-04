export const getTextDimension = (str: string, size: number): any => {
    const text = document.createElement("span");
    document.body.appendChild(text);

    text.style.font = "times new roman";
    text.style.fontSize = `${size}px`;
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = str;

    const width = Math.ceil(text.clientWidth);
    const height = Math.ceil(text.clientHeight);
    document.body.removeChild(text);
    return {width, height};
}

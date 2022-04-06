const savedContainer = document.querySelector('.saved-boards')!

export function addDrawingToSaved(url: string) {
    const image = document.createElement('img')
    image.src = url
    savedContainer.insertBefore(image, savedContainer.firstChild)
}
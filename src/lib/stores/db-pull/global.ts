

export async function fetchAPI(localFilePath: string='', debug: boolean=false) {
    let response: Response;
    if (debug) {
        response = await fetch(localFilePath);
    } else {
        response = await fetch('https://api.example.com/data');
    }
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
}
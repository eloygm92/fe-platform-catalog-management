

export async function get(url) {
  return await fetch(url)
    .then(response => response.json());
}
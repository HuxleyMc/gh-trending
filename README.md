# GitHub Trending API

This repository provides an API to fetch trending repositories and developers from GitHub. The API is hosted at the base URL: `https://gh-trending.vercel.app`.

## API Endpoints

### Get Trending Repositories

Endpoint: `/api/trending`

#### Optional Parameters

- `since`: Filter repositories by trending duration. Possible values: `daily`, `weekly`, `monthly`.
- `spoken_language_code`: Filter repositories by spoken language code. Possible values: `en`, `jp`, etc.

#### Response Format

The API will return a JSON array with trending repository information. Each object in the array will have the following properties:

- `author`: The username of the repository owner.
- `avatar`: The URL of the owner's avatar image.
- `builtBy`: An array of contributors who built the repository. Each object in this array contains the following properties:
  - `avatar`: The URL of the contributor's avatar image.
  - `url`: The URL to the contributor's GitHub profile.
  - `username`: The username of the contributor.
- `canSponsor`: A boolean value indicating whether the repository can be sponsored.
- `description`: A brief description of the repository.
- `forks`: The number of forks the repository has.
- `language`: The primary programming language used in the repository.
- `languageColor`: The color representing the programming language.
- `name`: The name of the repository.
- `newStars`: The number of new stars the repository received in the trending duration.
- `stars`: The total number of stars the repository has.
- `url`: The URL to the repository on GitHub.

### Get Trending Repositories For A Language

Endpoint: `/api/trending/[language]`
Example: `/api/trending/swift`

#### Optional Parameters

- `since`: Filter repositories by trending duration. Possible values: `daily`, `weekly`, `monthly`.
- `spoken_language_code`: Filter repositories by spoken language code. Possible values: `en`, `jp`, etc.

#### Response Format

The API will return a JSON array with trending Swift repository information. Each object in the array will have the same properties as the general trending repositories.

### Get Trending Developers

Endpoint: `/api/trending/developers`

#### Optional Parameters

- `since`: Filter developers by trending duration. Possible values: `daily`, `weekly`, `monthly`.
- `sponsorable`: Filter developers who are sponsorable. Possible value: `1` (true).

#### Response Format

The API will return a JSON array with trending developer information. Each object in the array will have the following properties:

- `name`: The name of the developer.
- `nickname`: The nickname of the developer.
- `avatar`: The URL of the developer's avatar image.
- `url`: The URL to the developer's GitHub profile.
- `popularRepository`: An object containing information about the developer's popular repository with the following properties:
  - `name`: The name of the repository.
  - `description`: A brief description of the repository.
  - `url`: The URL to the repository on GitHub.
- `canSponsor`: A boolean value indicating whether the developer can be sponsored.

### Get Trending Developers For A Language

Endpoint: `/api/trending/developers/[language]`
Example: `/api/trending/developers/swift`

#### Optional Parameters

- `since`: Filter developers by trending duration. Possible values: `daily`, `weekly`, `monthly`.
- `sponsorable`: Filter developers who are sponsorable. Possible value: `1` (true).

#### Response Format

The API will return a JSON array with trending Swift developer information. Each object in the array will have the same properties as the general trending developers.

## How to Use

To use the API, simply make HTTP GET requests to the desired endpoints with optional parameters, and the API will respond with the trending data in the specified format.

Example Request: `GET https://gh-trending.vercel.app/api/trending?since=weekly&spoken_language_code=en`

Example Response:
```
[
    {"author":"huggingface","avatar":"https://github.com/huggingface.png","builtBy":[{"avatar":"https://avatars.githubusercontent.com/u/23298448?s=40&v=4","url":"https://github.com/OlivierDehaene","username":"OlivierDehaene"},{"avatar":"https://avatars.githubusercontent.com/u/204321?s=40&v=4","url":"https://github.com/Narsil","username":"Narsil"},{"avatar":"https://avatars.githubusercontent.com/u/16958488?s=40&v=4","url":"https://github.com/njhill","username":"njhill"},{"avatar":"https://avatars.githubusercontent.com/u/10364161?s=40&v=4","url":"https://github.com/Yard1","username":"Yard1"},{"avatar":"https://avatars.githubusercontent.com/u/858040?s=40&v=4","url":"https://github.com/yk","username":"yk"}],"canSponsor":false,"description":"Large Language Model Text Generation Inference","forks":366,"language":"Python","languageColor":"#3572A5","name":"text-generation-inference","newStars":74,"stars":3684,"url":"https://github.com/huggingface/text-generation-inference"},
    // Additional trending repositories...
]
```

Feel free to explore and integrate this API into your projects to stay updated with the latest trending repositories and developers on GitHub. If you have any questions or feedback, please feel free to reach out.

Happy coding! 🚀
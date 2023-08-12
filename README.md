
# GH Trending
This repository provides an API/GraphQL endpoint to fetch trending repositories and developers from GitHub.




## FAQ

#### GraphQL Endpoint (Including Playground)

https://gh-trending.vercel.app/api/graphql

#### REST Endpoint

https://gh-trending.vercel.app/api


Feel free to explore and integrate this API into your projects to stay updated with the latest trending repositories and developers on GitHub. 

If you have any questions or feedback, please feel free to create an [issue](https://github.com/HuxleyMc/gh-trending/issues) as this is the best way for me to see it and keep track.

Happy coding! 🚀
## Used By

This project is used by the following:

None yet but if you do, let me know and I will add it here.

## API Reference

#### Get all trending repositories

```http
  GET /api/trending
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `since` | `string` | Filter repositories by trending duration. `daily`, `weekly` or `monthly` |
| `spoken_language_code` | `string` | Spoken language of the repository `en`, `ja`, `zh`... |

```json
[
    {
        "author": "axios",
        "avatar": "https://github.com/axios.png",
        "canSponsor": true,
        "description": "Promise based HTTP client for the browser and node.js",
        "forks": 10452,
        "language": "JavaScript",
        "languageColor": "#f1e05a",
        "name": "axios",
        "newStars": 14,
        "stars": 101222,
        "url": "https://github.com/axios/axios",
        "builtBy": [
            {
              "avatar": "https://avatars.githubusercontent.com/u/4814473?s=40&v=4",
              "url": "https://github.com/jasonsaayman",
              "username": "jasonsaayman"
            },
            ...
        ]
    },
    ...
]
```



#### Get all trending repositories for a language

```http
  GET /api/trending/:language:
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `since` | `string` | Filter repositories by trending duration. `daily`, `weekly` or `monthly` |
| `spoken_language_code` | `string` | Spoken language of the repository `en`, `ja`, `zh`... |

```json
[
    {
        "author": "axios",
        "avatar": "https://github.com/axios.png",
        "canSponsor": true,
        "description": "Promise based HTTP client for the browser and node.js",
        "forks": 10452,
        "language": "JavaScript",
        "languageColor": "#f1e05a",
        "name": "axios",
        "newStars": 14,
        "stars": 101222,
        "url": "https://github.com/axios/axios",
        "builtBy": [
            {
              "avatar": "https://avatars.githubusercontent.com/u/4814473?s=40&v=4",
              "url": "https://github.com/jasonsaayman",
              "username": "jasonsaayman"
            },
            ...
        ]
    },
    ...
]
```


#### Get all trending developers

```http
  GET /api/trending/developers
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `since` | `string` | Filter developers by trending duration. `daily`, `weekly` or `monthly` |
| `sponsorable` | `string` | Weaither this developer can be sponsered `1` |

```json

[
    {
        "popularRepository": {
            "description": "egui: an easy-to-use immediate mode GUI in Rust that runs on both web and native",
            "name": "egui",
            "url": "https://github.com/emilk/egui"
        },
        "canSponsor": false,
        "url": "https://github.com/emilk",
        "nickname": "emilk",
        "name": "Emil Ernerfeldt",
        "avatar": "https://avatars.githubusercontent.com/u/1148717?s=96&v=4"
    },
    ...
]
```



#### Get all trending developers for a language

```http
  GET /api/trending/developers/:language:
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `since` | `string` | Filter developers by trending duration. `daily`, `weekly` or `monthly` |
| `sponsorable` | `string` | Weaither this developer can be sponsered `1` |

```json

[
    {
        "popularRepository": {
            "description": "egui: an easy-to-use immediate mode GUI in Rust that runs on both web and native",
            "name": "egui",
            "url": "https://github.com/emilk/egui"
        },
        "canSponsor": false,
        "url": "https://github.com/emilk",
        "nickname": "emilk",
        "name": "Emil Ernerfeldt",
        "avatar": "https://avatars.githubusercontent.com/u/1148717?s=96&v=4"
    },
    ...
]
```


## Run Locally WIP

Clone the project

```bash
  git clone https://github.com/HuxleyMc/gh-trending
```

Go to the project directory

```bash
  cd gh-trending
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Tech Stack

**Frontend:** NextJS, TailwindCSS

**API:** GraphQL Yoga, Vercel KV, Zod, Cheerio


## Acknowledgements
Shout-out to these two project which inspired me to make this project.
 - [github-trending-api](https://github.com/huchenme/github-trending-api)
 - [Github-Trending-API](https://github.com/NiklasTiede/Github-Trending-API)


## License

[MIT](https://github.com/HuxleyMc/gh-trending#MIT-1)


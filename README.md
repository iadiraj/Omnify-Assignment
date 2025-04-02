# Fullstack Blog Application

Fullstack Blog Application using Spingboot as Backend, React with Vite(Frontend Tooling) as Frontend, PostgreSQL as Database deployed on AWS.

## Authors

- [@iadiraj](https://www.github.com/iadiraj)

## API Reference

### Authentication API

#### Sign Up

```http
POST /api/v1/auth
```

##### Request Body

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `email`    | `string` | **Required**. User's email    |
| `password` | `string` | **Required**. User's password |
| `name`     | `string` | **Required**. User's name     |

##### Response

Returns the created user object.

#### Login

```http
POST /api/v1/auth/login
```

##### Request Body

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `email`    | `string` | **Required**. User's email    |
| `password` | `string` | **Required**. User's password |

##### Response

Returns an access token and sets refresh token as an HTTP-only cookie.

#### Refresh Token

```http
POST /api/v1/auth/refresh
```

##### Response

Returns a new access token if the refresh token is valid.

#### Logout

```http
POST /api/v1/auth/logout
```

##### Response

Clears authentication cookies and logs the user out.

#### Delete Account

```http
DELETE /api/v1/auth
```

##### Response

Deletes the user account and clears authentication cookies.

#### Get Current User

```http
GET /api/v1/auth
```

##### Response

Returns the authenticated user’s details.

---

### Blog API

#### Get Blog by ID

```http
GET /api/v1/blogs/{id}
```

##### Path Parameters

| Parameter | Type  | Description                    |
| --------- | ----- | ------------------------------ |
| `id`      | `int` | **Required**. Blog ID to fetch |

##### Response

Returns the blog details.

#### Get All Blogs

```http
GET /api/v1/blogs
```

##### Query Parameters

| Parameter    | Type  | Description                                            |
| ------------ | ----- | ------------------------------------------------------ |
| `pageOffset` | `int` | **Optional**. Page number (default: 0)                 |
| `pageSize`   | `int` | **Optional**. Number of results per page (default: 10) |

##### Response

Returns a paginated list of blogs.

#### Get User's Blogs

```http
GET /api/v1/blogs/myblogs
```

##### Query Parameters

| Parameter    | Type  | Description                                            |
| ------------ | ----- | ------------------------------------------------------ |
| `pageOffset` | `int` | **Optional**. Page number (default: 0)                 |
| `pageSize`   | `int` | **Optional**. Number of results per page (default: 10) |

##### Response

Returns a list of blogs created by the authenticated user.

#### Create a Blog

```http
POST /api/v1/blogs
```

##### Request Body

| Parameter | Type     | Description                |
| --------- | -------- | -------------------------- |
| `title`   | `string` | **Required**. Blog title   |
| `content` | `string` | **Required**. Blog content |

##### Response

Returns the created blog object.

#### Update a Blog

```http
PATCH /api/v1/blogs/{id}
```

##### Path Parameters

| Parameter | Type  | Description                     |
| --------- | ----- | ------------------------------- |
| `id`      | `int` | **Required**. Blog ID to update |

##### Request Body

| Parameter | Type     | Description                    |
| --------- | -------- | ------------------------------ |
| `title`   | `string` | **Optional**. New blog title   |
| `content` | `string` | **Optional**. New blog content |

##### Response

Returns the updated blog object.

#### Delete a Blog

```http
DELETE /api/v1/blogs/{id}
```

##### Path Parameters

| Parameter | Type  | Description                     |
| --------- | ----- | ------------------------------- |
| `id`      | `int` | **Required**. Blog ID to delete |

##### Response

Confirms that the blog was deleted successfully.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Frontend

`VITE_BASE_URL`

### Backend

`DATABASE_URL`
`DATABASE_NAME`
`DATABASE_USERNAME`
`DATABASE_PASSWORD`
`JWT_SECRET`

## Features

#### Authentication

- Login
- Signup
- Logout
- Delete Account

#### Blog Crud

- Read Blog
- Create Blog
- Delete Blog
- Update Blog

## Run Locally

Clone the project

```bash
  git clone https://github.com/iadiraj/Omnify-Assignment.git
```

Install Docker on your system.

Go to the project directory and run this command

```bash
  docker compose up
```

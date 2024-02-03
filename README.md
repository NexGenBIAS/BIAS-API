
# BIAS API

#### [Updated : 03/02/2024 at 2:00PM]
The API documentation. each POST request accepts data in req.body.

API : http://65.0.14.141:4000


## API Documentation



#### Generate Assignment

```http
  POST /api/generate
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subject` | `string` | **Required**. Assignment subject prefix (ex. bis)|
| `number` | `string` | **Required**. Assignment number (ex. 1)|
| `qs` | `array(string)` | **Required**. Assignment questions as array|
| `username` | `string` | **Required**. User's name|
| `authKey` | `string` |  a key required to grant admin access to the user. this will store the assignment file in the server database.|
| `type` | `string` | **Required**. File type (eg. "assignment","experimentb2","experimentb3" etc)|
| `givendate` | `string` |  the date on which the assignment/experiment was given|
| `submissiondate` | `string` |  the date on which the assignment/experiment is to be submitted|



```http
  RESPONSE ON SUCCESS 
  { 
  success : true, 
  data : "Assignment successfully created",
  temp : "[file suffix]" //string eg. "-temp173294984234"
  }

  RESPONSE ON SUCCESS (FOR ADMIN)
  { 
  success : true, 
  data : "Assignment successfully created",
  temp : false
  }

  RESPONSE ON ERROR
  {
  success :  false,
  data : "Internal Server Error"
  }
```

#### View Assignment/Experiment PDF

```http
  GET /api/view/subject/filename
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subject` | `string` | **Required**. Assignment subject prefix (ex. bis)|
| `filename` | `string` | **Required**. the filename which is stored at the backend (read the Filename section at the bottom of this document)|

```http
  RESPONSE ON SUCCESS 
  shows file on success, downloads file on phone.

  RESPONSE ON ERROR
  {
  success :  false,
  data : "Assignment does not exist"
  }
```


#### View Assignment/Experiment MD (for editor)

```http
  GET /api/viewmd/subject/filename
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subject` | `string` | **Required**.  subject prefix (ex. bis)|
| `filename` | `string` | **Required**. the filename which is stored at the backend (read the Filename section at the bottom of this document)|

```http
  RESPONSE ON SUCCESS 
  sends textual content of the file

  RESPONSE ON ERROR
  {
  success :  false,
  data : "File does not exist"
  }
```


#### Delete Assignment/Experiment

```http
  POST /api/delete
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `subject` | `string` | **Required**. Assignment subject prefix (ex. bis)|
| `number` | `string` | **Required**. Assignment number (ex. 1)|
| `username` | `string` | **Required**. User's name|
| `authKey` | `string` | **Required** a key required to grant admin access to the user. this will store the assignment file in the server database.|
| `type` | `string` | **Required**. File type (eg. "assignment","experimentb2","experimentb3" etc)|




```http
  RESPONSE ON SUCCESS (ADMIN ACCESS GRANTED)
  { 
  success : true, 
  data : "deleted"
  }

  RESPONSE ON FAIL (ADMIN ACCESS DENIED)
  { 
  success : false, 
  data : "Access denied",
  temp : false
  }

  RESPONSE ON ERROR
  {
  success :  false,
  data : "File does not exist"
  }
```

#### Get details about a Subject

```http
  GET /api/details/subject
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `subject`      | `string` | **Required**. subject prefix (ex. bis) |

```http
  RESPONSE ON SUCCESS 
  {
  "success": true,
  "data": {
    "subject": "Business Intelligence System",
    "subjectPrefix": "bis",
    "totalAssignments": 2,
    "totalExperiments": 0,
    "totalQuestionBanks": 0,
    "assignments": {
      "1": {
        "subjectPrefix": "bis",
        "qs": [
          "Define empathy map? Describe quadrants of empathy map with the aid of an example? Provide JPG image URLs wherever necessary"
        ],
        "number": "1",
        "givenOn": "Thu, Feb 01",
        "submission": "Unown",
        "type": "",
        "uploadedBy": "mayurhiwale",
        "path": "./documents/bis/bis1.pdf"
      },
      "2": {
        "subjectPrefix": "bis",
        "qs": ["test"],
        "number": 2,
        "givenOn": "Sat Jan 27 2024 16:03:05 GMT+0530 (India Standard Time)",
        "submission": null,
        "type": "",
        "uploadedBy": "Mayur",
        "path": "./documents/bis/bis2.pdf"
      }
    },
    "experiments": {},
    "questionbanks": {}
  }
}



RESPONSE ON ERROR
  {
  success :  false,
  data : "Invalid subject"
  }

```




## Filename Structure
``[subject prefix][unit/exp number][suffix][batch/QBank number]``



To differentiate between assignment, experiments, question bank etc we will be ending the filename with a suffix.

**For assignments there is no suffix**

## Suffix Reference

| File Type | Suffix     | Filename Example                |
| :-------- | :------- | :------------------------- |
| Assignment | none | bis1 |
| Experiment | expb[batch number] | bis1expb2 |
| Question Bank | qb | bisqb1 |
| Question Bank 2 | qb2 | bisqb2 |



## Authors

- [@mayur_hiwale](https://www.github.com/isenseaura)


# Example

```yaml
expedition region
name: 
	type: string
	description: stuff
points: string[]
ponts2: {
	- title: string
	- name: number
}[]
- points3: array(string)

expedition
- title: string
- date: date
- region: ->expedition-region
- description: text
- slug: PrefixedSlug
- thing: ->place-mcgee[]

thing
- stuff: {
	- lastname: string
	- firstname: string
}[]
```




# What is this
A bulk Sanity.io schema and file generator. Type your schemas (images, arrays, objects, whatecer you want) in yaml with basic validation rules and print them to files for your frontend and CMS.

<strong>Why</strong>
I got tired of writing all my Sanity schmeas by hand. Tons of objects and validation parameters, a few hours of work every time to get right, THEN I had to go make frontend files and type them accordingly. Heavily inspired by (plopjs)[https://www.npmjs.com/package/plop] and built specifically to generate Typesafe frontend files and schemas.


# Syntax

## Gotchas
90% of the syntax is native yaml. But we don't have support for native yaml arrays. The `[]` was chosen over this for its similarity to typescript (LINK TO THIS) and removing the need for keys in arrays, as Sanity doesn't need them either.

## Basics
The basic structure of schemas within YAML is key/value pairs. Keys are field names, and values are field types.

## Supported Field Types

| Sanity Field Type | Basic YAML Syntax             | Description                                   | Advanced Syntax Example                |
|:------------------|:-----------------------------|:-----------------------------------------------|:---------------------------------------|
| `array`           | `tags[]: {fieldName}`        | Array of any field type                        |                                         |
| `boolean`         | `isActive: boolean`          | `true`/`false` value                           |                                         |
| `date`            | `eventDate: date`            | ISO-format date string                         |                                         |
| `datetime`        | `publishedDate: datetime`    | ISO-format date/time string                    |                                         |
| `email`           | `contact: email`             | String field with added email validation rule  |                                         |
| `geopoint`        | `location: geopoint`         | Point with lat/lng                             |                                         |
| `image`           | `thumbnail: image`           | Sanity image field                             |                                         |
| `number`          | `count: number`              | Numeric value (integer or float)               |                                         |
| `object`          | ``` stuff: -thing - thing ```| Nested fields as an object                     |                                         |
| `reference`       | `author: ->author`           | Reference (relation) to another document       | `category: ->category[]` (array of refs)|
| `reference array` | `clothing[]: ->(shirts,pants)` | Reference (relation) to another document       | `category: ->category[]` (array of refs)|
| `slug`            | `slug: slug`                 | Slug with optional soure parameter             |  `slug: slug(title)`                    |
| `string`          | `name: string`               | Plain text string                              | `status: string(active, inactive)`      |
| `text`            | `description: text(4)`       | Plain text with multiple lines                 |                                         |


> 📝 A note on arrays: They can be mixed with ANY type. image[], number[], whatever you want.


## Field Validation
All field validation works together

### Required
An exclamation point `!` after the field name and before the colon, marks a field required and compiles to: Rule = () => Rule.required()`

```yaml
SliceName
  fieldName!: string
```

### Minimum Length
A number `\d+` after the field name and before the colon, marks a field as needing a minimum number of items. Compiles to: `validation: (Rule: any)=>Rule.max(${max})`.
```yaml
SliceName
  fieldName4: string
```
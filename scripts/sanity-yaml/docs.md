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



## required (max)

```yaml
page
- title!:strng
- names!4:string[]
```


```

## string options list

```yaml
expedition
- categories: ['stuff', 'this', 'that']
- otherCategories: [{title: 'string', value: 'stuff'}, {title: 'string', value: 'stuff2'}][]
```

^^ if the object contains a VALUE attribute, its a string array with predetermined values
> Make sure to handle the type right for this, just roll thru the value attrs and list as type like: 

```ts


type YourType = {
	otherCategories?: 'stuff' | 'stuff2'
}

```

## Typing references

```ts

type ThingyThing = {
	region: {
		name?: string
		num?: number
		index?: number
	}
}

```


# Syntax

## Basics
The basic structure of schemas within YAML is key/value pairs. Keys are field names, and values are field types.

## Supported Field Types


| Sanity Field Type | Basic YAML Syntax             | Description                                   | Advanced Syntax Example                 |
|:------------------|:-----------------------------|:-----------------------------------------------|:----------------------------------------|
| `array`           | `tags: {fieldType}[]`        | Array of any field type                       | `categories: ['value1', 'value2']`     |
| `boolean`         | `isActive: boolean`          | `true`/`false` value                          |                                        |
| `date`            | `eventDate: date`            | ISO-format date string                        |                                        |
| `datetime`        | `publishedDate: datetime`    | ISO-format date/time string                   |                                        |
| `geopoint`        | `location: geopoint`         | Point with lat/lng                            |                                        |
| `image`           | `thumbnail: image`           | Sanity image field                            |                                        |
| `number`          | `count: number`              | Numeric value (integer or float)              | `score: number(1, 10)`                 |
| `object`          | <pre>item:\n  label: string\n  value: string</pre> | Nested fields as an object        | <pre>options:\n  title: string\n  code: string</pre> |
| `reference`       | `author: ->author`           | Reference (relation) to another document      | `category: ->category[]` (array of refs)|
| `string`          | `name: string`               | Plain text string                             | `status: string(active, inactive)`      |
| `text`            | `description: text(4)`       | Plain text with multiple rows                 |                                        |

<strong>Coming soon:</strong>
- File with mime-type validations and subfields
- slug


> 📝 A note on arrays: They can be mixed with ANY type. image[], number[], whatever you want.

**Tip:**  
- Arrays of objects can be represented by using a list of indented fields under the array key, e.g.:
  ```yaml
  items:
    label: string
    value: number
  ```
- Arrays of primitives:
  ```yaml
  tags: ['active', 'archived']
  ```


## Field Validation

### Required
An exclamation point `!` after the field name and before the colon, marks a field required and compiles to: Rule = () => Rule.required()`

```yaml
SliceName
  fieldName!: string
```

### Minimum Length
A number `\d+` after the field name and before the colon, marks a field as needing a minimum number of items. Compiles to: `validation: (Rule: any)=>Rule.max(${max})`
```yaml
SliceName
  fieldName4: string
```
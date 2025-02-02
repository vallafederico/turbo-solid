export default {
  name: 'location', 
  type: 'object', 
  fields: [
    {
      name: 'name', 
      type: 'string',
    }, 
    {
      name: 'coords', 
      type: 'geopoint',
    }
  ]
}
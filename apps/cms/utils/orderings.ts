
type OrderingItem = {
  title: string,
  field: string,
  direction: 'asc' | 'desc'
}

export const createOrderings = (orders: OrderingItem[]) => {

  return orders.filter((o) => {
    
    if(!o.title || !o.field || !o.direction) {
      console.error('Ordering item must have a title, field, and direction')
      return false
    }

    return true

  }).map(order => { 
    return {
      title: order.title,
      name: (order.field || order.title) + order.direction,
      by: [
        { field: order.field, direction: order.direction }
      ]
    }
  }).sort((a, b) => a.title.localeCompare(b.title))

}
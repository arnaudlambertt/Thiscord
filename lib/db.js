const data = {
  channels: [{
    id: '1',
    name: 'Channel 1',
  },{
    id: '2',
    name: 'Channel 2',
  },{
    id: '3',
    name: 'Channel 3',
  }]
}

module.exports = {
  list : () => {
  return new Promise((resolve) => {
      resolve(data.channels)
    })
  },
  get : (id) => {
    return Promise.resolve(data.channels.find(channel => channel.id === id))
  }
}

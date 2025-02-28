const MAX_REQUEST_SIZE = 4000000 // bytes

const getArrayByteSize = (arr: Array<any>) => {
  return new Blob([JSON.stringify(arr)]).size
}

export const splitRequests = (arr: Array<any>) => {
  const totalSize = getArrayByteSize(arr)
  const requestCount = Math.ceil(totalSize / MAX_REQUEST_SIZE)
  const chunkSize = Math.ceil(arr.length / requestCount)
  const requestChunks = []

  for (let i = 0; i < requestCount; i++) {
    const start = i * chunkSize
    const end = (i + 1) * chunkSize
    requestChunks.push(arr.slice(start, end))
  }

  if (requestCount > 1) {
    console.log(
      `🪓 Request size exceeds ${MAX_REQUEST_SIZE} bytes. Splitting into ${requestCount} requests.`,
    )
  }

  return {requestChunks, requestCount, chunkSize, totalSize}
}
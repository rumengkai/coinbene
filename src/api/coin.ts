import request from '@/utils/request'

export const getOrderBook = (symbol: string, depth: number) =>
request({
	url: 'http://api.coinbene.com/v1/market/orderbook',
	method: 'get',
	params: { symbol, depth }
})

export const getTrades = (symbol: string, size: number) =>
request({
	url: 'http://api.coinbene.com/v1/market/trades',
	method: 'get',
	params: { symbol, size }
})


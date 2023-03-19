// import { shallowMount } from '@vue/test-utils'
import CommonApi from '@/common/commonapi'

/*
describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld, {
      props: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
*/

test('CommonApi.padZero', () => {
  expect(CommonApi.padZero(0, 1)).toEqual('0')
  expect(CommonApi.padZero(0, 2)).toEqual('00')
  expect(CommonApi.padZero(10, 3)).toEqual('010')
  expect(CommonApi.padZero(-5, 2)).toEqual('-05')
  expect(CommonApi.padZero(-15, 2)).toEqual('-15')
  expect(CommonApi.padZero(-15, 3)).toEqual('-015')
  expect(CommonApi.padZero(10000, 4)).toEqual('10000')
  expect(CommonApi.padZero(100, 4)).toEqual('0100')
  expect(CommonApi.padZero(-1234, 3)).toEqual('-1234')
})

test('CommonApi.dateToString', () => {
  expect(CommonApi.dateToString(new Date('2020/01/02 13:14:15'))).toEqual('2020年1月2日')
  expect(CommonApi.dateToString(new Date('2020/01/02 13:14:15'), false)).toEqual('2020年1月2日')
  expect(CommonApi.dateToString(new Date('2020/01/02 13:14:15'), true)).toEqual('2020年1月2日 13:14:15')
  expect(CommonApi.dateToString(new Date('2020/01/02 03:04:05'), true)).toEqual('2020年1月2日 03:04:05')
})

test('CommonApi.shortenDate', () => {
  expect(CommonApi.shortenDate(new Date(), new Date(new Date().getTime() + 1 * CommonApi.second), 1)).toEqual('0秒前')
  expect(CommonApi.shortenDate(new Date(), new Date(new Date().getTime() - 10 * CommonApi.second), 1)).toEqual('10秒前')
  expect(CommonApi.shortenDate(new Date(), new Date(new Date().getTime() - 10 * CommonApi.minute), 1)).toEqual('10分前')
  expect(CommonApi.shortenDate(new Date(), new Date(new Date().getTime() - 10 * CommonApi.hour), 1)).toEqual('10時間前')
  expect(CommonApi.shortenDate(new Date(), new Date(new Date().getTime() - 10 * CommonApi.day), 11)).toEqual('10日前')

  expect(CommonApi.shortenDate(new Date(), new Date(new Date().getTime() - 10 * CommonApi.day * 2), 1)).toEqual(undefined)
})

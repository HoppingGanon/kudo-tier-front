// import { shallowMount } from '@vue/test-utils'
import { ReviewFunc } from '@/common/review'
import base64Api from '@/common/base64api'
import { tier } from '@/common/dummy'

test('ReviewFunc.cloneTier', () => {
  expect(tier).toEqual(ReviewFunc.cloneTier(tier))
})

// 文字列"あいうえお"で比較
test('base64Api.dataURLToBase64', () => {
  expect('44GC44GE44GG44GI44GK').toEqual(base64Api.dataURLToBase64('data:text/plain;base64,44GC44GE44GG44GI44GK'))
})

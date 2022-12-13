// import { shallowMount } from '@vue/test-utils'
import { ReviewFunc } from '@/common/review'
import { tier } from '@/common/dummy'

test('ReviewFunc.cloneTier', () => {
  expect(tier).toEqual(ReviewFunc.cloneTier(tier))
})

// 文字列"あいうえお"で比較
test('ReviewFunc.dataURLToBase64', () => {
  expect('44GC44GE44GG44GI44GK').toEqual(ReviewFunc.dataURLToBase64('data:text/plain;base64,44GC44GE44GG44GI44GK'))
})

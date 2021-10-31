import { ElementType } from "../constant"






const returnFiber = {

}

const currentFirstChild = null

const element = {
  key: 'mykey'
}

const ret = reconcileSingleElement(
  returnFiber,
  currentFirstChild,
  element
)
console.log(ret)

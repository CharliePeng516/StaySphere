/**
 * 使用 Suspense 实现懒加载组件
 * https://zh-hans.react.dev/reference/react/lazy#lazy
 */
import { Suspense } from 'react'
import { Spin } from 'antd'

export default function lazyLoad(LazyComponent) {
  return (
    <Suspense 
      fallback={
        <Spin
					size="large"
          delay={1000}
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						height: "100%"
					}}
				/>
        }>
      <LazyComponent />
    </Suspense>
  )
}
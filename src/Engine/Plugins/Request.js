/**
 * 请求一般会涉及到局部渲染运行时、事件通信
 * 需要做一个公共请求识别的控制，确保多个组件可以使用同一个请求返回的数据
 * 公共请求的处理不限制于同类组件，也可以用于不同类组件
 * 请求可以根据组件加载状态、参数和事件分为以下十种：
 * - 加载完成时请求，不带参数
 * - 加载完成时请求，表单外部传入静态参数
 * - 加载完成时请求，表单外部传入动态参数
 * - 加载完成时请求，表单内部传入静态参数
 * - 加载完成时请求，表单内部传入动态参数
 * - 动作触发请求，不带参数
 * - 动作触发请求，表单外部传入静态参数
 * - 动作触发请求，表单外部传入动态参数
 * - 动作触发请求，表单内部传入静态参数
 * - 动作触发请求，表单内部传入动态参数
 */

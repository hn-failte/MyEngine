/**
 * 值管理：所有组件的状态存储在一个位置
 * 值是一个对象，根节点为表单主体，根节点的key会传递到子节点（请确保子节点key的唯一性），值在变更时会先查找父级，再根据关系更新整体对象值
 * 每个状态都具有不可变性（immutable）
 * 数据流向：
 * 1、初次渲染
 * 表单状态外部传入 => 表单公共状态改变 => 所有组件更新
 * 2、局部更新
 * 局部组件修改状态 => 表单公共状态改变 => 局部组件更新
 * 3、整体更新
 * 修改表单key或者手动调用forceUpdate => 表单公共状态改变 => 所有组件更新
 */
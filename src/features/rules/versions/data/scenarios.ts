export type Scenario = {
  id: string
  name: string
  code: string
}

export const scenarios: Scenario[] = [
  {
    id: '1',
    name: '用户登录场景',
    code: 'SCENE_LOGIN_001',
  },
  {
    id: '2',
    name: '支付交易场景',
    code: 'SCENE_PAYMENT_002',
  },
  {
    id: '3',
    name: '数据访问场景',
    code: 'SCENE_DATA_003',
  },
  {
    id: '4',
    name: '内容审核场景',
    code: 'SCENE_CONTENT_004',
  },
  {
    id: '5',
    name: '风控检测场景',
    code: 'SCENE_RISK_005',
  },
]

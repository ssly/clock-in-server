## clock_user 用户表

| 字段 | 类型 | 属性 |
| --- | --- | --- |
| openid | string | 微信唯一标志 |
| nickName | string | 昵称 |
| gender | string | 性别，1男 2女 |
| language | string | zh_CN 中国 |
| country | string | 国家 |
| province | string | 省份 |
| city | string | 城市 |
| avatarUrl | string | 头像地址 |
| clockCount | number | 打卡总次数 |
| continuousCount | number | 连续打卡次数 |
| maxContinuousCount | number | 最高连续打卡次数 |
| validStartTime | string | '06:00:00' 有效打卡时间起始 |
| validEndTime | string | '08:00:00' 有效打卡时间截止 |

## clock_data_[_id] 用户数据表

| 字段 | 类型 | 属性 |
| --- | --- | --- |
| year | number | 年 |
| month | number | 月 |
| date | number | 日 |
| clockTimestamp | number | 打卡时间戳 |

## clock

### POST /api/clock/set-valid-time

设置有效打卡时间

#### request body
```json
{
  "startTime": "06:30:00",
  "endTime": "07:30:00"
}
```

#### response

- 成功
  ```json
  {
    "code": "0",
    "data": true
  }
  ```
- 失败
  ```json
  {
    "code": "1",
    "message": "失败信息"
  }
  ```

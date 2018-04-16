[学生注册](#POST/user/signup)
[教师注册](#POST/teacher/signup)
[用户登陆](#POST/user)
[修改密码](#PUTuser/updatepwd/:userId)
[(教师,学生)只修改自己的个人信息](#PUT/user/:userId)


## <div id="/user/signup">学生注册(单条)</div>

`POST /user/signup`



|    名称    |   类型   |    定义     |  必需 |  默认值 | 说明 |
| --------- | -------- | ---------- | ---- | ----- |------ |
| user      | string | 用户账号     | 必需  |       |        |
| password | string  | 密码	      | 必需  |       |        |
| name     | string  | 用户名      | 可选   |       | name不做重复检查,所以目前可以存在相同名称 |
| grade | Number  | 入学年份	      | 可选  |       |        |
| class | string  | 班级	      | 可选  |       |        |
| major | string  | 专业	      | 可选  |       |        |
| status | Number  | 权限	      | 可选  |   1    |   1表示学生 8教师 9管理员 默认学生  |
| email     | string | 邮箱        | 可选   | ""   |        |
| updateDate | date  | 最后修改日期 | 不用    | 服务器当前时间 | 以后每次修改账号信息需要更新 |
| createDate | date  | 账号创建日期 | 不用   | 服务器当前日期  | 创建时自动创建 |

 成功(json):

```
{
    status: 0,
    statusInfo: {
            message: '注册成功'
          }
}
```

## <div id="/taecher/signup">教师注册(单条)</div>

`POST /teacher/signup`

|    名称    |   类型   |    定义     |  必需 |  默认值 | 说明 |
| --------- | -------- | ---------- | ---- | ----- |------ |
| user      | string | 用户账号     | 必需  |       |        |
| password | string  | 密码	      | 必需  |       |        |
| name     | string  | 用户名      | 必需   |       | name不做重复检查,所以目前可以存在相同名称 |
| grade | Number  | 入学年份	      | 必需  |       |        |
| class | string  | 班级	      | 必需  |       |        |
| major | string  | 专业	      | 可选  |       |        |
| status | Number  | 权限	      | 可选  |   1    |   1表示学生 8教师 9管理员 默认学生  |
| email     | string | 邮箱        | 可选   | ""   |        |
| updateDate | date  | 最后修改日期 | 不用    | 服务器当前时间 | 以后每次修改账号信息需要更新 |
| createDate | date  | 账号创建日期 | 不用   | 服务器当前日期  | 创建时自动创建 |

成功(json):

```
{
    status: 0,
    statusInfo: {
            message: '注册成功'
          }
}
```

# 用户登陆 <div id="POST/user"></div>

`POST /user`


|    名称    |   类型   |    定义     |  必需 |  默认值 | 说明 |
| --------- | -------- | ---------- | ---- | ----- |------ |
| user      | string | 用户账号     | 必需  |       |        |
| password | string  | 密码	      | 必需  |       |        |
 
成功(json):

```
{
    status: 0,
    statusInfo: {
      message: '登陆成功'
    },
    data: 
    {
      _id: '5a605efc0dae00055bc1505a', // 数据库中的_id
      grade: 2016, // 入学年份
      class: '软工1604', // 班级
      name: '蒋照鑫', // 姓名
      status: 1, // 权限
      major: '软件工程(中外合作)', // 专业
      tel: 13255766062 //手机号
    }
}
```

# 修改密码<div id="PUTuser/updatepwd/:userId"> </div>

`PUT user/updatepwd/:userId`

检查登陆

|    名称    |   类型   |    定义     |  必需 |  默认值 | 说明 |
| --------- | -------- | ---------- | ---- | ----- |------ |
| :userId      | string | 用户账号     | 必需  |       |        |
| password | string  | 密码	      | 必需  |       |        |


```
{
    status: 0,
    statusInfo: {
      message: '密码修改成功'
    }
}
```

# (教师,学生)只修改自己的个人信息 <div id="PUT/user/:userId"></div>

`PUT/user/:userId`

检查登陆

|    名称    |   类型   |    定义     |  必需 |  默认值 | 说明 |
| --------- | -------- | ---------- | ---- | ----- |------ |
| email      | string | 邮箱     | 必需  |       |        |
| tel | string  | 手机	      | 必需  |       |        |


```
{
	status: 0,
	statusInfo: {
	  message: '修改成功'
	}
}
```

# 查询所有学生信息<div id="/teacher/students"></div>

`/teacher/students`

检查status 不是学生

|    名称    |   类型   |    定义     |  必需 |  默认值 | 说明 |
| --------- | -------- | ---------- | ---- | ----- |------ |
| condition      | json | 需要筛选的json     | 可选  |       |        |
| skipto | number  | 从哪条数据开始查询   | 必需  |       |        |

